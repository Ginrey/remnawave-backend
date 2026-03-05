import { z } from 'zod';
export declare const IMPORT_FETCH_STATUS: {
    readonly PENDING: "PENDING";
    readonly SUCCESS: "SUCCESS";
    readonly ERROR: "ERROR";
};
export type TImportFetchStatus = (typeof IMPORT_FETCH_STATUS)[keyof typeof IMPORT_FETCH_STATUS];
export declare const SubscriptionImportSourceSchema: z.ZodObject<{
    uuid: z.ZodString;
    name: z.ZodString;
    url: z.ZodString;
    isEnabled: z.ZodBoolean;
    fetchIntervalMinutes: z.ZodNumber;
    configProfileInboundUuid: z.ZodNullable<z.ZodString>;
    lastFetchedAt: z.ZodEffects<z.ZodNullable<z.ZodString>, Date | null, string | null>;
    lastFetchStatus: z.ZodNullable<z.ZodNativeEnum<{
        readonly PENDING: "PENDING";
        readonly SUCCESS: "SUCCESS";
        readonly ERROR: "ERROR";
    }>>;
    lastFetchError: z.ZodNullable<z.ZodString>;
    lastHostsCount: z.ZodNullable<z.ZodNumber>;
    createdAt: z.ZodEffects<z.ZodString, Date, string>;
    updatedAt: z.ZodEffects<z.ZodString, Date, string>;
}, "strip", z.ZodTypeAny, {
    name: string;
    url: string;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    configProfileInboundUuid: string | null;
    isEnabled: boolean;
    fetchIntervalMinutes: number;
    lastFetchedAt: Date | null;
    lastFetchStatus: "PENDING" | "SUCCESS" | "ERROR" | null;
    lastFetchError: string | null;
    lastHostsCount: number | null;
}, {
    name: string;
    url: string;
    uuid: string;
    createdAt: string;
    updatedAt: string;
    configProfileInboundUuid: string | null;
    isEnabled: boolean;
    fetchIntervalMinutes: number;
    lastFetchedAt: string | null;
    lastFetchStatus: "PENDING" | "SUCCESS" | "ERROR" | null;
    lastFetchError: string | null;
    lastHostsCount: number | null;
}>;
export type TSubscriptionImportSource = z.infer<typeof SubscriptionImportSourceSchema>;
