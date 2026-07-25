<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { ctfConfig, selectedPanel } from "$lib/state.svelte";
	import { SettingsForm } from "$lib/zod";
	import { untrack } from "svelte";
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms";
	import { zod4 } from "sveltekit-superforms/adapters";

	let { formData } = $props();
	
	const { form, constraints, errors, enhance } = superForm(untrack(() => formData), {
        SPA: true,
        validators: zod4(SettingsForm),
        onUpdate({ form }) {
            if (form.valid) {
                ctfConfig.refreshRate = form.data.refresh_rate;

                fetch("/api/config", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        start_date: new Date(`${form.data.start_date}T${form.data.start_time}Z`).toISOString(),
                        end_date: new Date(`${form.data.end_date}T${form.data.end_time}Z`).toISOString(),
                        tick_length: form.data.tick_length
                    })
                })
                .then(async (res) => {
                    const data = await res.json();
                    if (res.ok) {
                        ctfConfig.config = data;
                      
                        toast.success("Settings updated");
                        invalidate("/api/config");
                    }
                    else {
                        toast.error("Failed to update settings", { description: JSON.stringify(data) });
                    }
                });
            }
        }
    });
</script>

<div class="card shadow-lg h-100">
    <div class="card-header hstack">
        <h5 class="modal-title flex-grow-1">Settings</h5>
        <button onclick={() => selectedPanel.view = undefined} type="button" class="btn-close " aria-label="Close"></button>
    </div>
    <div class="card-body">
        <form action="POST" use:enhance>
            <div class="mb-3">
                <label for="start-datetime" class="form-label">Start datetime (UTC time)</label>
                <div class="input-group">
                    <input name="start_date" bind:value={$form.start_date} {...$constraints.start_date} type="date" class="form-control">
                    <input name="start_time" bind:value={$form.start_time} {...$constraints.start_time} type="time" class="form-control">
                </div>
                <div class="hstack gap-3">
                    {#if $errors.start_date}
                        <span class="text-danger">{$errors.start_date}</span>
                    {/if}
                    {#if $errors.start_time}
                        <span class="text-danger">{$errors.start_time}</span>
                    {/if}
                </div>
            </div>
            <div class="mb-3">
                <label for="end-datetime" class="form-label">End datetime (UTC time)</label>
                <div class="input-group">
                    <input name="end_date" bind:value={$form.end_date} {...$constraints.end_date} type="date" class="form-control">
                    <input name="end_time" bind:value={$form.end_time} {...$constraints.end_time} type="time" class="form-control">
                </div>
                <div class="hstack gap-3">
                    {#if $errors.end_date}
                        <span class="text-danger">{$errors.end_date}</span>
                    {/if}
                    {#if $errors.end_time}
                        <span class="text-danger">{$errors.end_time}</span>
                    {/if}
                </div>
            </div>
            <div class="mb-3">
                <label for="tick-length" class="form-label">Tick length (s)</label>
                <input type="number" name="tick_length" bind:value={$form.tick_length} {...$constraints.tick_length} class="form-control" id="tick-length">
                {#if $errors.tick_length}
                    <span class="text-danger">{$errors.tick_length}</span>
                {/if}
            </div>
            <div class="mb-3">
                <label for="refresh-rate" class="form-label">Refresh rate (s) <strong>Note: this setting is client specific, others users will NOT use your same refresh rate.</strong></label>
                <input type="number" name="refresh_rate" bind:value={$form.refresh_rate} {...$constraints.refresh_rate} class="form-control" id="refresh-rate">
                {#if $errors.refresh_rate}
                    <span class="text-danger">{$errors.refresh_rate}</span>
                {/if}
            </div>
            <button type="submit" class="btn btn-primary w-100">Update settings</button>
        </form>
    </div>
</div>