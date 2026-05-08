<script lang="ts">
	let { text, start, size, onoffsetClicked } = $props<{
		text: string;
		start: number;
		size: number;
		onoffsetClicked?: (offset: number) => void;
	}>();

	let before = $derived(text.substring(0, start));
	let hl = $derived(text.substring(start, start + size));
	let end = $derived(text.substring(start + size));

	function handleClickWithOffset(e: MouseEvent, offset: number) {
		const selection = window.getSelection();
		if (selection && onoffsetClicked) {
			onoffsetClicked(selection.anchorOffset + offset);
		}
	}
</script>

<span>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<span onclick={(e) => handleClickWithOffset(e, 0)}>{before}</span>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<span class="bg-secondary text-white" onclick={(e) => handleClickWithOffset(e, before.length)}>
		<span>{hl}</span>
	</span>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<span onclick={(e) => handleClickWithOffset(e, before.length + hl.length)}>{end}</span>
</span>
