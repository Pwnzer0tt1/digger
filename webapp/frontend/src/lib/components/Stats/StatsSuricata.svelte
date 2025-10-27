<script lang="ts">
	import { ctfConfig } from "$lib/state.svelte";
    import { Chart } from "chart.js/auto";
	import Stats from "./Stats.svelte";
	import { onMount } from "svelte";


    let overviewCtx: HTMLCanvasElement;
    let protocolsCtx: HTMLCanvasElement;
    onMount(async () => {
        const res = await fetch("/api/stats/suricata");
        const data: Stats[] = await res.json();
        
        let statistics: {
            tick: number
            packets: number,
            bytes: number,
            tcp: number,
            udp: number,
            app_protos: {
                [key: string]: number
            }
        }[] = [];
        const start_ts = Math.floor(Date.parse(ctfConfig.config.start_date + "Z") / 1000);
        for (const r of data) {
            const tick = Math.floor((Number(r.timestamp) / 1000000 - start_ts) / ctfConfig.config.tick_length);

            let j = JSON.parse(new TextDecoder().decode(Uint8Array.from(r.data)));
            statistics.push({
                tick,
                packets: j.stats.decoder.pkts,
                bytes: j.stats.decoder.bytes,
                tcp: j.stats.decoder.tcp,
                udp: j.stats.decoder.udp,
                app_protos: j.stats.app_layer.flow
            });
        }

        const overvieChart = new Chart(
            overviewCtx,
            {
                type: 'line',
                data: {
                    xLabels: statistics.map((v) => v.tick),
                    datasets: [
                        {
                            label: "Total Packets",
                            borderColor: "#2c0eb3",
                            data: statistics.map((v) => v.packets)
                        },
                        {
                            label: "TCP",
                            borderColor: "#1cbd0d",
                            data: statistics.map((v) => v.tcp)
                        },
                        {
                            label: "UDP",
                            borderColor: "#c75622",
                            data: statistics.map((v) => v.udp)
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Suricata stats"
                        }
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                    spanGaps: true
                }
            }
        );

        const protocolsChart = new Chart(
            protocolsCtx,
            {
                type: "doughnut",
                data: {
                    labels: Object.keys(statistics.at(-1)?.app_protos),
                    datasets: [
                        {
                            data: Object.values(statistics.at(-1)?.app_protos)
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "App layer flows"
                        }
                    }
                }
            }
        );
    });
</script>

<div class="vstack gap-3">
    <canvas bind:this={overviewCtx} style="height: 500px;"></canvas>

    <canvas bind:this={protocolsCtx} style="height: 300px;"></canvas>
</div>