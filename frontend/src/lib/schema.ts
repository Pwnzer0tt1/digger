import { z } from "zod/v4";


export const flowsListFilters = z.object({
    ts_to: z.string().optional().default(String(1e16)),
    services: z.array(z.string()).optional(),
    app_proto: z.string().optional(),
    search: z.string().optional(),
    tags_require: z.array(z.string()),
    tags_deny: z.array(z.string())
});

export type FlowsListFilters = z.infer<typeof flowsListFilters>;

export type AlertExtraData = {
    action: string,
    gid: number,
    signature_id: number,
    rev: number,
    signature: string,
    category: string,
    severity: number,
    metadata: {
        color: string[],
        tag: string[]
    }
};

export type Fileinfo = {
    gaps: boolean,
    size: number,
    state: string,
    tx_id: number,
    sha256: string,
    stored: boolean,
    file_id: number,
    filename: string,
    magic?: string
};

export type AppDataFileinfo = {
    data: Blob,
    filestore: string,
    bytes: Uint8Array,
    ext: string,
    tx_id: number,
    sha256: string,
    filename: string,
    magic: string,
};

export type HTTPMetadata = {
    url: string,
    length: number,
    status: number,
    hostname: string,
    protocol: string,
    http_port: number,
    http_method: string,
    http_user_agent: string,
    request_headers: {
        name: string,
        value: string
    }[],
    response_headers: {
        name: string,
        value: string
    }[],
    http_content_type: string
};

export type WebsocketMetadata = {
    fin: boolean,
    mask?: number,
    opcode: string
};

export type EVEFlow = {
    timestamp: string,
    flow_id: number,
    event_type: string,
    src_ip: string,
    src_port: number,
    dest_ip: string,
    dest_port: number,
    ip_v: number,
    proto: string,
    app_proto: string,
    flow: {
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
    },
    tcp?: {
        tcp_flags: string,
        tcp_flags_ts: string,
        tcp_flags_tc: string,
        syn: boolean,
        fin: boolean,
        psh: boolean,
        ack: boolean,
        state: string,
        ts_max_regions: number,
        tc_max_regions: number
    }
}

export type EVEAlert = {
    timestamp: string,
    flow_id: number,
    pcap_cnt: number,
    event_type:string,
    src_ip: string,
    src_port: string,
    dest_ip: string,
    dest_port: number,
    proto: string,
    ip_v: number,
    pkt_src: string,
    metadata: {
        flowints: {
            [key: string]: number
        }
    },
    tx_id: number,
    alert: {
        action: string,
        gid: number,
        signature_id: number,
        rev: number,
        signature: string,
        category: string,
        severity: number,
        metadata: {
            color: string[],
            tag: string[]
        }
    }
};

export type EVEStats = {
    timestamp: string,
    event_type: string,
    stats: {
        uptime: number,
        decoder: {
            pkts: number,
            bytes: number,
            invalid: number,
            ipv4: number,
            ipv6: number,
            ethernet: number,
            arp: number,
            unknown_ethertype: number,
            chdlc: number,
            raw: number,
            null: number,
            sll: number,
            sll2: number,
            tcp: number,
            udp: number,
            sctp: number,
            esp: number,
            icmpv4: number,
            icmpv6: number,
            ppp: number,
            pppoe: number,
            geneve: number,
            gre: number, 
            vlan: number,
            vlan_qinq: number,
            vlan_qinqinq: number,
            vxlan: number,
            vntag: number,
            ieee8021ah: number,
            teredo: number,
            ipv4_in_ipv4: number,
            ipv6_in_ipv4: number,
            ipv4_in_ipv6: number,
            ipv6_in_ipv6: number,
            mpls: number,
            avg_pkt_size: number,
            max_pkt_size: number,
            max_mac_addrs_src: number,
            max_mac_addrs_dst: number,
            erspan: number,
            nsh: number,
            event: {
                [key: string]: any
            },
            too_many_layers: number
        },
        tcp: any,
        flow: any,
        defrag: any,
        flow_bypassed: any,
        detect: {
            engines: {
                id: number,
                last_reload: string,
                rules_loaded: number,
                rules_failed: number,
                rules_skipped: number
            }[],
            alert: number,
            alert_queue_overflow: number,
            alerts_suppressed: number,
            lua: {
                errors: number,
                blocked_function_errors: number,
                instruction_limit_errors: number,
                memory_limit_errors: number
            }
        },
        app_layer: {
            flow: {
                [key: string]: number
            },
            error: {
                [key: string]: {
                    gap?: number,
                    alloc?: number,
                    parser?: number,
                    internal?: number
                }
            },
            tx: {
                [key: string]: number
            }
        }
    }
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

export type Stats = {
    id: number,
    timestamp: string,
    data: EVEStats
};

export type Tag = {
    tag: string,
    color: string
};

export const flowId = z.bigint();

export const sha256 = z.string().regex(/^[a-fA-F0-9]{64}$/);

export const ctfConfig = z.object({
    start_date: z.iso.datetime({ local: true }),
    end_date: z.iso.datetime({ local: true }),
    tick_length: z.number().min(1),
    services: z.record(z.string(), z.object({
        ipports: z.array(z.object({
            ip: z.ipv4(),
            port: z.int32()
        })),
        color: z.string()
    }))
});

export type CtfConfig = z.infer<typeof ctfConfig>;

export const newCtfConfig = z.object({
    start_date: z.iso.datetime({ local: true }),
    end_date: z.iso.datetime({ local: true }),
    tick_length: z.int().min(1)
});

export type NewCtfConfig = z.infer<typeof newCtfConfig>;


export const addService = z.object({
    name: z.string(),
    color: z.string().regex(/^#([a-fA-F0-9]{2}){3}$/),
    ipports: z.array(z.object({
        ip: z.union([z.ipv4(), z.ipv6()]),
        port: z.int32()
    })).min(1)
});

export type AddService = z.infer<typeof addService>;

export const editRefreshRate = z.object({
    refreshRate: z.int32().min(1)
});

export type EditRefreshRate = z.infer<typeof editRefreshRate>;