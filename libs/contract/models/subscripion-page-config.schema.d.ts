import z from 'zod';
export declare const SubscriptionPageConfigSchema: z.ZodObject<{
    uuid: z.ZodString;
    viewPosition: z.ZodNumber;
    name: z.ZodString;
    config: z.ZodNullable<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    uuid: string;
    viewPosition: number;
    config?: unknown;
}, {
    name: string;
    uuid: string;
    viewPosition: number;
    config?: unknown;
}>;
