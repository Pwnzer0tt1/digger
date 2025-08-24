<script lang="ts">
	import { ctfConfig, selectedPanel } from "$lib/state.svelte";
	import Toast from "../Toast.svelte";
	import StatsOverview from "./StatsOverview.svelte";
	import StatsServices from "./StatsServices.svelte";

    let toast: Toast;

    let activeView: "overview" | "services" = $state("overview");

    let data = $derived.by(async () => {
        const res = await fetch("/api/stats");

        return await res.json();
    });
</script>

<div class="card shadow-lg h-100 overflow-auto">
    <div class="card-header hstack gap-3">
        <h5 class="modal-title">Stats</h5>
        <ul class="nav nav-underline">
            <li class="nav-item">
                <button onclick={() => activeView = "overview"} class="nav-link {activeView === "overview" ? "active" : ""}" >Overview</button>
            </li>
            <li class="nav-item">
                <button onclick={() => activeView = "services"} class="nav-link {activeView === "services" ? "active" : ""}">Services</button>
            </li>
        </ul>
        <button onclick={() => ctfConfig.hideSideBar = !ctfConfig.hideSideBar} class="ms-auto btn btn-outline-secondary" aria-label="Fullscreen">
            {#if ctfConfig.hideSideBar}
                <i class="bi bi-fullscreen-exit"></i>
            {:else}
                <i class="bi bi-fullscreen"></i>
            {/if}
        </button>
        <button onclick={() => {selectedPanel.view = undefined; ctfConfig.hideSideBar = false;}} type="button" class="btn btn-outline-secondary" aria-label="Close"><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="card-body">
        {#await data}
            <div class="d-flex justify-content-center">
                <div class="spinner-border my-5" role="status">
                    <span class="visually-hidden">Loading…</span>
                </div>
            </div>
        {:then data} 
            {#if activeView === "overview"}
                <StatsOverview flagsOut={data.flagsOut} flowsNum={data.flowsNum} />
            {:else if activeView === "services"}
                <StatsServices flagsOut={data.flagsOut} flowsNum={data.flowsNum} flagsOutFlows={data.flagsOutFlows} />
            {/if}
        {/await}
    </div>
</div>

<!-- Toast -->
<Toast bind:this={toast} />