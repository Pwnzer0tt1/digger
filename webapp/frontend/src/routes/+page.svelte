<script lang="ts">
	import FlowDisplay from '$lib/components/FlowDisplay.svelte';
	import ServicesManager from '$lib/components/ServicesManager.svelte';
	import Settings from '$lib/components/Settings.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import TickProgressBar from '$lib/components/TickProgressBar.svelte';
	import WelcomePanel from '$lib/components/WelcomePanel.svelte';
	import type { Tag } from '$lib/schema';
	import { ctfConfig, flows, flowsFilters, selectedFlow, selectedPanel } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';


	let { data } = $props();

    let tags: Tag[] = $state([]);
    let appProto: string[] = $state([]);

    let flowsListInterval: string | number | NodeJS.Timeout | undefined;


    async function getFlowsList() {
        let res = await fetch(`/api/flow?filters=${JSON.stringify(flowsFilters)}`);
        let json = await res.json();

        flows.flows = json.flows;
        tags = json.tags;
        appProto = json.app_protos;
    }

    function flowsSelection(e: KeyboardEvent) {
        if (e.target) {
            let el = e.target as HTMLElement;
            if (el.tagName !== "INPUT" && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                switch (e.code) {
                    case "ArrowLeft":
                        if (selectedFlow.flow) {
                            if (selectedFlow.flowIndex > 0) {
                                selectedFlow.flow = flows.flows.at(selectedFlow.flowIndex - 1);
                                selectedFlow.flowIndex -= 1;
                            }
                        }
                        else {
                            selectedFlow.flow = flows.flows.at(0);
                            selectedFlow.flowIndex = 0;
                        }
                        break;
                    case "ArrowRight":
                        if (selectedFlow.flow) {
                            if (selectedFlow.flowIndex < flows.flows.length - 1) {
                                selectedFlow.flow = flows.flows.at(selectedFlow.flowIndex + 1);
                                selectedFlow.flowIndex += 1;
                            }
                        }
                        else {
                            selectedFlow.flow = flows.flows.at(0);
                            selectedFlow.flowIndex = 0;
                        }
                        break;
                    case "Escape":
                        if (selectedPanel.view) {
                            selectedPanel.view = undefined;
                        }
                        else {
                            selectedFlow.flow = undefined;
                        }
                        ctfConfig.hideSideBar = false;
                        break;
                }
            }
        }
    }

    // Fetch new flows when filters are changed
    $effect(() => {
        if (flowsFilters) {
            selectedFlow.flow = undefined;
            selectedFlow.flowIndex = -1;
            getFlowsList();
        }
    });

    // Reset interval for flows fetching on refresh rate updates
    $effect(() => {
        clearInterval(flowsListInterval);
        flowsListInterval = setInterval(async () => {
            if (ctfConfig.autoUpdate) {
                getFlowsList();
            }
        }, ctfConfig.refreshRate * 1000);
    });

    let grafanaURL: string | null = $state(null);
    
    onMount(async () => {
        getFlowsList();

        grafanaURL = window.location.origin.replace(window.location.port, "8001");
        
        const res = await fetch("/api/config");
        ctfConfig.config = await res.json();
    });
</script>

<svelte:document onkeydown={flowsSelection} />

<div class="overflow-hidden d-flex flex-column vh-100 p-2">
    <div class="overflow-hidden d-flex gap-2 pb-2 flex-grow-1 min-h-0">
        {#if !ctfConfig.hideSideBar}
            <div class="flex-shrink-0 w-25 min-h-0">
                <!-- Side bar -->
                <SideBar tags={tags} appProto={appProto} />
            </div>
        {/if}
        <div class="flex-grow-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {#if selectedPanel.view === "ServicesManager"}
                <!-- Manage services -->
                <ServicesManager />
            {:else if selectedPanel.view === "Settings"}
                <Settings formData={data.settingsForm} />
            {:else}
                {#if selectedFlow.flow}
                    <!-- Flow display -->
                    <FlowDisplay />
                {:else}
                    <!-- Welcome section, shown only when no flows are selected -->
                    <div class="position-relative top-50">
                        <WelcomePanel />
                        
                    </div>
                {/if}
            {/if}
        </div>
    </div>
    <div class="hstack gap-2 flex-shrink-0">
        <!-- Progress bar per tick -->
        <TickProgressBar />
        {#if ctfConfig.ctfEnded}
            <button class="col-2 btn btn-outline-danger">THE CTF IS OVER</button>
        {/if}
        <div class="btn-group" role="group" aria-label="Basic example">
            <a class="btn btn-primary" title="Grafana" href={grafanaURL} target="_blank" aria-label="Grafana"><i class="bi bi-graph-up"></i></a>
            <button onclick={() => selectedPanel.view = "Settings"} type="button" class="btn btn-primary" title="Settings" aria-label="Settings"><i class="bi bi-gear-fill"></i></button>
        </div>
    </div>
</div>

<style>
    :global(.min-h-0) {
        min-height: 0;
    }
</style>