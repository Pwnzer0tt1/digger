<script lang="ts">
	import { onMount } from "svelte";

	let { sha256, blob }: { sha256: string, blob: Uint8Array } = $props();

    let offset: string[] = [];
    let hex: string[] = [];
    let text: string[] = [];

    blob.forEach((b, i) => {
        if (i % 16 === 0) {
            offset.push(i.toString(16).padStart(8, "0").toUpperCase());
        }

        hex.push(b.toString(16).padStart(2, "0").toUpperCase());
        text.push((b >= 0x20 && b < 0x7f) ? String.fromCharCode(b) : ".");
    });

    let startIndex: number | undefined = undefined;
    let endIndex: number | undefined = undefined;
    let shiftPressed = false;

    let dumpTable: HTMLDivElement;
    let hexCells: HTMLCollectionOf<HTMLDivElement>;
    let textCells: HTMLCollectionOf<HTMLDivElement>;
    
    onMount(() => {
        hexCells = dumpTable.getElementsByClassName("hex-cell") as HTMLCollectionOf<HTMLDivElement>;
        textCells = dumpTable.getElementsByClassName("text-cell") as HTMLCollectionOf<HTMLDivElement>;
      
        document.addEventListener("mousemove", (e) => {          
            if (e.target.classList.contains("hex-cell") || e.target.classList.contains("text-cell")) {
                if (e.target.parentNode.parentNode.parentNode.getAttribute("data-hash") === sha256) {
                    let cellIndex = Number(e.target.getAttribute("data-index"));
                    for (let index = 0; index < blob.length; index++) {
                        let hexEl = hexCells.item(index);
                        let textEl = textCells.item(index);
                        let isIncluded = false;
                        if (startIndex !== undefined && endIndex === undefined) {
                            if (cellIndex > startIndex && index > startIndex && index <= cellIndex) {
                                hexEl.style.background = "#7e9ca6";
                                textEl.style.background = "#7e9ca6";
                                isIncluded = true;
                            }
                            else if (index >= cellIndex && index < startIndex) {
                                hexEl.style.background = "#7e9ca6";
                                textEl.style.background = "#7e9ca6";
                                isIncluded = true;
                            }
                        }
                        else if (startIndex === undefined && endIndex !== undefined) {
                            if (cellIndex > endIndex && index > endIndex && index <= cellIndex) {    
                                hexEl.style.background = "#7e9ca6";
                                textEl.style.background = "#7e9ca6";
                                isIncluded = true;
                            }
                            else if (index >= cellIndex && index < endIndex) {
                                hexEl.style.background = "#7e9ca6";
                                textEl.style.background = "#7e9ca6";
                                isIncluded = true;
                            }
                        }
                        else if (startIndex !== undefined && endIndex !== undefined) {
                            if (index > startIndex && index < endIndex) {    
                                hexEl.style.background = "#7e9ca6";
                                textEl.style.background = "#7e9ca6";
                                isIncluded = true;
                            }
                        }
                  
                        if (index === cellIndex) {
                            hexEl.style.background = "#5a84a0";
                            textEl.style.background = "#5a84a0";
                        }
                        else if (!isIncluded) {
                            hexEl.style.background = "#353535";
                            textEl.style.background = "#353535";
                        }
                        
                        if (index === startIndex || index === endIndex) {
                            hexEl.style.background = "#066bd6";
                            textEl.style.background = "#066bd6";
                        }
                    }
                }
            }
        });
        
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("hex-cell") || e.target.classList.contains("text-cell")) {
                if (e.target.parentNode.parentNode.parentNode.getAttribute("data-hash") === sha256) {
                    const index = Number(e.target.getAttribute("data-index"));
                    if (shiftPressed) {
                        if (index === startIndex) {
                            startIndex = undefined;
                        }
                        else if (index === endIndex) {
                            endIndex = undefined;
                        }
                        else if (startIndex === undefined && endIndex === undefined) {
                            startIndex = index;
                        }
                        else if (startIndex === undefined && endIndex !== undefined) {
                            if (index > endIndex) {
                                startIndex = endIndex;
                                endIndex = index;
                            }
                            else {
                                startIndex = index;
                            }
                        }
                        else if (startIndex !== undefined && endIndex !== undefined) {
                            if (index < startIndex) {
                                startIndex = index;
                            }
                            else {
                                endIndex = index;
                            }
                        }
                        else if (startIndex !== undefined) {
                            if (index < startIndex) {
                                endIndex = startIndex;
                                startIndex = index;
                            }
                            else {
                                endIndex = index;
                            }
                        }
                    }
                    else {
                        startIndex = undefined;    
                        endIndex = undefined;
                    }
                }
            }
        });
    });
    
    function shiftChange(e: KeyboardEvent) {
        if (e.target) {
            let el = e.target as HTMLElement;
            if (el.tagName !== "INPUT" && !e.repeat && !e.ctrlKey) {
                shiftPressed = e.shiftKey;
            }
        }
    }

    function copyBytes(e: ClipboardEvent) {
        if (startIndex !== undefined && endIndex !== undefined) {
            e.clipboardData?.setData("text/plain", hex.slice(startIndex, endIndex + 1).join(" "));
        }
        
        e.preventDefault();
    }
</script>

<svelte:document onkeydown={shiftChange} onkeyup={shiftChange} />

<div bind:this={dumpTable} data-hash={sha256} class="d-flex gap-3 text-light rounded" style="background-color: #353535;">
    <div class="rounded" style="background-color: #545454;">
        {#each offset as o, index (index)}
            <div class="px-2" style="height: 24px;">{o}</div>
        {/each}
    </div>
    <div style="flex: 1 0 40%;" oncopy={copyBytes}>
        <div class="d-flex align-content-start flex-wrap">
            {#each hex as h, index (index)}
                <div data-index={index} class="hex-cell text-center">{h}</div>
            {/each}
        </div>
    </div>
    <div style="flex: 1 0 40%;" oncopy={copyBytes}>
        <div class="d-flex align-content-start flex-wrap">
            {#each text as t, index (index)}
                <div data-index={index} class="text-cell text-center">{t}</div>
            {/each}
        </div>
    </div>
</div>

<style>
    .hex-cell, .text-cell {
        flex: 0 0 6.25%;
        height: 24px;
    }

    .hex-cell::selection, .text-cell::selection {
        color: white;
    }
</style>