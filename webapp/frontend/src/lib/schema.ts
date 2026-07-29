import { z } from "zod/v4";


export type CtfConfigType = {
    start_date: string,
    end_date: string,
    tick_length: number,
    services: Record<string, {
        ipports: {
            ip: string,
            port: number,
        }[],
        color: string,
    }>
}

export const flowsListFilters = z.object({
    tick_op: z.string().optional(),
    ts: z.string().optional(),
    min_ts: z.string().optional(),
    max_ts: z.string().optional(),
    services: z.array(z.string()).optional(),
    app_proto: z.string().optional(),
    search: z.string().optional(),
    tags_require: z.array(z.string()),
    tags_deny: z.array(z.string())
});

export type FlowsListFilters = z.infer<typeof flowsListFilters>;

export type AppDataFileinfo = {
    filestore: string,
    bytes: Uint8Array,
    ext: string,
    tx_id: number,
    sha256: string,
    filename: string,
    magic: string,
};

export type FlowInfoType = {
    flow: {
        id: number,
        ts_start: number,
        ts_end: number,
        src_ipport: string,
        dest_port: number,
        dest_ipport: string,
        proto: string,
        app_proto: string,
        data: number[]
    },
    events: {
        event_type: string,
        data: number[]
    }[],
    alerts: {
        color: string | null,
        data: number[]
    }[]
};

export type Flow = {
    id: string,
    ts_start: string,
    ts_end: string,
    src_ip: string,
    src_port: number | null,
    src_ipport: string,
    dest_ip: string,
    dest_port: number | null,
    dest_ipport: string,
    proto: string,
    app_proto: string | null,
    data: {
        pkts_toserver: number,
        pkts_toclient: number,
        bytes_toserver: number,
        bytes_toclient: number,
        start: string,
        end: string,
        age: number,
        state: string,
        reason: string,
        alerted: boolean,
        tx_cnt: number
    },
    metadata?: {
        flowints?: {
            [key: string]: number
        },
        flowvars?: {
            match: string
        }[],
        flowbits?: string[]
    }
};

export type Tag = {
    tag: string,
    color: string
};