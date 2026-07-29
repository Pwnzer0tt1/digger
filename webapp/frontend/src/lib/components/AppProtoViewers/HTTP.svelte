<script lang="ts">
	import type { HTTPEvent } from "$lib/EVE";
	import type { AppDataFileinfo } from "$lib/schema";
	import FlowAppFileView from "../FlowAppFileView.svelte";

    let { appDataActiveView, destPort, fileinfos, app_proto, flow_app_proto }: {
        appDataActiveView: string,
        destPort: number | null,
        fileinfos: AppDataFileinfo[],
        app_proto: string,
        flow_app_proto: HTTPEvent[]
    } = $props();
</script>

{#each Object.entries(flow_app_proto as HTTPEvent[]) as [tx_id, data] (tx_id)}
    <div>
        <span class="fw-bold">{data.http_method ?? "?"} http://{data.hostname}:{data.http_port ?? destPort}{data.url ?? ""} {data.protocol ?? ""} <i class="bi bi-caret-left-fill"></i> <button class="btn btn-sm btn-info fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-{app_proto}-{tx_id}" aria-expanded="false" aria-controls="collapse-{app_proto}-{tx_id}">{data.status ?? "?"}</button></span>
        {#each data.request_headers as h, index (index)}
            <p class="my-0">{h.name}: {h.value}</p>
        {/each}
        <div class="collapse" id="collapse-{app_proto}-{tx_id}">
            <div class="card card-body">
                <span class="fw-bold">{data.protocol} {data.status}</span>
                {#each data.response_headers as h, index (index)}
                    <p class="my-0">{h.name}: {h.value}</p>
                {/each}
            </div>
        </div>
    </div>
    {#each Object.entries(fileinfos) as [k, v] (k)}
        {#if v.tx_id === Number(tx_id)}
            <FlowAppFileView appDataActiveView={appDataActiveView} index={k} fileinfo={v} />
        {/if}
    {/each}
{/each}