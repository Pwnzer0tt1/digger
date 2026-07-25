import { FlowId } from "$lib/zod";
import type { ParamMatcher } from "@sveltejs/kit";


export const match = ((param: string) => {
    try {
        FlowId.parse(BigInt(param));
        // TODO: Check if flowId exists in the database
        return true;
    }
    catch {
        return false;
    }
}) satisfies ParamMatcher;