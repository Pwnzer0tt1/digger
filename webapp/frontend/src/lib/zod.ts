import { z } from "zod";

const Port = z.int().min(0).max(2 ** 16 - 1);

export const FlowId = z.bigint();

export const Sha256 = z.string().regex(/^[a-fA-F0-9]{64}$/);

export const AddService = z.object({
    name: z.string(),
    color: z.string().regex(/^#([a-fA-F0-9]{2}){3}$/),
    ipports: z.array(z.object({
        ip: z.union([z.ipv4(), z.ipv6()]),
        port: Port
    })).min(1)
});
export type AddServiceType = z.infer<typeof AddService>;

export const EditRefreshRate = z.object({
    refreshRate: z.int32().min(1)
});
export type EditRefreshRateType = z.infer<typeof EditRefreshRate>;

export const SettingsForm = z.object({
    start_date: z.iso.date(),
    start_time: z.iso.time(),
    end_date: z.iso.date(),
    end_time: z.iso.time(),
    tick_length: z.uint32().min(1),
    refresh_rate: z.uint32().min(1)
});