<script lang="ts">
	import HighlightedText from './HighlightedText.svelte';

	let { buffer, selected, onselect } = $props<{
		buffer: Uint8Array;
		selected: [number, number];
		onselect?: (offset: number) => void;
	}>();

	let addrLines: string[] = $state([]);
	let hexLines: string[] = $state([]);
	let asciiLines: string[] = $state([]);

	let asciiHighlight = $derived.by(() => {
		let [start, size] = selected;
		const asciiPos = start + Math.floor(start / 16);
		const asciiSize = start + size + Math.floor((start + size) / 16) - asciiPos;
		return [asciiPos, size > 0 ? asciiSize : 0];
	});

	let hexHighlight = $derived.by(() => {
		let [start, size] = selected;
		const hexSize = size * 2 + size - 1;
		const hexPos = start * 2 + start;
		return [hexPos, size > 0 ? hexSize : 0];
	});

	$effect(() => {
		if (buffer) {
			const addr_lines: string[] = [];
			const hex_lines: string[] = [];
			const ascii_lines: string[] = [];

			for (let i = 0; i < buffer.length; i += 16) {
				const address = i.toString(16).padStart(8, '0');
				const block = buffer.slice(i, i + 16);
				const hexArray: string[] = [];
				const asciiArray: string[] = [];

				for (const value of block) {
					hexArray.push(value.toString(16).padStart(2, '0'));
					asciiArray.push(value >= 0x20 && value < 0x7f ? String.fromCharCode(value) : '.');
				}

				const hexString =
					hexArray.length > 8
						? hexArray.slice(0, 8).join(' ') + '  ' + hexArray.slice(8).join(' ')
						: hexArray.join(' ');

				addr_lines.push(address);
				hex_lines.push(hexString);
				ascii_lines.push(asciiArray.join(''));
			}

			addrLines = addr_lines;
			hexLines = hex_lines;
			asciiLines = ascii_lines;
		}
	});

	function onHexClick(offset: number) {
		if (onselect) onselect(Math.floor(offset / 3));
	}

	function onAsciiClick(offset: number) {
		if (onselect) onselect(offset - Math.floor(offset / 17));
	}
</script>

<div class="d-flex font-monospace text-xs whitespace-pre text-break">
	<div class="user-select-none text-secondary" style="white-space: pre-wrap;">
		{addrLines.join('\n')}
	</div>
	<div class="ms-4 cursor-pointer" style="white-space: pre-wrap;">
		<HighlightedText
			text={hexLines.join('\n')}
			start={hexHighlight[0]}
			size={hexHighlight[1]}
			onoffsetClicked={onHexClick}
		/>
	</div>
	<div class="ms-4 cursor-pointer" style="white-space: pre-wrap;">
		<HighlightedText
			text={asciiLines.join('\n')}
			start={asciiHighlight[0]}
			size={asciiHighlight[1]}
			onoffsetClicked={onAsciiClick}
		/>
	</div>
</div>

<style>
	.text-xs {
		font-size: 0.75rem;
	}
	.cursor-pointer {
		cursor: pointer;
	}
</style>
