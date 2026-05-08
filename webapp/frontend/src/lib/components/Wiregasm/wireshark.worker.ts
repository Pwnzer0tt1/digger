console.log('Worker initializing...');

import { Buffer } from 'buffer';
import pako from 'pako';

// @ts-ignore
import wasmModuleCompressed from '@goodtools/wiregasm/dist/wiregasm.wasm.gz?url';
// @ts-ignore
import wasmDataCompressed from '@goodtools/wiregasm/dist/wiregasm.data.gz?url';

// @ts-ignore
import loadWiregasm from '@goodtools/wiregasm/dist/wiregasm';
import { Wiregasm, vectorToArray } from '@goodtools/wiregasm';

console.log('Worker imports loaded');

import type { WorkerMessageMap, WorkerResponseMap } from './types';

const DB_NAME = 'wiregasm-files';
const DB_VERSION = 2;
const DB_STORE_FILES = 'files';
const DB_STORE_PREFS = 'prefs';

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = (event) => {
			const db = req.result;
			if (event.oldVersion < 1) {
				db.createObjectStore(DB_STORE_FILES, { keyPath: 'path' });
			}
			if (event.oldVersion < 2) {
				db.createObjectStore(DB_STORE_PREFS, { keyPath: 'key' });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function idbSaveFile(path: string, name: string, data: Uint8Array): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE_FILES, 'readwrite');
		tx.objectStore(DB_STORE_FILES).put({ path, name, data: data.buffer });
		tx.oncomplete = () => { db.close(); resolve(); };
		tx.onerror = () => { db.close(); reject(tx.error); };
	});
}

async function idbDeleteFile(path: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE_FILES, 'readwrite');
		tx.objectStore(DB_STORE_FILES).delete(path);
		tx.oncomplete = () => { db.close(); resolve(); };
		tx.onerror = () => { db.close(); reject(tx.error); };
	});
}

async function idbLoadAllFiles(): Promise<{ path: string; name: string; data: ArrayBuffer }[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE_FILES, 'readonly');
		const req = tx.objectStore(DB_STORE_FILES).getAll();
		req.onsuccess = () => { db.close(); resolve(req.result || []); };
		req.onerror = () => { db.close(); reject(req.error); };
	});
}

async function idbSavePref(key: string, value: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE_PREFS, 'readwrite');
		tx.objectStore(DB_STORE_PREFS).put({ key, value });
		tx.oncomplete = () => { db.close(); resolve(); };
		tx.onerror = () => { db.close(); reject(tx.error); };
	});
}

async function idbLoadAllPrefs(): Promise<{ key: string; value: string }[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE_PREFS, 'readonly');
		const req = tx.objectStore(DB_STORE_PREFS).getAll();
		req.onsuccess = () => { db.close(); resolve(req.result || []); };
		req.onerror = () => { db.close(); reject(req.error); };
	});
}

async function idbClearAllPrefs(): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE_PREFS, 'readwrite');
		tx.objectStore(DB_STORE_PREFS).clear();
		tx.oncomplete = () => { db.close(); resolve(); };
		tx.onerror = () => { db.close(); reject(tx.error); };
	});
}

let wg = new Wiregasm();
const modifiedPrefs = new Map<string, string>();

function replacer(_: string, value: any) {
	if (value && value.constructor && value.constructor.name.startsWith('Vector')) {
		return vectorToArray(value);
	}
	return value;
}

const inflateRemoteBuffer = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Fetch failed for ${url}: ${res.status} ${res.statusText}`);
	}
	const buf = await res.arrayBuffer();
	try {
		return pako.inflate(buf).buffer;
	} catch (err) {
		return buf;
	}
};

const fetchPackages = async () => {
	const [wasm, data] = await Promise.all([
		await inflateRemoteBuffer(wasmModuleCompressed),
		await inflateRemoteBuffer(wasmDataCompressed)
	]);

	return { wasm, data };
};
let WASM: ArrayBuffer;
let DATA: ArrayBuffer;

console.log('Fetching packages from URLs:', wasmModuleCompressed, wasmDataCompressed);

const packagesPromise = fetchPackages().then(({ wasm, data }) => {
	console.log('Packages fetched!', wasm.byteLength, data.byteLength);
	WASM = wasm;
	DATA = data;
	return init(WASM, DATA);
}).catch((e) => {
	console.error('Failed to fetch packages:', e);
	postMessage({ type: 'error', error: e.toString() });
});

async function init(wasm: ArrayBuffer, data: ArrayBuffer) {
	try {
		await wg.init(loadWiregasm, {
			wasmBinary: wasm,
			getPreloadedPackage() {
				return data;
			},
			handleStatus: (type, status) =>
				postMessage({
					type: 'status',
					status,
					code: type
				})
		});
		const stored = await idbLoadAllFiles();
		for (const f of stored) {
			const targetDir = f.path.substring(0, f.path.lastIndexOf('/'));
			try { (wg.lib.FS as any).mkdirTree(targetDir); } catch { /* may exist */ }
			(wg.lib.FS as any).writeFile(f.path, new Uint8Array(f.data));
		}
		const savedPrefs = await idbLoadAllPrefs();
		for (const entry of savedPrefs) {
			const pipeIdx = entry.key.indexOf('|');
			if (pipeIdx < 0) continue;
			try {
				wg.set_pref(entry.key.substring(0, pipeIdx), entry.key.substring(pipeIdx + 1), entry.value);
				modifiedPrefs.set(entry.key, entry.value);
			} catch { /* pref may not exist in this version */ }
		}
		wg.apply_prefs();
		postMessage({ type: 'init' });
	} catch (e) {
		postMessage({ type: 'error', error: e });
	}
}

function serializePrefModule(mod: any): any {
	return {
		name: mod.name,
		title: mod.title,
		description: mod.description,
		use_gui: mod.use_gui,
		submodules: vectorToArray(mod.submodules).map(serializePrefModule)
	};
}

function serializePref(pref: any): any {
	const result: any = {
		name: pref.name,
		title: pref.title,
		description: pref.description,
		type: pref.type,
		uint_value: pref.uint_value,
		uint_base_value: pref.uint_base_value,
		bool_value: pref.bool_value,
		string_value: pref.string_value,
		range_value: pref.range_value,
	};
	if (pref.enumvals) {
		result.enumvals = vectorToArray(pref.enumvals).map((ev: any) => ({
			name: ev.name,
			value: ev.value,
			description: ev.description
		}));
	}
	return result;
}

const MESSAGE_STRATEGIES: {
	[K in keyof WorkerMessageMap]: (ev: MessageEvent<{ type: K } & WorkerMessageMap[K]>) => void;
} = {
	columns: (_ev) => {
		postMessage<'columned'>({
			type: 'columned',
			columns: wg.columns()
		});
	},
	select: (ev) => {
		const number = ev.data.number;
		const res = wg.frame(number);
		const temp = JSON.parse(JSON.stringify(res, replacer));
		postMessage<'selected'>({
			type: 'selected',
			tree: temp.tree,
			data_sources: temp.data_sources
		});
	},
	'select-frames': (ev) => {
		const filter = ev.data.filter;
		const res = wg.frames(filter, 0, 0);
		ev.ports[0].postMessage({
			data: JSON.parse(JSON.stringify(res, replacer))
		});
	},
	'check-filter': (ev) => {
		const filter = ev.data.filter || '';
		const res = wg.lib.checkFilter(filter);
		if (res.ok) {
			ev.ports[0].postMessage({ result: true });
		} else {
			ev.ports[0].postMessage({ error: res.error });
		}
	},
	process: async (ev) => {
		const name = ev.data.name;
		const data = ev.data.arrayBuffer;

		try {
			// Wait for initial package loading if it hasn't finished
			await packagesPromise;

			// 数据验证
			if (!data || data.byteLength === 0) {
				throw new Error('无效的数据缓冲区');
			}

			// 重置 Wiregasm 状态
			await init(WASM, DATA);

			// 创建新的 Buffer 并确保数据完整性
			const buffer = Buffer.from(new Uint8Array(data));
			if (buffer.length !== data.byteLength) {
				throw new Error('数据转换失败');
			}

			const res = wg.load(name, buffer);

			postMessage<'processed'>({
				type: 'processed',
				summary: res,
				name
			});
		} catch (error) {
			postMessage<'error'>({
				type: 'error',
				error: error instanceof Error ? error.message : '未知错误'
			});
		}
	},
	'follow-stream': (ev) => {
		const number = ev.data.number;
		const res = wg.frame(number);
		const temp = JSON.parse(JSON.stringify(res, replacer));
		const result = wg.follow(temp.follow[0][0], temp.follow[0][1]);
		// 如果需要转换成数组
		const payloadsArray = [];
		for (let i = 0; i < result.payloads.size(); i++) {
			const payload = result.payloads.get(i);
			const decoded = atob(payload.data).trim();
			payloadsArray.push({
				...payload,
				data: decoded
			});
		}
		ev.ports[0].postMessage({
			type: 'streamed',
			payloads: payloadsArray,
			followResult: result,
			filter: temp.follow[0][1]
		});
	},
	'list-modules': async (_ev) => {
		await packagesPromise;
		const raw = wg.list_modules();
		const modules = vectorToArray(raw).map(serializePrefModule);
		postMessage<'modules'>({
			type: 'modules',
			modules
		});
	},
	'list-prefs': async (ev) => {
		await packagesPromise;
		const raw = wg.list_prefs(ev.data.module);
		const prefs = vectorToArray(raw).map(serializePref);
		postMessage<'prefs'>({
			type: 'prefs',
			prefs
		});
	},
	'set-pref': async (ev) => {
		await packagesPromise;
		try {
			wg.set_pref(ev.data.module, ev.data.key, ev.data.value);
			modifiedPrefs.set(ev.data.module + '|' + ev.data.key, ev.data.value);
			postMessage<'pref-set'>({
				type: 'pref-set',
				code: 0,
				error: ''
			});
		} catch (e: any) {
			postMessage<'pref-set'>({
				type: 'pref-set',
				code: -1,
				error: e.message
			});
		}
	},
	'apply-prefs': async (_ev) => {
		await packagesPromise;
		wg.apply_prefs();
		for (const [key, value] of modifiedPrefs) {
			await idbSavePref(key, value);
		}
		postMessage<'prefs-applied'>({
			type: 'prefs-applied'
		});
	},
	'reset-prefs': async (_ev) => {
		await packagesPromise;
		await idbClearAllPrefs();
		modifiedPrefs.clear();
		wg = new Wiregasm();
		await init(WASM, DATA);
	},
	'upload-file': async (ev) => {
		await packagesPromise;
		const fileName = ev.data.name;
		const targetDir = ev.data.directory || (wg.uploadDir + '/userdata');
		try {
			(wg.lib.FS as any).mkdirTree(targetDir);
		} catch (_e) {
			// may already exist
		}
		const filePath = targetDir + '/' + fileName;
		const data = new Uint8Array(ev.data.data);
		wg.lib.FS.writeFile(filePath, data);
		await idbSaveFile(filePath, fileName, data);
		postMessage<'file-uploaded'>({
			type: 'file-uploaded',
			path: filePath
		});
	},
	'list-files': async (ev) => {
		await packagesPromise;
		const fs = wg.lib.FS as any;
		const dirPath = ev.data.path || '/';
		const names: string[] = fs.readdir(dirPath);
		const entries: { name: string; path: string; isDirectory: boolean }[] = [];
		for (const name of names) {
			if (name === '.' || name === '..') continue;
			const fullPath = dirPath === '/' ? '/' + name : dirPath + '/' + name;
			try {
				const stat = fs.stat(fullPath);
				entries.push({
					name,
					path: fullPath,
					isDirectory: fs.isDir(stat.mode)
				});
			} catch {
				entries.push({ name, path: fullPath, isDirectory: false });
			}
		}
		entries.sort((a, b) => {
			if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
			return a.name.localeCompare(b.name);
		});
		postMessage<'files-listed'>({
			type: 'files-listed',
			path: dirPath,
			entries
		});
	},
	'delete-file': async (ev) => {
		await packagesPromise;
		const fs = wg.lib.FS as any;
		try {
			fs.unlink(ev.data.path);
		} catch (_e) {
			// file may not exist
		}
		await idbDeleteFile(ev.data.path);
		postMessage<'file-deleted'>({
			type: 'file-deleted',
			path: ev.data.path
		});
	}
};

// 类型安全的 postMessage
function postMessage<K extends keyof WorkerResponseMap>(
	message: { type: K } & WorkerResponseMap[K]
): void {
	self.postMessage(message);
}

// 类型安全的消息处理
self.onmessage = (
	event: MessageEvent<{ type: keyof WorkerMessageMap } & WorkerMessageMap[keyof WorkerMessageMap]>
) => {
	const type = event.data.type as keyof WorkerMessageMap;
	MESSAGE_STRATEGIES[type](event as any);
};
