import prisma from "$lib/server/prisma";
import { error, json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ params, locals }) => {
    if (!params.flow) {
        return json({ error: "Flow ID is required" }, { status: 400 });
    }

    // Query flow from database
    const flow = await prisma.flow.findUnique({
        select: {
            id: true,
            ts_start: true,
            ts_end: true,
            src_ipport: true,
            dest_ipport: true,
            dest_port: true,
            proto: true,
            app_proto: true,
            data: true
        },
        where: {
            id: BigInt(params.flow)
        }
    });

    if (flow === null) {
        return error(404);
    }

    const flowData = JSON.parse(Buffer.from(flow.data).toString());
    let result: any = {
        flow: {
            ...flow,
            id: flow.id.toString(),
            ts_start: flow.ts_start.toString(),
            ts_end: flow.ts_end.toString(),
            data: flowData["flow"],
            metadata: flowData["metadata"]
        }
    };

    // Get associated events
    const events = await prisma.other_event.findMany({
        select: {
            event_type: true,
            data: true
        },
        where: {
            flow_id: BigInt(params.flow)
        },
        orderBy: {
            id: "asc"
        }
    });
    for (const e of events) {
        if (result[e.event_type]) {
            result[e.event_type].push(JSON.parse(Buffer.from(e.data).toString())[e.event_type]);
        }
        else {
            result[e.event_type] = [JSON.parse(Buffer.from(e.data).toString())[e.event_type]];
        }
    }

    if (result.flow.data.alerted) {
        const alerts = await prisma.alert.findMany({
            select: {
                data: true,
                color: true
            },
            where: {
                flow_id: BigInt(params.flow)
            },
            orderBy: {
                id: "asc"
            }
        });
        result.alert = alerts.map((v) => {
            return {
                data: JSON.parse(Buffer.from(v.data).toString())["alert"],
                color: v.color
            };
        });
    }

    return json(result);
};