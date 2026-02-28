<script lang="ts">
	import type { AlertExtraData, Fileinfo, Flow, HTTPMetadata } from "$lib/schema";
	import { ctfConfig, selectedFlow } from "$lib/state.svelte";
	import HexDumpViewer from "./DataViewers/HexDumpViewer.svelte";
	import HttpReplay from "./ScriptGenerators/HttpReplay.svelte";
	import RawReplay from "./ScriptGenerators/RawReplay.svelte";
	import HttpFlow from "./AppProtoViewers/HTTP.svelte";
	import WebsocketFlow from "./AppProtoViewers/Websocket.svelte";
    

    let appDataActiveView: "render" | "utf8" | "hex" = $state("render");
    let rawDataActiveView: "utf8" | "hex" = $state("utf8");

    const MAGIC_EXT = {
        'GIF image': 'gif',
        'HTML document': 'html',
        'ISO Media': 'mp4',
        'JPEG image': 'jpg',
        'PDF document': 'pdf',
        'PNG image': 'png',
        'SVG Scalable Vector Graphics image': 'svg',
        'VGM Video Game Music': 'vgm',
        'RIFF (little-endian) data, WAVE audio': 'wav',
        'Web Open Font': 'woff',
        'Zip archive': 'zip'
    };

    const APP_PROTO = [
        "http",
        "http2",
        "quic",
        "websocket",
        "ftp",
        "tls",
        "tftp",
        "nfs",
        "smb",
        "ssh",
        "rdp",
        "rfb"
    ];

    function getExtFromMagic(magic: string) {
        for (const [magicPrefix, ext] of Object.entries(MAGIC_EXT)) {
            if (magic.startsWith(magicPrefix)) {
                return ext;
            }
        }
        return "txt";
    }

    let rawFlowData = $derived.by(async () => {
        let res = await fetch(`/api/flow/${selectedFlow.flow?.id}/raw`);
        let json: {
            server_to_client: string;
            blob: string;
        }[] = await res.json();

        return {
            raw: json
        }
    });

    let flowData = $derived.by(async () => {
        let res = await fetch(`/api/flow/${selectedFlow.flow?.id}`);
        let json: {
            flow: Flow,
            fileinfo?: Fileinfo[],
            alerts?: {
                data: AlertExtraData,
                color: string
            }[],
            anomaly: {
                extra_data: any
            }[],
            http?: HTTPMetadata[],
            http2?: any,
            quic?: any,
            websocket?: any,
            ftp?: any,
            tls?: any,
            tftp?: any,
            nfs?: any,
            smb?: any,
            ssh?: any,
            rdp?: any,
            rfb?: any,
            [key: string]: any
        } = await res.json();

        let flowData = JSON.parse(new TextDecoder().decode(Uint8Array.from(json.flow.data)));
        json.flow.data = flowData;
        const dateStart = flowData.flow.start.split("T").join(", ");
        const dateEnd = flowData.flow.end.split("T").join(", ");
        const start_ts = Math.floor(Date.parse(ctfConfig.config.start_date + "Z") / 1000);
        const tick = ((Number(json.flow.ts_start) / 1000000 - start_ts) / ctfConfig.config.tick_length).toFixed(3);

        let flowAppProto: {
            [key: string]: any
        } = {};
        let fileinfos: {
            [key: string]: {
                ext: string,
                filename: string,
                filestore: string,
                magic: string,
                bytes: Uint8Array,
                sha256: string,
                tx_id: number
            }[]
        } = {};
        
        if (json.flow.app_proto && json.flow.app_proto !== "failed") {
            for (const e of json.events) {
                if (APP_PROTO.includes(e.event_type)) {
                    if (!flowAppProto[e.event_type]) {
                        flowAppProto[e.event_type] = []
                    }
                    if (!fileinfos[e.event_type]) {
                        fileinfos[e.event_type] = [];
                    }
                    flowAppProto[e.event_type].push(JSON.parse(new TextDecoder().decode(Uint8Array.from(e.data)))[e.event_type]);
                }
                else if (e.event_type === "fileinfo") {
                    if (!fileinfos[json.flow.app_proto]) {
                        fileinfos[json.flow.app_proto] = [];
                    }
                    const d = JSON.parse(new TextDecoder().decode(Uint8Array.from(e.data))).fileinfo;
                    let ext = getExtFromMagic(d.magic ?? "");
                    let f = await fetch(`/api/filedata/${d.sha256}`);
                    let bytes = await f.bytes();
                    fileinfos[json.flow.app_proto].push({
                        ext,
                        filename: d.filename,
                        filestore: `/api/filedata/${d.sha256}`,
                        magic: d.magic ?? "",
                        bytes,
                        sha256: d.sha256,
                        tx_id: d.tx_id
                    });
                }
                else if (e.event_type === "anomaly") {
                    //const d = JSON.parse(new TextDecoder().decode(Uint8Array.from(e.data))).anomaly;
                    //console.log(d);
                }
            }
        }

        return {
            flow: json.flow,
            dateStart,
            dateEnd,
            tick,
            alerts: json.alerts,
            anomalies: json.anomaly,
            flowAppProto,
            fileinfos
        };
    });

    function changeAppDataView(event: any) {
        appDataActiveView = event.currentTarget.value;
    }

    function changeRawDataView(event: any) {
        rawDataActiveView = event.currentTarget.value;
    }

    let editorEl: HTMLDivElement | null = $state(null);
    let editor: any;
    $effect(() => {
        if (editorEl) {
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/dracula");
            editor.setOptions({
                readOnly: true
            });
        }
    });

    function switchView(e: KeyboardEvent) {
        if (e.target) {
            let el = e.target as HTMLElement;
            if (el.tagName !== 'INPUT' && !e.repeat && !e.ctrlKey && e.key === 'v') {
                if (appDataActiveView === "render") {
                    appDataActiveView = "utf8";
                }
                else if (appDataActiveView === "utf8") {
                    appDataActiveView = "hex";
                }
                else if (appDataActiveView === "hex") {
                    appDataActiveView = "render";
                }
                
                if (rawDataActiveView === "utf8") {
                    rawDataActiveView = "hex";    
                }
                else if (rawDataActiveView === "hex") {
                    rawDataActiveView = "utf8";
                }
            }
        }
    }
</script>

<svelte:document onkeydown={switchView} />

{#await flowData}
    Loading...
{:then flowData}
    <div class="vstack gap-3">
        <!-- Flow card -->
        <div class="hstack gap-2 align-items-stretch">
            <div class="card p-2 border-secondary">
                <p class="my-0">Tick {flowData.tick}</p>
                <p class="my-0">From {flowData.dateStart}</p>
                <p class="my-0">to {flowData.dateEnd}</p>
            </div>
            <div class="flex-grow-1 card p-2 border-secondary">
                <p class="my-0">{flowData.flow.proto} flow from {flowData.flow.src_ipport} to {flowData.flow.dest_ipport}</p>
                <p class="my-0"><i class="bi bi-arrow-right"></i> {flowData.flow.data.flow.pkts_toserver} packets ({flowData.flow.data.flow.bytes_toserver} bytes)</p>
                <p class="my-0"><i class="bi bi-arrow-left"></i> {flowData.flow.data.flow.pkts_toclient} packets ({flowData.flow.data.flow.bytes_toclient} bytes)</p>
            </div>
            <div class="d-flex align-items-stretch">
                <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                    <button onclick={() => ctfConfig.hideSideBar = !ctfConfig.hideSideBar} class="btn btn-outline-primary" aria-label="Fullscreen">
                        {#if ctfConfig.hideSideBar}
                            <i class="bi bi-fullscreen-exit"></i>
                        {:else}
                            <i class="bi bi-fullscreen"></i>
                        {/if}
                    </button>
                    <a href="/api/flow/{flowData.flow.id}/pcap" download="{flowData.flow.id}.lz4" class="btn btn-success" aria-label="Download pcap"><i class="bi bi-file-earmark-arrow-down-fill"></i></a>
                </div>
            </div>
        </div>

        <!-- Alerts -->
        {#if flowData.alerts}
            <div class="vstack gap-3">
                {#each flowData.alerts as a}
                    {@const alert_data = JSON.parse(new TextDecoder().decode(Uint8Array.from(a.data))).alert}
                    {#if alert_data.signature !== "tag" && alert_data.signature !== ""}
                        <div class="card p-2 border-{a.color}">{alert_data.signature}</div>
                    {/if}
                {/each}
            </div>
        {/if}

        <!-- Anomalies -->
        {#if flowData.anomalies}
            <div class="vstack gap-3">
                {#each flowData.anomalies as anomaly}
                    <div class="card p-2 border-warning">Dissection anomaly: {JSON.stringify(anomaly)}</div>
                {/each}
            </div>
        {/if}

        <!-- App data -->
        {#if flowData.flow.app_proto && flowData.flow.app_proto !== "failed"}
            <div class="accordion" id="accordion-app">
                <div class="accordion-item border-success">
                    <div class="accordion-header hstack gap-3 bg-body-tertiary p-1 px-3 rounded">
                        <h5 class="mb-0">{flowData.flow.app_proto}</h5>
                        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                            <input value="render" onchange={changeAppDataView} type="radio" class="btn-check" name="appviewbtnradio" id="app-data-btn-render" autocomplete="off" checked={appDataActiveView === "render"}>
                            <label class="btn btn-sm btn-outline-primary" for="app-data-btn-render">Render</label>

                            <input value="utf8" onchange={changeAppDataView} type="radio" class="btn-check" name="appviewbtnradio" id="app-data-btn-utf8" autocomplete="off"  checked={appDataActiveView === "utf8"}>
                            <label class="btn btn-sm btn-outline-primary" for="app-data-btn-utf8">UTF-8</label>

                            <input value="hex" onchange={changeAppDataView} type="radio" class="btn-check" name="appviewbtnradio" id="app-data-btn-hex" autocomplete="off"  checked={appDataActiveView === "hex"}>
                            <label class="btn btn-sm btn-outline-primary" for="app-data-btn-hex">Hex</label>
                        </div>
                        <button class="ms-auto btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#app-replay-script" aria-label="Generate script">Generate script</button>
                        <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#display-app" aria-expanded="true" aria-controls="display-app" aria-label="Toggle accordion"><i class="bi bi-chevron-down"></i></button>
                    </div>
                    <div id="display-app" class="accordion-collapse collapse show">
                        <div class="accordion-body">
                            <div class="vstack gap-3">
                                {#each Object.entries(flowData.flowAppProto) as [app_proto, flow_app_proto] }
                                    {#if app_proto === "http" || app_proto === "http2"}
                                        <HttpFlow appDataActiveView={appDataActiveView} destPort={flowData.flow.dest_port} fileinfos={flowData.fileinfos[app_proto]} app_proto={app_proto} flow_app_proto={flow_app_proto} />
                                    {:else if app_proto === "websocket"}
                                        <WebsocketFlow appDataActiveView={appDataActiveView} fileinfos={flowData.fileinfos[app_proto]} flow_app_proto={flow_app_proto} />
                                    {:else}
                                        {#each Object.entries(flow_app_proto as any) as [tx_id, data]}
                                            <div>
                                                <span>{JSON.stringify(data, null, 4)}</span>
                                            </div>
                                        {/each}
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
        
        <!-- Raw data -->
        {#await rawFlowData}
            Loading...
        {:then rawFlowData}
            {#if (flowData.flow.proto === "TCP" || flowData.flow.proto === "UDP") && flowData.flow.data.state !== "new"}
                <div class="accordion" id="accordion-raw">
                    <div class="accordion-item border-primary">
                        <div class="accordion-header hstack gap-3 bg-body-tertiary p-1 px-3 rounded">
                            <h5 class="mb-0">Raw data {flowData.flow.proto}</h5>
                            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input value="utf8" onchange={changeRawDataView} type="radio" class="btn-check" name="rawviewbtnradio" id="raw-data-btn-utf8" autocomplete="off" checked={rawDataActiveView === "utf8"}>
                                <label class="btn btn-sm btn-outline-primary" for="raw-data-btn-utf8">UTF-8</label>

                                <input value="hex" onchange={changeRawDataView} type="radio" class="btn-check" name="rawviewbtnradio" id="raw-data-btn-hex" autocomplete="off" checked={rawDataActiveView === "hex"}>
                                <label class="btn btn-sm btn-outline-primary" for="raw-data-btn-hex">Hex</label>
                            </div>
                            <button class="ms-auto btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#raw-replay-script" aria-label="Generate script">Generate script</button>
                            <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#display-raw" aria-expanded="true" aria-controls="display-raw" aria-label="Toggle accordion"><i class="bi bi-chevron-down"></i></button>
                        </div>
                        <div id="display-raw" class="accordion-collapse collapse show">
                            <div class="accordion-body vstack">
                                {#each Object.entries(rawFlowData.raw) as [i, chunk]}
                                    {@const byteArray = Uint8Array.from(chunk.blob)}
                                    {#if rawDataActiveView === "utf8"}
                                        <pre class="rounded p-2 {chunk.server_to_client === 0 ? "bg-danger" : ""}{chunk.server_to_client === 1 ? "bg-success" : ""}">{new TextDecoder().decode(byteArray)}</pre>
                                    {:else if rawDataActiveView === "hex"}
                                        <pre class="rounded p-2 {chunk.server_to_client === 0 ? "bg-danger" : ""}{chunk.server_to_client === 1 ? "bg-success" : ""}"><HexDumpViewer sha256={i} blob={byteArray} /></pre>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Raw replay script -->
            <div class="modal fade" id="raw-replay-script" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Raw protocol script</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <RawReplay ipport={flowData.flow.dest_ipport} data={flowData.flow} raw={rawFlowData.raw} />
                        </div>
                    </div>
                </div>
            </div>
        {/await}
    </div>

    <!-- App replay script -->
    <div class="modal fade" id="app-replay-script" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">App protocol script</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    {#if flowData.flow.app_proto === "http" || flowData.flow.app_proto === "http2"}
                        <HttpReplay flowId={flowData.flow.id} ipport={flowData.flow.dest_ipport} data={flowData.flowAppProto[flowData.flow.app_proto]} />
                    {:else}
                        <p class="p-4">Script generation not implemented for {flowData.flow.app_proto}</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/await}