import { z } from 'zod';
export declare const ConfigProfileInboundsSchema: z.ZodObject<{
    uuid: z.ZodString;
    profileUuid: z.ZodString;
    tag: z.ZodString;
    type: z.ZodString;
    network: z.ZodNullable<z.ZodString>;
    security: z.ZodNullable<z.ZodString>;
    port: z.ZodNullable<z.ZodNumber>;
    rawInbound: z.ZodNullable<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    type: string;
    port: number | null;
    uuid: string;
    profileUuid: string;
    tag: string;
    network: string | null;
    security: string | null;
    rawInbound?: unknown;
}, {
    type: string;
    port: number | null;
    uuid: string;
    profileUuid: string;
    tag: string;
    network: string | null;
    security: string | null;
    rawInbound?: unknown;
}>;
