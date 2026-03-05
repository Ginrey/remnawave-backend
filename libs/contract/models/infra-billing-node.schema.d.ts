import { z } from 'zod';
export declare const InfraBillingNodeSchema: z.ZodObject<{
    uuid: z.ZodString;
    nodeUuid: z.ZodString;
    providerUuid: z.ZodString;
    provider: z.ZodObject<Pick<{
        uuid: z.ZodString;
        name: z.ZodString;
        faviconLink: z.ZodNullable<z.ZodString>;
        loginUrl: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodEffects<z.ZodString, Date, string>;
        updatedAt: z.ZodEffects<z.ZodString, Date, string>;
    }, "name" | "uuid" | "faviconLink" | "loginUrl">, "strip", z.ZodTypeAny, {
        name: string;
        uuid: string;
        faviconLink: string | null;
        loginUrl: string | null;
    }, {
        name: string;
        uuid: string;
        faviconLink: string | null;
        loginUrl: string | null;
    }>;
    node: z.ZodObject<Pick<{
        uuid: z.ZodString;
        name: z.ZodString;
        address: z.ZodString;
        port: z.ZodNullable<z.ZodNumber>;
        isConnected: z.ZodBoolean;
        isDisabled: z.ZodBoolean;
        isConnecting: z.ZodBoolean;
        lastStatusChange: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        lastStatusMessage: z.ZodNullable<z.ZodString>;
        xrayVersion: z.ZodNullable<z.ZodString>;
        nodeVersion: z.ZodNullable<z.ZodString>;
        xrayUptime: z.ZodString;
        isTrafficTrackingActive: z.ZodBoolean;
        trafficResetDay: z.ZodNullable<z.ZodNumber>;
        trafficLimitBytes: z.ZodNullable<z.ZodNumber>;
        trafficUsedBytes: z.ZodNullable<z.ZodNumber>;
        notifyPercent: z.ZodNullable<z.ZodNumber>;
        usersOnline: z.ZodNullable<z.ZodNumber>;
        viewPosition: z.ZodNumber;
        countryCode: z.ZodString;
        consumptionMultiplier: z.ZodNumber;
        tags: z.ZodArray<z.ZodString, "many">;
        cpuCount: z.ZodNullable<z.ZodNumber>;
        cpuModel: z.ZodNullable<z.ZodString>;
        totalRam: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodEffects<z.ZodString, Date, string>;
        updatedAt: z.ZodEffects<z.ZodString, Date, string>;
        configProfile: z.ZodObject<{
            activeConfigProfileUuid: z.ZodNullable<z.ZodString>;
            activeInbounds: z.ZodArray<z.ZodObject<{
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
        }, "strip", z.ZodTypeAny, {
            activeConfigProfileUuid: string | null;
            activeInbounds: {
                type: string;
                port: number | null;
                uuid: string;
                profileUuid: string;
                tag: string;
                network: string | null;
                security: string | null;
                rawInbound?: unknown;
            }[];
        }, {
            activeConfigProfileUuid: string | null;
            activeInbounds: {
                type: string;
                port: number | null;
                uuid: string;
                profileUuid: string;
                tag: string;
                network: string | null;
                security: string | null;
                rawInbound?: unknown;
            }[];
        }>;
        providerUuid: z.ZodNullable<z.ZodString>;
        provider: z.ZodNullable<z.ZodObject<{
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
        }>>;
    }, "name" | "uuid" | "countryCode">, "strip", z.ZodTypeAny, {
        name: string;
        uuid: string;
        countryCode: string;
    }, {
        name: string;
        uuid: string;
        countryCode: string;
    }>;
    nextBillingAt: z.ZodEffects<z.ZodString, Date, string>;
    createdAt: z.ZodEffects<z.ZodString, Date, string>;
    updatedAt: z.ZodEffects<z.ZodString, Date, string>;
}, "strip", z.ZodTypeAny, {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    node: {
        name: string;
        uuid: string;
        countryCode: string;
    };
    nodeUuid: string;
    providerUuid: string;
    provider: {
        name: string;
        uuid: string;
        faviconLink: string | null;
        loginUrl: string | null;
    };
    nextBillingAt: Date;
}, {
    uuid: string;
    createdAt: string;
    updatedAt: string;
    node: {
        name: string;
        uuid: string;
        countryCode: string;
    };
    nodeUuid: string;
    providerUuid: string;
    provider: {
        name: string;
        uuid: string;
        faviconLink: string | null;
        loginUrl: string | null;
    };
    nextBillingAt: string;
}>;
