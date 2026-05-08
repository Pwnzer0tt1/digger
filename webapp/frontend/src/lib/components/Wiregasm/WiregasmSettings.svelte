<script lang="ts">
	import { wiregasmState, selectedPanel } from '$lib/state.svelte';
	import { toast } from 'svelte-sonner';
	import type { WorkerResponse, WorkerResponseMap, SerializedPrefModule, SerializedPref } from './types';
	import FileBrowser from './FileBrowser.svelte';

	const PrefType = {
		PREF_UINT: 1,
		PREF_BOOL: 2,
		PREF_ENUM: 4,
		PREF_STRING: 8,
		PREF_RANGE: 16,
		PREF_STATIC_TEXT: 32,
		PREF_UAT: 64,
		PREF_OPEN_FILENAME: 16384,
		PREF_DIRNAME: 2048,
		PREF_OBSOLETE: 1024
	} as const;

	let modules: SerializedPrefModule[] = $state([]);
	let selectedModule: string | null = $state(null);
	let prefs: SerializedPref[] = $state([]);
	let loading = $state(false);
	let dirty = $state(false);
	let search = $state('');
	let browserShow = $state(false);
	let browserMode: 'file' | 'dir' = $state('file');
	let browserPrefName = $state('');

	function onBrowserSelect(path: string) {
		if (browserPrefName) {
			setPref(browserPrefName, path);
		}
	}

	function flattenModules(list: SerializedPrefModule[], depth = 0): { mod: SerializedPrefModule; depth: number }[] {
		const result: { mod: SerializedPrefModule; depth: number }[] = [];
		for (const m of list) {
			result.push({ mod: m, depth });
			if (m.submodules && m.submodules.length > 0) {
				result.push(...flattenModules(m.submodules, depth + 1));
			}
		}
		return result;
	}

	let flatModules = $derived(flattenModules(modules));
	let filteredModules = $derived(
		search
			? flatModules.filter(
					({ mod }) =>
						mod.name.toLowerCase().includes(search.toLowerCase()) ||
						(mod.title && mod.title.toLowerCase().includes(search.toLowerCase()))
				)
			: flatModules
	);

	function isFilePref(type: number): boolean {
		return !!(type & (PrefType.PREF_STRING | PrefType.PREF_OPEN_FILENAME | PrefType.PREF_DIRNAME | PrefType.PREF_UAT));
	}

	function resetPrefs() {
		if (confirm('Reset all Wiregasm preferences to defaults?')) {
			wiregasmState.worker?.postMessage({ type: 'reset-prefs' });
		}
	}

	function handleMessage(ev: MessageEvent<WorkerResponse<keyof WorkerResponseMap>>) {
		const type = ev.data.type;

		if (type === 'init') {
			loadModules();
			return;
		}

		if (type === 'modules') {
			const data = ev.data as WorkerResponse<'modules'>['data'];
			modules = data.modules;
			loading = false;
		} else if (type === 'prefs') {
			const data = ev.data as WorkerResponse<'prefs'>['data'];
			prefs = data.prefs;
			loading = false;
		} else if (type === 'pref-set') {
			const data = ev.data as WorkerResponse<'pref-set'>['data'];
			if (data.code !== 0) {
				toast.error('Failed to set preference', { description: data.error });
			}
		} else if (type === 'prefs-applied') {
			toast.success('Wiregasm preferences applied');
			dirty = false;
		} else if (type === 'file-uploaded') {
			// handled by FileBrowser
		}
	}

	$effect(() => {
		if (wiregasmState.worker) {
			wiregasmState.worker.addEventListener('message', handleMessage);
			loadModules();
			return () => {
				wiregasmState.worker?.removeEventListener('message', handleMessage);
			};
		}
	});

	function loadModules() {
		loading = true;
		prefs = [];
		selectedModule = null;
		wiregasmState.worker?.postMessage({ type: 'list-modules' });
	}

	function selectModule(name: string) {
		selectedModule = name;
		loading = true;
		wiregasmState.worker?.postMessage({ type: 'list-prefs', module: name });
	}

	function setPref(name: string, value: string) {
		if (!selectedModule) return;
		wiregasmState.worker?.postMessage({ type: 'set-pref', module: selectedModule, key: name, value });
		dirty = true;
		const pref = prefs.find(p => p.name === name);
		if (pref) {
			if (pref.type & PrefType.PREF_BOOL) {
				pref.bool_value = value === 'true';
			} else if (pref.type & PrefType.PREF_UINT) {
				pref.uint_value = parseInt(value, 10);
			} else if (pref.type & (PrefType.PREF_STRING | PrefType.PREF_OPEN_FILENAME | PrefType.PREF_DIRNAME | PrefType.PREF_UAT)) {
				pref.string_value = value;
			} else if (pref.type & PrefType.PREF_RANGE) {
				pref.range_value = value;
			}
		}
	}

	function applyAll() {
		wiregasmState.worker?.postMessage({ type: 'apply-prefs' });
	}

	function prefTypeName(type: number): string {
		if (type & PrefType.PREF_BOOL) return 'bool';
		if (type & PrefType.PREF_UINT) return 'uint';
		if (type & PrefType.PREF_ENUM) return 'enum';
		if (type & PrefType.PREF_STRING) return 'string';
		if (type & PrefType.PREF_DIRNAME) return 'dir';
		if (type & PrefType.PREF_OPEN_FILENAME) return 'file';
		if (type & PrefType.PREF_UAT) return 'uat';
		if (type & PrefType.PREF_RANGE) return 'range';
		if (type & PrefType.PREF_STATIC_TEXT) return 'static';
		if (type & PrefType.PREF_OBSOLETE) return 'obsolete';
		return `type_${type}`;
	}

	function triggerUpload(prefName?: string) {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = false;
		input.onchange = async (e: Event) => {
			const files = (e.target as HTMLInputElement).files;
			if (!files || files.length === 0) return;
			const file = files[0];
			const buf = await file.arrayBuffer();
			wiregasmState.worker?.postMessage({ type: 'upload-file', name: file.name, data: buf }, [buf]);
			if (prefName) {
				setPref(prefName, `/uploads/userdata/${file.name}`);
			}
		};
		input.click();
	}
</script>

<div class="card shadow-lg h-100">
	<div class="card-header hstack gap-2">
		<h5 class="modal-title flex-grow-1">Wiregasm Protocol Dissector Settings</h5>
		<button onclick={() => selectedPanel.view = undefined} type="button" class="btn-close" aria-label="Close"></button>
	</div>
	<div class="card-body p-0 d-flex flex-column" style="height: calc(100% - 52px);">
		<div class="d-flex flex-grow-1 overflow-hidden">
			<div class="d-flex flex-column border-end" style="width: 280px; min-width: 200px;">
				<div class="p-2 border-bottom">
					<div class="input-group input-group-sm">
						<span class="input-group-text"><i class="bi bi-search"></i></span>
						<input
							bind:value={search}
							type="text"
							class="form-control"
							placeholder="Search modules..."
						>
					</div>
					<small class="text-muted mt-1 d-block">
						{modules.length} top-level modules
					</small>
				</div>
				<div class="list-group list-group-flush overflow-auto flex-grow-1">
					{#each filteredModules as { mod, depth }, i (i)}
						<button
							type="button"
							class="list-group-item list-group-item-action text-start border-0 d-flex align-items-center gap-2"
							class:active={selectedModule === mod.name}
							class:bg-light={depth > 0 && selectedModule !== mod.name}
							style="padding-left: {12 + depth * 16}px;"
							onclick={() => selectModule(mod.name)}
						>
							{#if depth > 0}
								<small class="text-muted" style="font-size: 0.7rem;">&#8627;</small>
							{/if}
							<div class="text-truncate">
								<div class="fw-semibold text-truncate">{mod.title || mod.name}</div>
								<small class="text-muted">
									{mod.name}
									{#if mod.submodules?.length}
										<span class="badge bg-info ms-1">{mod.submodules.length}</span>
									{/if}
								</small>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<div class="flex-grow-1 overflow-auto p-3 d-flex flex-column">
				{#if loading}
					<div class="d-flex justify-content-center align-items-center flex-grow-1">
						<div class="spinner-border" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
				{:else if selectedModule && prefs.length > 0}
					<div class="mb-3">
						<h6>Module: <code>{selectedModule}</code></h6>
						<p class="text-muted small">{prefs.length} preference(s)</p>
					</div>
					<div class="vstack gap-3">
						{#each prefs as pref}
							<div class="card">
								<div class="card-body py-2 px-3">
									<div class="d-flex justify-content-between align-items-start">
										<div class="flex-grow-1 me-2">
											<label class="form-label fw-semibold mb-0" for="pref-{selectedModule}-{pref.name}">
												{pref.title || pref.name}
											</label>
											<span class="badge bg-secondary ms-1">{prefTypeName(pref.type)}</span>
											{#if pref.description}
												<br><small class="text-muted">{pref.description}</small>
											{/if}
										</div>
										<div class="d-flex align-items-center gap-1" style="min-width: 200px;">
											{#if pref.type & PrefType.PREF_BOOL}
												<div class="form-check form-switch mt-1">
													<input
														id="pref-{selectedModule}-{pref.name}"
														class="form-check-input"
														type="checkbox"
														checked={pref.bool_value}
														onchange={(e) => setPref(pref.name, String((e.target as HTMLInputElement).checked))}
													>
												</div>
											{:else if pref.type & PrefType.PREF_ENUM && pref.enumvals && pref.enumvals.length > 0}
												<select
													id="pref-{selectedModule}-{pref.name}"
													class="form-select form-select-sm"
													value={pref.uint_value}
													onchange={(e) => setPref(pref.name, (e.target as HTMLSelectElement).value)}
												>
													{#each pref.enumvals as ev}
														<option value={ev.value} selected={ev.value === pref.uint_value}>
															{ev.name}{ev.description ? ` (${ev.description})` : ''}
														</option>
													{/each}
												</select>
											{:else if pref.type & PrefType.PREF_UINT}
												<input
													id="pref-{selectedModule}-{pref.name}"
													class="form-control form-control-sm"
													type="number"
													value={pref.uint_value}
													onchange={(e) => setPref(pref.name, (e.target as HTMLInputElement).value)}
												>
											{:else if isFilePref(pref.type)}
												<div class="input-group input-group-sm flex-nowrap">
													<input
														id="pref-{selectedModule}-{pref.name}"
														class="form-control form-control-sm"
														type="text"
														value={pref.string_value}
														placeholder={pref.type & PrefType.PREF_DIRNAME ? '/path/to/dir' : '/path/to/file'}
														onchange={(e) => setPref(pref.name, (e.target as HTMLInputElement).value)}
													>
													<button
														class="btn btn-outline-secondary btn-sm"
														title="Browse virtual filesystem"
														onclick={() => { browserMode = (pref.type & PrefType.PREF_DIRNAME) || (pref.type & PrefType.PREF_UAT) ? 'dir' : 'file'; browserPrefName = pref.name; browserShow = true; }}
													>
														<i class="bi bi-folder-open"></i>
													</button>
													<button
														class="btn btn-outline-secondary btn-sm"
														title="Upload file to Wiregasm virtual filesystem"
														onclick={() => triggerUpload(pref.name)}
													>
														<i class="bi bi-upload"></i>
													</button>
												</div>
											{:else if pref.type & PrefType.PREF_RANGE}
												<input
													id="pref-{selectedModule}-{pref.name}"
													class="form-control form-control-sm"
													type="text"
													value={pref.range_value}
													onchange={(e) => setPref(pref.name, (e.target as HTMLInputElement).value)}
												>
											{:else if pref.type & PrefType.PREF_STATIC_TEXT}
												<span class="text-muted small">{pref.string_value}</span>
											{:else}
												<span class="text-muted small">Unsupported type</span>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
					<div class="mt-3 d-flex align-items-center gap-2">
						<button onclick={applyAll} class="btn btn-primary" disabled={!dirty}>
							Apply Preferences
						</button>
						{#if dirty}
							<small class="text-warning">Unsaved changes</small>
						{/if}
						<button onclick={() => { browserMode = 'file'; browserPrefName = ''; browserShow = true; }} class="btn btn-outline-secondary" title="Manage files in the Wiregasm virtual filesystem">
							<i class="bi bi-folder"></i> File Manager
						</button>
						<div class="flex-grow-1"></div>
						<button onclick={resetPrefs} class="btn btn-outline-danger btn-sm">
							<i class="bi bi-arrow-counterclockwise"></i> Reset to Defaults
						</button>
					</div>
				{:else if selectedModule && prefs.length === 0}
					<div class="d-flex justify-content-center align-items-center flex-grow-1">
						<p class="text-muted">No preferences for this module.</p>
					</div>
				{:else}
					<div class="d-flex justify-content-center align-items-center flex-grow-1">
						<p class="text-muted">Select a module to view its preferences.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<FileBrowser bind:show={browserShow} selectMode={browserMode} onselect={onBrowserSelect} />
