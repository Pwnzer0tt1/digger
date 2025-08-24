<script lang="ts">
	import HexDumpViewer from "./DataViewers/HexDumpViewer.svelte";
	import TextViewer from "./DataViewers/TextViewer.svelte";

    let { appDataActiveView, index, fileinfo } = $props();
</script>

<div class="accordion" id="accordion-app-{index}">
    <div class="accordion-item">
        <h2 class="accordion-header btn-group w-100">
            <a href={fileinfo.filestore} download="{fileinfo.filename.replace("/", "_")}.{fileinfo.ext}" class="btn btn-success rounded-bottom-0">Download File</a>
            <button class="accordion-button rounded-start-0" type="button" data-bs-toggle="collapse" data-bs-target="#app-render-{index}" aria-expanded="true" aria-controls="collapseOne">File: {fileinfo.filename}  {fileinfo.magic}</button>
        </h2>
        <div id="app-render-{index}" class="accordion-collapse collapse show">
            {#if appDataActiveView === "render"}
                <div class="accordion-body p-1">
                    {#if ["gif", "jpg", "png", "svg"].includes(fileinfo.ext)}
                        <img src={URL.createObjectURL(fileinfo.data)} alt="">
                    {:else if fileinfo.ext === "pdf"}
                        <iframe title="App data viewer" src={URL.createObjectURL(fileinfo.data)} frameborder="0"></iframe>
                    {:else if fileinfo.ext === "html"}
                        <iframe class="bg-light w-100" style="height: 40vh;" title="HTML renderer" src={URL.createObjectURL(fileinfo.data.slice(0, fileinfo.data.size, "text/html"))} frameborder="0"></iframe>
                    {:else}
                        {#await fileinfo.data.text() then t}
                            <pre class="text-break">{t}</pre>
                        {/await}
                    {/if}
                </div>
            {:else if appDataActiveView === "utf8"}
                <div class="accordion-body p-0">
                    {#await fileinfo.data.text() then t}
                        <TextViewer text={t} ext={fileinfo.ext} magic={fileinfo.magic} sha256={fileinfo.sha256} />
                    {/await}
                </div>
            {:else if appDataActiveView === "hex"}
                <div class="accordion-body p-0">
                    <HexDumpViewer sha256={fileinfo.sha256} blob={fileinfo.bytes} />
                </div>
            {/if}
        </div>
    </div>
</div>