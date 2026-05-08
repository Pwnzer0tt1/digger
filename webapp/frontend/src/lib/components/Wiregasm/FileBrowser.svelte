<script lang="ts">
	import { wiregasmState } from '$lib/state.svelte';
	import type { WorkerResponse, WorkerResponseMap, FsEntry } from './types';
	import { toast } from 'svelte-sonner';

	let {
		show = $bindable(false),
		selectMode = 'file',
		onselect = (path: string) => {}
	}: {
		show: boolean;
		selectMode: 'file' | 'dir';
		onselect: (path: string) => void;
	} = $props();

	let currentPath = $state('/');
	let entries: FsEntry[] = $state([]);
	let loading = $state(false);
	let selectedPath: string | null = $state(null);
	let history: string[] = $state([]);

	function goToDir(path: string) {
		history = [...history, currentPath];
		currentPath = path;
		selectedPath = path;
		loadDir(path);
	}

	function goBack() {
		const prev = history.pop();
		if (prev !== undefined) {
			currentPath = prev;
			selectedPath = prev;
			loadDir(prev);
		}
	}

	function goUp() {
		if (currentPath === '/') return;
		const parent = currentPath.lastIndexOf('/');
		if (parent <= 0) goToDir('/');
		else goToDir(currentPath.substring(0, parent));
	}

	function loadDir(path: string) {
		loading = true;
		wiregasmState.worker?.postMessage({ type: 'list-files', path });
	}

	function handleMessage(ev: MessageEvent<WorkerResponse<keyof WorkerResponseMap>>) {
		if (ev.data.type === 'files-listed') {
			const data = ev.data as WorkerResponse<'files-listed'>['data'];
			if (data.path === currentPath) {
				entries = data.entries;
				loading = false;
			}
		} else if (ev.data.type === 'file-uploaded') {
			const data = ev.data as WorkerResponse<'file-uploaded'>['data'];
			toast.success(`Uploaded ${data.path.split('/').pop()}`);
			loadDir(currentPath);
		} else if (ev.data.type === 'file-deleted') {
			loadDir(currentPath);
		}
	}

	$effect(() => {
		if (show && wiregasmState.worker) {
			wiregasmState.worker.addEventListener('message', handleMessage);
			currentPath = '/';
			history = [];
			selectedPath = null;
			loadDir('/');
			return () => {
				wiregasmState.worker?.removeEventListener('message', handleMessage);
			};
		}
	});

	function handleRowClick(entry: FsEntry) {
		if (entry.isDirectory) {
			goToDir(entry.path);
		} else if (selectMode === 'file') {
			selectedPath = entry.path;
		}
	}

	function handleRowDblClick(entry: FsEntry) {
		if (!entry.isDirectory && selectMode === 'file') {
			selectedPath = entry.path;
			confirmSelect();
		}
	}

	function confirmSelect() {
		const path = selectMode === 'dir' ? currentPath : selectedPath;
		if (path) {
			onselect(path);
			show = false;
		}
	}

	function pathParts() {
		const parts = currentPath.split('/').filter(Boolean);
		const crumbs: { label: string; path: string }[] = [];
		let acc = '';
		for (const p of parts) {
			acc += '/' + p;
			crumbs.push({ label: p, path: acc });
		}
		return crumbs;
	}

	async function uploadFile() {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = false;
		input.onchange = async (e: Event) => {
			const file = ((e.target as HTMLInputElement).files)?.[0];
			if (!file) return;
			const buf = await file.arrayBuffer();
			const targetDir = currentPath;
			const copy = buf.slice(0);
			wiregasmState.worker?.postMessage({ type: 'upload-file', name: file.name, data: copy, directory: targetDir }, [copy]);
		};
		input.click();
	}

	function deleteFile(path: string, name: string) {
		wiregasmState.worker?.postMessage({ type: 'delete-file', path });
		toast.success(`Deleted ${name}`);
	}
</script>

{#if show}
	<div
		class="modal fade show d-block"
		tabindex="-1"
		style="background: rgba(0,0,0,0.5); z-index: 2060;"
		onclick={() => show = false}
		onkeydown={(e) => e.key === 'Escape' && (show = false)}
	>
		<div
			class="modal-dialog modal-lg modal-dialog-scrollable"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">
						{selectMode === 'dir' ? 'Select Directory' : 'File Manager'}
					</h5>
					<button type="button" class="btn-close" onclick={() => show = false}></button>
				</div>
				<div class="modal-body p-0">
					<div class="d-flex align-items-center gap-2 p-2 border-bottom bg-light">
						<button class="btn btn-sm btn-outline-secondary" onclick={goBack} disabled={history.length === 0}>
							<i class="bi bi-arrow-left"></i>
						</button>
						<button class="btn btn-sm btn-outline-secondary" onclick={goUp}>
							<i class="bi bi-arrow-up"></i>
						</button>
						<nav aria-label="breadcrumb" class="flex-grow-1">
							<ol class="breadcrumb mb-0 small">
								<li class="breadcrumb-item">
									<button class="btn btn-link btn-sm p-0 text-decoration-none" onclick={() => goToDir('/')}>/</button>
								</li>
								{#each pathParts() as crumb}
									<li class="breadcrumb-item">
										<button class="btn btn-link btn-sm p-0 text-decoration-none" onclick={() => goToDir(crumb.path)}>
											{crumb.label}
										</button>
									</li>
								{/each}
							</ol>
						</nav>
						<button class="btn btn-sm btn-outline-primary" onclick={uploadFile} title="Upload file to this directory">
							<i class="bi bi-cloud-upload"></i> Upload
						</button>
					</div>

					<div style="max-height: 50vh; overflow-y: auto;">
						{#if loading}
							<div class="d-flex justify-content-center p-4">
								<div class="spinner-border spinner-border-sm" role="status">
									<span class="visually-hidden">Loading...</span>
								</div>
							</div>
						{:else}
							<table class="table table-sm table-hover mb-0">
								<thead class="sticky-top bg-white">
									<tr>
										<th style="width: 32px;"></th>
										<th>Name</th>
										<th>Type</th>
										<th class="text-end" style="width: 140px;">Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each entries as entry}
										<tr
											role="button"
											class:table-active={selectedPath === entry.path}
											style="cursor: pointer;"
											onclick={() => handleRowClick(entry)}
											ondblclick={() => handleRowDblClick(entry)}
										>
											<td class="text-center">
												<i class="bi {entry.isDirectory ? 'bi-folder-fill text-warning' : 'bi-file-earmark-fill text-primary'}"></i>
											</td>
											<td>{entry.name}</td>
											<td class="text-muted small">{entry.isDirectory ? 'Directory' : 'File'}</td>
											<td class="text-end">
												{#if entry.isDirectory}
													<button class="btn btn-sm btn-outline-secondary me-1" onclick={() => goToDir(entry.path)} title="Open">
														<i class="bi bi-folder2-open"></i>
													</button>
												{:else}
													<button class="btn btn-sm btn-outline-danger me-1" onclick={() => deleteFile(entry.path, entry.name)} title="Delete">
														<i class="bi bi-trash"></i>
													</button>
													{#if selectMode === 'file'}
														<button class="btn btn-sm btn-outline-primary" onclick={() => { selectedPath = entry.path; confirmSelect(); }} title="Select">
															<i class="bi bi-check-lg"></i>
														</button>
													{/if}
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
							{#if entries.length === 0}
								<div class="text-center text-muted p-4">Empty directory</div>
							{/if}
						{/if}
					</div>
				</div>
				<div class="modal-footer">
					<code class="text-muted small flex-grow-1">{selectedPath || currentPath}</code>
					<button class="btn btn-secondary" onclick={() => show = false}>Cancel</button>
					{#if selectMode === 'dir'}
						<button class="btn btn-primary" onclick={confirmSelect}>Select This Directory</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
