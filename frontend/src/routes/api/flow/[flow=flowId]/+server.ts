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
            metadata: true,
            extra_data: true
        },
        where: {
            id: BigInt(params.flow)
        }
    });

    if (flow === null) {
        return error(404);
    }

    let result: any = {
        flow: {
            ...flow,
            id: flow.id.toString(),
            ts_start: flow.ts_start.toString(),
            ts_end: flow.ts_end.toString()
        }
    };

    // Get associated events
    const events = await prisma.other_event.findMany({
        select: {
            event_type: true,
            extra_data: true
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
            result[e.event_type].push(e.extra_data);
        }
        else {
            result[e.event_type] = [e.extra_data];
        }
    }

    if (result.flow.extra_data.alerted) {
        result.alert = await prisma.alert.findMany({
            select: {
                extra_data: true,
                color: true
            },
            where: {
                flow_id: BigInt(params.flow)
            },
            orderBy: {
                id: "asc"
            }
        });
    }

    return json(result);
};