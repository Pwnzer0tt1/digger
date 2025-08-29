import prisma from "$lib/server/prisma";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ }) => {
    const suricata = await prisma.stats.findMany({
        select: {
            timestamp: true,
            data: true
        }
    });

    return json(suricata.map((v) => {
        return {
            timestamp: v.timestamp.toString(),
            data: JSON.parse(Buffer.from(v.data).toString())
        }
    }));
};