import fs from "node:fs";
import prisma from "$lib/server/prisma";
import { error, json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ params, locals }) => {
    if (!params.flow) {
        return json({ error: "Flow ID is required" }, { status: 400 });
    }

    const flow = await prisma.flow.findUnique({
        select: {
            ts_start: true
        },
        where: {
            id: BigInt(params.flow)
        }
    });

    if (flow === null) {
        return error(404);
    }

    const flow_us = Number(flow.ts_start) / 1000;
    
    let flow_pcap_file = undefined;
    for (const f of fs.readdirSync("../suricata/output/pcaps")) {
        const pcap_us = Number(f.split(".")[2]);
        if (pcap_us > flow_us) {
            break;
        }
        flow_pcap_file = f;
    }

    if (flow_pcap_file === undefined) {
        return error(404);
    }

    try {
        const file = fs.readFileSync(`../suricata/output/pcaps/${flow_pcap_file}`);
        return new Response(file);
    }
    catch {
        return error(404);
    }
};