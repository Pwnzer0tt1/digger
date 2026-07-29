<script module lang="ts">
	export interface TreeNode {
		label: string;
		tree: TreeNode[];
		length: number;
		data_source_idx?: number;
		start?: number;
		filter?: string;
	}
</script>

<script lang="ts">
	import DissectionTree from './DissectionTree.svelte';

	let {
		id,
		tree,
		onselect = () => {},
		root = false,
		selected = '',
		setFilter
	} = $props<{
		id: string;
		tree: TreeNode[];
		onselect?: (selection: any) => void;
		root?: boolean;
		selected?: string;
		setFilter?: (filter: string) => void;
	}>();

	let openStates = $state(new Map<string, boolean>());

	function isOpen(nodeId: string) {
		return openStates.get(nodeId) || false;
	}

	$effect(() => {
		// When selected changes, make sure parents are open
		tree.forEach((_, i) => {
			const nodeId = `${id}-${i}`;
			if (!isOpen(nodeId) && selected.startsWith(nodeId + '-')) {
				let newStates = new Map(openStates);
				newStates.set(nodeId, true);
				openStates = newStates;
			}
		});
	});

	const NO_SELECTION = { id: '', idx: 0, start: 0, length: 0 };

	function toggle(nodeId: string) {
		const currentState = isOpen(nodeId);
		let newStates = new Map(openStates);
		newStates.set(nodeId, !currentState);
		openStates = newStates;

		if (currentState && selected.startsWith(nodeId + '-')) {
			onselect(NO_SELECTION);
		}
	}

	function handleClick(e: MouseEvent, node: TreeNode, nodeId: string) {
		if (e.detail === 2 && setFilter && node.filter) {
			setFilter(node.filter);
		}

		if (node.length > 0) {
			onselect({
				id: nodeId,
				idx: node.data_source_idx,
				start: node.start,
				length: node.length
			});
		}
	}
</script>

<div class={root ? 'overflow-auto w-auto' : 'ps-2 border-start'}>
	{#each tree as node, i}
		{@const nodeId = `${id}-${i}`}
		<div class="lh-base">
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
			<div
				class="d-flex align-items-center min-w-fit w-100 {node.length > 0
					? 'cursor-pointer'
					: ''} {nodeId === selected ? 'bg-secondary text-white' : 'text-secondary'}"
			>
				{#if node.tree && node.tree.length > 0}
					<!-- svelte-ignore a11y_missing_attribute a11y_invalid_attribute -->
					<a
						class="cursor-pointer d-flex flex-grow-0"
						onclick={(e) => {
							e.stopPropagation();
							toggle(nodeId);
						}}
					>
						<i
							class="bi bi-caret-right-fill flex-shrink-0 transition-transform {isOpen(nodeId)
								? 'rotate-90'
								: ''} {nodeId === selected ? 'text-white' : ''}"
							style="font-size: 0.75rem; transition: transform 0.2s;"
						></i>
					</a>
				{:else}
					<i class="bi bi-dash flex-shrink-0 text-secondary" style="font-size: 0.75rem;"></i>
				{/if}

				<div
					class="ms-1 flex-grow-1 text-nowrap font-monospace text-xs user-select-none"
					onclick={(e) => handleClick(e, node, nodeId)}
					ondblclick={() => toggle(nodeId)}
				>
					{node.label}
				</div>
			</div>

			{#if node.tree && node.tree.length > 0 && isOpen(nodeId)}
				<DissectionTree id={nodeId} tree={node.tree || []} {onselect} {selected} {setFilter} />
			{/if}
		</div>
	{/each}
</div>

<style>
	.rotate-90 {
		transform: rotate(90deg);
	}
	.cursor-pointer {
		cursor: pointer;
	}
	.text-xs {
		font-size: 0.75rem;
	}
	.transition-transform {
		transition: transform 0.2s;
	}
</style>
