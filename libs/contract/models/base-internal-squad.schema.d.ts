import { z } from 'zod';
export declare const BaseInternalSquadSchema: z.ZodObject<{
    uuid: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    uuid: string;
}, {
    name: string;
    uuid: string;
}>;
