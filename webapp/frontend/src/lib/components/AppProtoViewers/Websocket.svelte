<script lang="ts">
	import type { WebsocketEvent } from "$lib/EVE";
	import type { AppDataFileinfo } from "$lib/schema";
	import FlowAppFileView from "../FlowAppFileView.svelte";

    let { appDataActiveView, fileinfos, flow_app_proto }: {
        appDataActiveView: string,
        fileinfos: AppDataFileinfo[],
        flow_app_proto: WebsocketEvent[]
    }  = $props();
</script>

<table class="table table-hover table-bordered">
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">FIN</th>
            <th scope="col">OPCODE</th>
            <th scope="col">MASK</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.entries(flow_app_proto) as [tx_id, data] (tx_id)}
            <tr>
                <th scope="row">{tx_id}</th>
                <td>{data.fin}</td>
                <td>{data.opcode}</td>
                <td>{data.mask}</td>
            </tr>
            {#each Object.entries(fileinfos) as [k, v] (k)}
                {#if v.tx_id === Number(tx_id)}
                    <FlowAppFileView appDataActiveView={appDataActiveView} index={k} fileinfo={v} />
                {/if}
            {/each}
        {/each}
    </tbody>
</table>