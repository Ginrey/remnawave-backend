import { z } from 'zod';
export declare const InternalSquadSchema: z.ZodObject<{
    uuid: z.ZodString;
    viewPosition: z.ZodNumber;
    name: z.ZodString;
    info: z.ZodObject<{
        membersCount: z.ZodNumber;
        inboundsCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        membersCount: number;
        inboundsCount: number;
    }, {
        membersCount: number;
        inboundsCount: number;
    }>;
    inbounds: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    createdAt: z.ZodEffects<z.ZodString, Date, string>;
    updatedAt: z.ZodEffects<z.ZodString, Date, string>;
}, "strip", z.ZodTypeAny, {
    name: string;
    uuid: string;
    viewPosition: number;
    createdAt: Date;
    updatedAt: Date;
    inbounds: {
        type: string;
        port: number | null;
        uuid: string;
        profileUuid: string;
        tag: string;
        network: string | null;
        security: string | null;
        rawInbound?: unknown;
    }[];
    info: {
        membersCount: number;
        inboundsCount: number;
    };
}, {
    name: string;
    uuid: string;
    viewPosition: number;
    createdAt: string;
    updatedAt: string;
    inbounds: {
        type: string;
        port: number | null;
        uuid: string;
        profileUuid: string;
        tag: string;
        network: string | null;
        security: string | null;
        rawInbound?: unknown;
    }[];
    info: {
        membersCount: number;
        inboundsCount: number;
    };
}>;
