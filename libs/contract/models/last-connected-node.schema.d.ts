import { z } from 'zod';
export declare const LastConnectedNodeSchema: z.ZodNullable<z.ZodObject<{
    connectedAt: z.ZodEffects<z.ZodString, Date, string>;
    nodeName: z.ZodString;
    countryCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    countryCode: string;
    connectedAt: Date;
    nodeName: string;
}, {
    countryCode: string;
    connectedAt: string;
    nodeName: string;
}>>;
