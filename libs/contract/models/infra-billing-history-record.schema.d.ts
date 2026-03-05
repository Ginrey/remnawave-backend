import { z } from 'zod';
export declare const InfraBillingHistoryRecordSchema: z.ZodObject<{
    uuid: z.ZodString;
    providerUuid: z.ZodString;
    amount: z.ZodNumber;
    billedAt: z.ZodEffects<z.ZodString, Date, string>;
    provider: z.ZodObject<Omit<{
        uuid: z.ZodString;
        name: z.ZodString;
        faviconLink: z.ZodNullable<z.ZodString>;
        loginUrl: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodEffects<z.ZodString, Date, string>;
        updatedAt: z.ZodEffects<z.ZodString, Date, string>;
    }, "createdAt" | "updatedAt" | "loginUrl">, "strip", z.ZodTypeAny, {
        name: string;
        uuid: string;
        faviconLink: string | null;
    }, {
        name: string;
        uuid: string;
        faviconLink: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    uuid: string;
    providerUuid: string;
    provider: {
        name: string;
        uuid: string;
        faviconLink: string | null;
    };
    amount: number;
    billedAt: Date;
}, {
    uuid: string;
    providerUuid: string;
    provider: {
        name: string;
        uuid: string;
        faviconLink: string | null;
    };
    amount: number;
    billedAt: string;
}>;
