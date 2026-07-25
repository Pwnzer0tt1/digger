<script lang="ts">
	import type { Flow, Tag } from "$lib/schema";
	import { ctfConfig, pinnedFlows, selectedFlow } from "$lib/state.svelte";
	import TagBadge from "./TagBadge.svelte";

    let { index, flow, tags }: { index: number, flow: Flow, tags: Tag[] } = $props();
    
    const delay = $derived((Number(flow.ts_end) - Number(flow.ts_start)) / 1000);
    const time = $derived(new Date(Number(flow.ts_start) / 1000).toISOString().split("T")[1]);
    const flowTags = $derived((flow.alerts ?? []).map((v) => v.tag));
    const appProto = $derived(flow.app_proto ?? "failed");

    let pinBtn: HTMLButtonElement;
    let btn: HTMLButtonElement;

    let {serviceColor, serviceName} = $derived.by(() => {
        for (const [name, service] of Object.entries(ctfConfig.config.services)) {
            if (service.ipports.map(v => `${v.ip}:${v.port}`).includes(flow.dest_ipport)) {
                return {serviceColor: service.color, serviceName: name};
            }
        }

        return {serviceColor: "#6c757d", serviceName: "Unknown"};
    });

    function selectFlow() {
        selectedFlow.flow = flow;
        selectedFlow.flowIndex = index;

        btn.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
    
    function pinFlow() {
        if (pinnedFlows.flows[flow.id]) {
            delete pinnedFlows.flows[flow.id];
        }
        else {
          pinnedFlows.flows[flow.id] = flow;
        }
    }

    $effect(() => {
        if (selectedFlow.flow) {
            if (selectedFlow.flow.id === flow.id) {
                btn.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }
        }
    });
</script>

<div class="btn-group border" role="group">
    <button bind:this={pinBtn} onclick={pinFlow} type="button" class="btn {selectedFlow.flow ? (selectedFlow.flow.id === flow.id ? "btn-primary" : "") : ""}" aria-label="Pin flow">
        {#if pinnedFlows.flows[flow.id]}
            <i class="bi bi-pin-angle-fill"></i>
        {:else}
            <i class="bi bi-pin-angle"></i>
        {/if}
    </button>
    <button bind:this={btn} onclick={selectFlow} class="border-0 btn list-group-item list-group-item-action py-1 ps-0 pe-2 {selectedFlow.flow ? (selectedFlow.flow.id === flow.id ? "active" : "") : ""}" type="button">
        <div class="d-flex justify-content-between mb-1">
            <small><span class="badge" style="background-color: {serviceColor}">{serviceName}</span> (:{flow.dest_port})</small>
            <small>{delay.toPrecision(3)} { delay > 1000 ? "s" : "ms" }, { time }</small>
        </div>
        <TagBadge text={appProto.toUpperCase()} />
        {#each tags as t, index (index)}
            {#if flowTags.includes(t.tag)}
                {@const tagId = "tag_" + t.tag.replace(/[^A-Za-z0-9]/g, "_")}
                <TagBadge text={t.tag} color={t.color} count={flow.metadata ? (flow.metadata.flowints ? flow.metadata.flowints[tagId] : undefined) : undefined} />
            {/if}
        {/each}
    </button>
</div>