<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DissectionTree from './DissectionTree.svelte';
	import DissectionDump from './DissectionDump.svelte';
	import type { TypedWorker, WorkerResponse, WorkerResponseMap } from './types';
	import { wiregasmState } from '$lib/state.svelte';
	import { generatePcap } from './make_pcap';
	import { Buffer } from 'buffer';

	let {
		show = $bindable(false),
		rawFlowData = null,
		flow = null,
		filename = 'capture.pcap'
	} = $props<{
		show: boolean;
		rawFlowData: Promise<any> | null;
		flow: any | null;
		filename?: string;
	}>();

	let pcapBuffer: Uint8Array | null = $state(null);

	let loading = $state(false);
	let status = $state('Loading...');
	let processed = $state(false);

	let columns: { title: string; key: string }[] = $state([]);
	let tableData: any[] = $state([]);
	let selected_row_idx = $state(0);

	let selectedPacket: any = $state(null);

	let selectedTreeEntry = $state({ id: '', idx: 0, start: 0, length: 0 });
	let preparedPositions = $state(new Map());

	function close() {
		show = false;
	}

	function handleMessage(ev: MessageEvent<WorkerResponse<keyof WorkerResponseMap>>) {
		const type = ev.data.type;

		if (type === 'init') {
			loading = false;
			wiregasmState.worker?.postMessage({ type: 'columns' });
		} else if (type === 'columned') {
			const data = ev.data as WorkerResponse<'columned'>['data'];
			columns = data.columns.map((c) => ({ title: c, key: c }));
		} else if (type === 'status') {
			const data = ev.data as WorkerResponse<'status'>['data'];
			status = data.status;
		} else if (type === 'processed') {
			processed = true;
			fetchTableData();
		} else if (type === 'selected') {
			const data = ev.data as WorkerResponse<'selected'>['data'];
			preparedPositions = new Map(preparePositions('root', data));
			selectedPacket = data;
		} else if (type === 'error') {
			const data = ev.data as WorkerResponse<'error'>['data'];
			status = `Error: ${data.error}`;
			loading = false;
		}
	}

	function fetchTableData() {
		loading = true;
		const { port1, port2 } = new MessageChannel();
		port1.onmessage = (ev) => {
			try {
				const data = ev.data.data;
				if (data?.frames) {
					tableData = data.frames.map((f: any) => {
						let row: any = { raw: f };
						columns.forEach((col, idx) => {
							row[col.key] = f.columns?.[idx];
						});
						return row;
					});
					if (tableData.length > 0 && selected_row_idx === 0) {
						selectRow(tableData[0]);
					}
				}
			} catch (e) {
				status = 'Error processing table data';
			} finally {
				port1.close();
				port2.close();
				loading = false;
			}
		};
		wiregasmState.worker?.postMessage({ type: 'select-frames', skip: 0, limit: 0, filter: '' }, [
			port2
		]);
	}

	function preparePositions(id: string, node: any): Map<any, any> {
		let map = new Map();
		if (node.tree?.length > 0) {
			for (let i = 0; i < node.tree.length; i++) {
				map = new Map([...map, ...preparePositions(`${id}-${i}`, node.tree[i])]);
			}
		} else if (node.length > 0) {
			map.set(id, {
				id,
				idx: node.data_source_idx,
				start: node.start,
				length: node.length
			});
		}
		return map;
	}

	function selectRow(row: any) {
		selected_row_idx = row.raw.number;
		wiregasmState.worker?.postMessage({ type: 'select', number: selected_row_idx });
	}

	function setSelectedTreeEntry(entry: any) {
		selectedTreeEntry = entry || { id: '', idx: 0, start: 0, length: 0 };
	}

	function onDataSourceSelect(src_idx: number, pos: number) {
		let current: number | null = null;
		for (const [k, pp] of preparedPositions) {
			if (pp.idx !== src_idx) continue;
			if (pos >= pp.start && pos <= pp.start + pp.length) {
				if (current !== null && preparedPositions.get(current)!.length > pp.length) {
					current = k;
				} else if (current === null) {
					current = k;
				}
			}
		}
		if (current !== null) {
			setSelectedTreeEntry(preparedPositions.get(current));
		}
	}

	$effect(() => {
		if (show && rawFlowData && flow) {
			rawFlowData.then((res) => {
				pcapBuffer = generatePcap(res.raw, flow);
			});
		}
	});

	$effect(() => {
		if (wiregasmState.worker) {
			wiregasmState.worker.addEventListener('message', handleMessage);
			return () => {
				wiregasmState.worker?.removeEventListener('message', handleMessage);
			};
		}
	});

	$effect(() => {
		if (!show) {
			processed = false;
			tableData = [];
			selectedPacket = null;
			selectedTreeEntry = { id: '', idx: 0, start: 0, length: 0 };
			preparedPositions = new Map();
			return;
		}

		if (pcapBuffer && wiregasmState.worker) {
			processed = false;
			tableData = [];
			selectedPacket = null;
			selectedTreeEntry = { id: '', idx: 0, start: 0, length: 0 };
			preparedPositions = new Map();
			status = 'Loading...';

			// Create a copy of the buffer to transfer
			const bufferCopy = pcapBuffer.buffer.slice(0);
			wiregasmState.worker.postMessage(
				{
					type: 'process',
					name: filename,
					arrayBuffer: bufferCopy
				},
				[bufferCopy]
			);
		}
	});

	function getRowBg(row: any) {
		if (row.raw && row.raw.bg !== undefined && !Number.isNaN(Number(row.raw.bg))) {
			return '#' + Number(row.raw.bg).toString(16).padStart(6, '0');
		}
		return 'inherit';
	}

	function getRowFg(row: any) {
		if (row.raw && row.raw.fg !== undefined && !Number.isNaN(Number(row.raw.fg))) {
			return '#' + Number(row.raw.fg).toString(16).padStart(6, '0');
		}
		return 'inherit';
	}
</script>

{#if show}
	<div
		class="modal fade show d-block"
		tabindex="-1"
		style="background: rgba(0,0,0,0.5); z-index: 1055;"
	>
		<div class="modal-dialog modal-fullscreen">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Wiregasm PCAP View ({filename})</h5>
					<button type="button" class="btn-close" onclick={close} aria-label="Close"></button>
				</div>
				<div class="modal-body d-flex flex-column h-100 overflow-hidden p-0">
					{#if !processed}
						<div class="p-3">Loading wiregasm... {status}</div>
					{:else}
						<div class="flex-grow-1 overflow-auto border-bottom" style="max-height: 40%;">
							<table class="table table-sm table-hover mb-0" style="font-size: 0.85rem;">
								<thead class="sticky-top bg-white">
									<tr>
										{#each columns as col}
											<th>{col.title}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each tableData as row}
										<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
										<tr
											style="cursor: pointer; background-color: {getRowBg(row)}; color: {getRowFg(
												row
											)};"
											class:table-active={selected_row_idx === row.raw.number}
											onclick={() => selectRow(row)}
										>
											{#each columns as col}
												<td>{row[col.key]}</td>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						{#if selectedPacket && selectedPacket.tree}
							<div class="d-flex flex-row flex-grow-1 overflow-hidden" style="height: 60%;">
								<div class="w-50 overflow-auto p-2 border-end border-secondary">
									<DissectionTree
										id="root"
										root={true}
										tree={selectedPacket.tree}
										selected={selectedTreeEntry.id}
										onselect={setSelectedTreeEntry}
									/>
								</div>
								<div class="w-50 overflow-auto p-2">
									{#each selectedPacket.data_sources as data_source, idx}
										<div class="mb-3">
											<h6 class="text-muted border-bottom mb-2">
												{data_source.name || 'Data Source'}
											</h6>
											<DissectionDump
												buffer={Buffer.from(data_source.data, 'base64')}
												selected={idx === selectedTreeEntry.idx
													? [selectedTreeEntry.start, selectedTreeEntry.length]
													: [0, 0]}
												onselect={(e) => onDataSourceSelect(idx, e)}
											/>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
