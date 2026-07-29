import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { SettingsForm } from "$lib/zod";
import type { CtfConfigType } from "$lib/schema";

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
    const ctfConfigRes = await fetch("/api/config");
    const ctfConfigData: CtfConfigType = await ctfConfigRes.json();
    
    const settingsForm = await superValidate({
        start_date: ctfConfigData.start_date.split("T")[0],
        start_time: ctfConfigData.start_date.split("T")[1].slice(0, 5),
        end_date: ctfConfigData.end_date.split("T")[0],
        end_time: ctfConfigData.end_date.split("T")[1].slice(0, 5),
        tick_length: ctfConfigData.tick_length,
        refresh_rate: 60
    }, zod4(SettingsForm));

    return {
        settingsForm
    };
};