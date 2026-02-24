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
            <div class="accordion-body p-1">
                {#if appDataActiveView === "render"}
                    {#if ["gif", "jpg", "png", "svg"].includes(fileinfo.ext)}
                        <img class="img-fluid" src={URL.createObjectURL(new Blob([fileinfo.bytes]))} alt="">
                    {:else if fileinfo.ext === "mp4"}
                        <video class="object-fit-contain" src={URL.createObjectURL(new Blob([fileinfo.bytes], { type: "video/mp4" }))} controls></video>
                    {:else if fileinfo.ext === "wav"}
                        <audio src={URL.createObjectURL(new Blob([fileinfo.bytes], { type: "audio/wav" }))} controls></audio>
                    {:else if fileinfo.ext === "pdf"}
                        <iframe title="App data viewer" src={URL.createObjectURL(new Blob([fileinfo.bytes], { type: "application/pdf" }))} frameborder="0"></iframe>
                    {:else if fileinfo.ext === "html"}
                        <iframe class="bg-light w-100" style="height: 40vh;" title="HTML renderer" src={URL.createObjectURL(new Blob([fileinfo.bytes], { type: "text/html" }))} frameborder="0"></iframe>
                    {:else}
                        {@const t = new TextDecoder().decode(fileinfo.bytes)}
                        <pre class="text-break">{t}</pre>
                    {/if}
                {:else if appDataActiveView === "utf8"}
                    {@const t = new TextDecoder().decode(fileinfo.bytes)}
                    <TextViewer text={t} ext={fileinfo.ext} magic={fileinfo.magic} sha256={fileinfo.sha256} />
                {:else if appDataActiveView === "hex"}
                    <HexDumpViewer sha256={fileinfo.sha256} blob={fileinfo.bytes} />
                {/if}
            </div>
        </div>
    </div>
</div>