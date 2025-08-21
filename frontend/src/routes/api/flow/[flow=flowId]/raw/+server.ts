import prisma from "$lib/server/prisma";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ params, locals }) => {
    if (!params.flow) {
        return json({ error: "Flow ID is required" }, { status: 400 });
    }

    const raws = await prisma.raw.findMany({
        select: {
            server_to_client: true,
            blob: true
        },
        where: {
            flow_id: BigInt(params.flow)
        },
        orderBy: {
            count: "asc"
        }
    });

    return json(raws.map((v) => {
        return {
            server_to_client: v.server_to_client?.toString(),
            data: v.blob === null ? "" : Buffer.from(v.blob).toString("base64")
        }
    }));
};