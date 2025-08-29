import fs from "node:fs";
import prisma from "$lib/server/prisma";
import { error, json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ params, locals }) => {
    if (!params.filedata) {
        return json({ error: "Filedata sha256 is required" }, { status: 400 });
    }

    const filedata = await prisma.filedata.findUnique({
        select: {
            blob: true
        },
        where: {
            sha256: Buffer.from(params.filedata, "hex")
        }
    });
    
    if (filedata === null) {
        return error(404);
    }

    return new Response(filedata.blob);
};