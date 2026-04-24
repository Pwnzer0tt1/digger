import { sha256 } from "$lib/schema";
import type { ParamMatcher } from "@sveltejs/kit";


export const match = ((param: string) => {
    try {
        sha256.parse(param);
        // TODO: Check if sha256 exists in the filedata table
        return true;
    }
    catch (e) {
        return false;
    }
}) satisfies ParamMatcher;