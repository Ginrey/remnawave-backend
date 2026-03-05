import { z } from 'zod';
export declare const InfraProviderSchema: z.ZodObject<{
    uuid: z.ZodString;
    name: z.ZodString;
    faviconLink: z.ZodNullable<z.ZodString>;
    loginUrl: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodEffects<z.ZodString, Date, string>;
    updatedAt: z.ZodEffects<z.ZodString, Date, string>;
    billingHistory: z.ZodObject<{
        totalAmount: z.ZodNumber;
        totalBills: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalAmount: number;
        totalBills: number;
    }, {
        totalAmount: number;
        totalBills: number;
    }>;
    billingNodes: z.ZodArray<z.ZodObject<{
        nodeUuid: z.ZodString;
        name: z.ZodString;
        countryCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        countryCode: string;
        nodeUuid: string;
    }, {
        name: string;
        countryCode: string;
        nodeUuid: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    faviconLink: string | null;
    loginUrl: string | null;
    billingHistory: {
        totalAmount: number;
        totalBills: number;
    };
    billingNodes: {
        name: string;
        countryCode: string;
        nodeUuid: string;
    }[];
}, {
    name: string;
    uuid: string;
    createdAt: string;
    updatedAt: string;
    faviconLink: string | null;
    loginUrl: string | null;
    billingHistory: {
        totalAmount: number;
        totalBills: number;
    };
    billingNodes: {
        name: string;
        countryCode: string;
        nodeUuid: string;
    }[];
}>;
export declare const PartialInfraProviderSchema: z.ZodObject<{
    uuid: z.ZodString;
    name: z.ZodString;
    faviconLink: z.ZodNullable<z.ZodString>;
    loginUrl: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodEffects<z.ZodString, Date, string>;
    updatedAt: z.ZodEffects<z.ZodString, Date, string>;
}, "strip", z.ZodTypeAny, {
    name: string;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    faviconLink: string | null;
    loginUrl: string | null;
}, {
    name: string;
    uuid: string;
    createdAt: string;
    updatedAt: string;
    faviconLink: string | null;
    loginUrl: string | null;
}>;
