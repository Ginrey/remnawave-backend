import { z } from 'zod';
export declare const NodesSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    name: string;
    port: number | null;
    uuid: string;
    viewPosition: number;
    createdAt: Date;
    updatedAt: Date;
    countryCode: string;
    trafficLimitBytes: number | null;
    address: string;
    isDisabled: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    lastStatusChange: Date | null;
    lastStatusMessage: string | null;
    xrayVersion: string | null;
    nodeVersion: string | null;
    xrayUptime: string;
    isTrafficTrackingActive: boolean;
    trafficResetDay: number | null;
    trafficUsedBytes: number | null;
    notifyPercent: number | null;
    usersOnline: number | null;
    consumptionMultiplier: number;
    tags: string[];
    cpuCount: number | null;
    cpuModel: string | null;
    totalRam: string | null;
    configProfile: {
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
    };
    providerUuid: string | null;
    provider: {
        name: string;
        uuid: string;
        createdAt: Date;
        updatedAt: Date;
        faviconLink: string | null;
        loginUrl: string | null;
    } | null;
}, {
    name: string;
    port: number | null;
    uuid: string;
    viewPosition: number;
    createdAt: string;
    updatedAt: string;
    countryCode: string;
    trafficLimitBytes: number | null;
    address: string;
    isDisabled: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    lastStatusChange: string | null;
    lastStatusMessage: string | null;
    xrayVersion: string | null;
    nodeVersion: string | null;
    xrayUptime: string;
    isTrafficTrackingActive: boolean;
    trafficResetDay: number | null;
    trafficUsedBytes: number | null;
    notifyPercent: number | null;
    usersOnline: number | null;
    consumptionMultiplier: number;
    tags: string[];
    cpuCount: number | null;
    cpuModel: string | null;
    totalRam: string | null;
    configProfile: {
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
    };
    providerUuid: string | null;
    provider: {
        name: string;
        uuid: string;
        createdAt: string;
        updatedAt: string;
        faviconLink: string | null;
        loginUrl: string | null;
    } | null;
}>;
