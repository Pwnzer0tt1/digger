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
    let cellIndex: number = $state(-1);

    onMount(() => {
        document.addEventListener("mousemove", (e) => {          
            if (e.target.classList.contains("hex-cell") || e.target.classList.contains("text-cell")) {
                if (e.target.parentNode.parentNode.parentNode.getAttribute("data-hash") === sha256) {
                    cellIndex = Number(e.target.getAttribute("data-index"));
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

    function cellColor(index: number) {
        let color = "#7e9ca6";
        let isIncluded = false;
        if (startIndex !== undefined && endIndex === undefined) {
            if (cellIndex > startIndex && index > startIndex && index <= cellIndex) {    
                color = "#7e9ca6";
                isIncluded = true;
            }
            else if (index >= cellIndex && index < startIndex) {
                color = "#7e9ca6";
                isIncluded = true;
            }
        }
        else if (startIndex === undefined && endIndex !== undefined) {
            if (cellIndex > endIndex && index > endIndex && index <= cellIndex) {    
                color = "#7e9ca6";
                isIncluded = true;
            }
            else if (index >= cellIndex && index < endIndex) {
                color = "#7e9ca6";
                isIncluded = true;
            }
        }
        else if (startIndex !== undefined && endIndex !== undefined) {
            if (index > startIndex && index < endIndex) {    
                color = "#7e9ca6";
                isIncluded = true;
            }
        }
  
        if (index === cellIndex) {
            color = "#5a84a0";
        }
        else if (!isIncluded) {
            color = "#353535";
        }
        
        if (index === startIndex || index === endIndex) {
            color = "#066bd6";
        }
        
        return color;
    }

    function copyBytes(e: ClipboardEvent) {
        if (startIndex !== undefined && endIndex !== undefined) {
            e.clipboardData?.setData("text/plain", hex.slice(startIndex, endIndex + 1).join(" "));
        }
        
        e.preventDefault();
    }
</script>

<svelte:document onkeydown={shiftChange} onkeyup={shiftChange} />

<div data-hash={sha256} class="d-flex gap-3 text-light rounded" style="background-color: #353535;">
    <div class="rounded" style="background-color: #545454;">
        {#each offset as o, index (index)}
            <div class="px-2" style="height: 24px;">{o}</div>
        {/each}
    </div>
    <div style="flex: 1 0 40%;" oncopy={copyBytes}>
        <div class="d-flex align-content-start flex-wrap">
            {#each hex as h, index (index)}
                <div data-index={index} style="background-color: {cellColor(index)};" class="hex-cell text-center" role="none">{h}</div>
            {/each}
        </div>
    </div>
    <div style="flex: 1 0 40%;" oncopy={copyBytes}>
        <div class="d-flex align-content-start flex-wrap">
            {#each text as t, index (index)}
                <div data-index={index} style="background-color: {cellColor(index)};" class="text-cell text-center" role="none">{t}</div>
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