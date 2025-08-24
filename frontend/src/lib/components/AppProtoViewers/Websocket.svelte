<script lang="ts">
	import FlowAppFileView from "../FlowAppFileView.svelte";

    let { appDataActiveView, flowData, app_proto, flow_app_proto } = $props();
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
        {#each Object.entries(flow_app_proto) as [tx_id, data]}
            <tr>
                <th scope="row">{tx_id}</th>
                <td>{data.fin}</td>
                <td>{data.opcode}</td>
                <td>{data.mask}</td>
            </tr>
            {#each Object.entries(flowData.fileinfos[app_proto]) as [k, v]}
                {#if v.tx_id === Number(tx_id)}
                    <FlowAppFileView appDataActiveView={appDataActiveView} index={k} fileinfo={v} />
                {/if}
            {/each}
        {/each}
    </tbody>
</table>