import { z } from 'zod';
export declare const ApiTokensSchema: z.ZodObject<{
    uuid: z.ZodString;
    token: z.ZodString;
    tokenName: z.ZodString;
    createdAt: z.ZodEffects<z.ZodString, Date, string>;
    updatedAt: z.ZodEffects<z.ZodString, Date, string>;
}, "strip", z.ZodTypeAny, {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    tokenName: string;
}, {
    uuid: string;
    createdAt: string;
    updatedAt: string;
    token: string;
    tokenName: string;
}>;
