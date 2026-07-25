import { Sha256 } from "$lib/zod";
import type { ParamMatcher } from "@sveltejs/kit";


export const match = ((param: string) => {
    try {
        Sha256.parse(param);
        // TODO: Check if sha256 exists in the filedata table
        return true;
    }
    catch {
        return false;
    }
}) satisfies ParamMatcher;