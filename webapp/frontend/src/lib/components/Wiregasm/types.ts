import type { LoadResponse } from '@goodtools/wiregasm';

// Worker 接收的消息类型
export interface WorkerMessageMap {
	columns: object;
	select: {
		number: number;
	};
	'select-frames': {
		skip: number;
		limit: number;
		filter: string;
	};
	'check-filter': {
		filter: string;
	};
	'follow-stream': {
		number: number;
	};
	process: {
		name: string;
		arrayBuffer: ArrayBuffer;
	};
	'list-modules': object;
	'list-prefs': {
		module: string;
	};
	'set-pref': {
		module: string;
		key: string;
		value: string;
	};
	'apply-prefs': object;
	'upload-file': {
		name: string;
		data: ArrayBuffer;
		directory?: string;
	};
	'list-files': {
		path: string;
	};
	'delete-file': {
		path: string;
	};
	'reset-prefs': object;
}

export interface FsEntry {
	name: string;
	path: string;
	isDirectory: boolean;
}

export interface SerializedPrefModule {
	name: string;
	title: string;
	description: string;
	use_gui: boolean;
	submodules: SerializedPrefModule[];
}

export interface SerializedPref {
	name: string;
	title: string;
	description: string;
	type: number;
	uint_value: number;
	uint_base_value: number;
	bool_value: boolean;
	string_value: string;
	range_value: string;
	// runtime fields from C++ that may not be in types
	enumvals?: { name: string; value: number; description: string }[];
}

// Worker 发送的消息类型
export interface WorkerResponseMap {
	init: object;
	error: {
		error: any;
	};
	status: {
		status: string;
		code?: number;
	};
	columned: {
		columns: string[];
	};
	selected: {
		tree: any[];
		data_sources: Array<{
			idx: number;
			data: string;
		}>;
	};
	processed: {
		summary: LoadResponse;
		name: string;
	};
	modules: {
		modules: SerializedPrefModule[];
	};
	prefs: {
		prefs: SerializedPref[];
	};
	'pref-set': {
		code: number;
		error: string;
	};
	'prefs-applied': object;
	'file-uploaded': {
		path: string;
	};
	'files-listed': {
		path: string;
		entries: FsEntry[];
	};
	'file-deleted': {
		path: string;
	};
}

// Worker 类型定义
export interface TypedWorker extends Omit<Worker, 'postMessage'> {
	postMessage<K extends keyof WorkerMessageMap>(
		message: { type: K } & (WorkerMessageMap[K] extends never
			? Record<string, never>
			: WorkerMessageMap[K]),
		transfer?: Transferable[]
	): void;
}

// 主线程接收消息的类型
export type WorkerResponse<K extends keyof WorkerResponseMap> = {
	type: K;
	data: WorkerResponseMap[K];
};
