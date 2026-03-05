import z from 'zod';
export declare const RemnawaveWebhookUserEvents: z.ZodObject<{
    scope: z.ZodLiteral<"user">;
    event: z.ZodEnum<["user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected", ...("user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        uuid: z.ZodString;
        id: z.ZodNumber;
        shortUuid: z.ZodString;
        username: z.ZodString;
        status: z.ZodDefault<z.ZodNativeEnum<{
            readonly ACTIVE: "ACTIVE";
            readonly DISABLED: "DISABLED";
            readonly LIMITED: "LIMITED";
            readonly EXPIRED: "EXPIRED";
        }>>;
        trafficLimitBytes: z.ZodDefault<z.ZodNumber>;
        trafficLimitStrategy: z.ZodDefault<z.ZodNativeEnum<{
            readonly NO_RESET: "NO_RESET";
            readonly DAY: "DAY";
            readonly WEEK: "WEEK";
            readonly MONTH: "MONTH";
        }>>;
        expireAt: z.ZodEffects<z.ZodString, Date, string>;
        telegramId: z.ZodNullable<z.ZodNumber>;
        email: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        tag: z.ZodNullable<z.ZodString>;
        hwidDeviceLimit: z.ZodNullable<z.ZodNumber>;
        externalSquadUuid: z.ZodNullable<z.ZodString>;
        trojanPassword: z.ZodString;
        vlessUuid: z.ZodString;
        ssPassword: z.ZodString;
        lastTriggeredThreshold: z.ZodDefault<z.ZodNumber>;
        subRevokedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        subLastUserAgent: z.ZodNullable<z.ZodString>;
        subLastOpenedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        lastTrafficResetAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        createdAt: z.ZodEffects<z.ZodString, Date, string>;
        updatedAt: z.ZodEffects<z.ZodString, Date, string>;
    } & {
        subscriptionUrl: z.ZodString;
        activeInternalSquads: z.ZodArray<z.ZodObject<{
            uuid: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            uuid: string;
        }, {
            name: string;
            uuid: string;
        }>, "many">;
        userTraffic: z.ZodObject<{
            usedTrafficBytes: z.ZodNumber;
            lifetimeUsedTrafficBytes: z.ZodNumber;
            onlineAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            firstConnectedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            lastConnectedNodeUuid: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: Date | null;
            firstConnectedAt: Date | null;
            lastConnectedNodeUuid: string | null;
        }, {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: string | null;
            firstConnectedAt: string | null;
            lastConnectedNodeUuid: string | null;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
        shortUuid: string;
        username: string;
        trafficLimitBytes: number;
        description: string | null;
        trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
        expireAt: Date;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        lastTriggeredThreshold: number;
        subRevokedAt: Date | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: Date | null;
        lastTrafficResetAt: Date | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: Date | null;
            firstConnectedAt: Date | null;
            lastConnectedNodeUuid: string | null;
        };
    }, {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: string;
        updatedAt: string;
        shortUuid: string;
        username: string;
        description: string | null;
        expireAt: string;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        subRevokedAt: string | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: string | null;
        lastTrafficResetAt: string | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: string | null;
            firstConnectedAt: string | null;
            lastConnectedNodeUuid: string | null;
        };
        status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
        trafficLimitBytes?: number | undefined;
        trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
        lastTriggeredThreshold?: number | undefined;
    }>;
    meta: z.ZodNullable<z.ZodObject<{
        notConnectedAfterHours: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        notConnectedAfterHours?: number | null | undefined;
    }, {
        notConnectedAfterHours?: number | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    scope: "user";
    event: "user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected";
    timestamp: Date;
    data: {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
        shortUuid: string;
        username: string;
        trafficLimitBytes: number;
        description: string | null;
        trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
        expireAt: Date;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        lastTriggeredThreshold: number;
        subRevokedAt: Date | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: Date | null;
        lastTrafficResetAt: Date | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: Date | null;
            firstConnectedAt: Date | null;
            lastConnectedNodeUuid: string | null;
        };
    };
    meta: {
        notConnectedAfterHours?: number | null | undefined;
    } | null;
}, {
    scope: "user";
    event: "user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected";
    timestamp: string;
    data: {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: string;
        updatedAt: string;
        shortUuid: string;
        username: string;
        description: string | null;
        expireAt: string;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        subRevokedAt: string | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: string | null;
        lastTrafficResetAt: string | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: string | null;
            firstConnectedAt: string | null;
            lastConnectedNodeUuid: string | null;
        };
        status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
        trafficLimitBytes?: number | undefined;
        trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
        lastTriggeredThreshold?: number | undefined;
    };
    meta: {
        notConnectedAfterHours?: number | null | undefined;
    } | null;
}>;
export declare const RemnawaveWebhookUserHwidDevicesEvents: z.ZodObject<{
    scope: z.ZodLiteral<"user_hwid_devices">;
    event: z.ZodEnum<["user_hwid_devices.added" | "user_hwid_devices.deleted", ...("user_hwid_devices.added" | "user_hwid_devices.deleted")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        user: z.ZodObject<{
            uuid: z.ZodString;
            id: z.ZodNumber;
            shortUuid: z.ZodString;
            username: z.ZodString;
            status: z.ZodDefault<z.ZodNativeEnum<{
                readonly ACTIVE: "ACTIVE";
                readonly DISABLED: "DISABLED";
                readonly LIMITED: "LIMITED";
                readonly EXPIRED: "EXPIRED";
            }>>;
            trafficLimitBytes: z.ZodDefault<z.ZodNumber>;
            trafficLimitStrategy: z.ZodDefault<z.ZodNativeEnum<{
                readonly NO_RESET: "NO_RESET";
                readonly DAY: "DAY";
                readonly WEEK: "WEEK";
                readonly MONTH: "MONTH";
            }>>;
            expireAt: z.ZodEffects<z.ZodString, Date, string>;
            telegramId: z.ZodNullable<z.ZodNumber>;
            email: z.ZodNullable<z.ZodString>;
            description: z.ZodNullable<z.ZodString>;
            tag: z.ZodNullable<z.ZodString>;
            hwidDeviceLimit: z.ZodNullable<z.ZodNumber>;
            externalSquadUuid: z.ZodNullable<z.ZodString>;
            trojanPassword: z.ZodString;
            vlessUuid: z.ZodString;
            ssPassword: z.ZodString;
            lastTriggeredThreshold: z.ZodDefault<z.ZodNumber>;
            subRevokedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            subLastUserAgent: z.ZodNullable<z.ZodString>;
            subLastOpenedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            lastTrafficResetAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            createdAt: z.ZodEffects<z.ZodString, Date, string>;
            updatedAt: z.ZodEffects<z.ZodString, Date, string>;
        } & {
            subscriptionUrl: z.ZodString;
            activeInternalSquads: z.ZodArray<z.ZodObject<{
                uuid: z.ZodString;
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                uuid: string;
            }, {
                name: string;
                uuid: string;
            }>, "many">;
            userTraffic: z.ZodObject<{
                usedTrafficBytes: z.ZodNumber;
                lifetimeUsedTrafficBytes: z.ZodNumber;
                onlineAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
                firstConnectedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
                lastConnectedNodeUuid: z.ZodNullable<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            }, {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            }>;
        }, "strip", z.ZodTypeAny, {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
            shortUuid: string;
            username: string;
            trafficLimitBytes: number;
            description: string | null;
            trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
            expireAt: Date;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            lastTriggeredThreshold: number;
            subRevokedAt: Date | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: Date | null;
            lastTrafficResetAt: Date | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            };
        }, {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: string;
            updatedAt: string;
            shortUuid: string;
            username: string;
            description: string | null;
            expireAt: string;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            subRevokedAt: string | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: string | null;
            lastTrafficResetAt: string | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            };
            status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
            trafficLimitBytes?: number | undefined;
            trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
            lastTriggeredThreshold?: number | undefined;
        }>;
        hwidUserDevice: z.ZodObject<{
            hwid: z.ZodString;
            userUuid: z.ZodString;
            platform: z.ZodNullable<z.ZodString>;
            osVersion: z.ZodNullable<z.ZodString>;
            deviceModel: z.ZodNullable<z.ZodString>;
            userAgent: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodEffects<z.ZodString, Date, string>;
            updatedAt: z.ZodEffects<z.ZodString, Date, string>;
        }, "strip", z.ZodTypeAny, {
            createdAt: Date;
            updatedAt: Date;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        }, {
            createdAt: string;
            updatedAt: string;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        }>;
    }, "strip", z.ZodTypeAny, {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
            shortUuid: string;
            username: string;
            trafficLimitBytes: number;
            description: string | null;
            trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
            expireAt: Date;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            lastTriggeredThreshold: number;
            subRevokedAt: Date | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: Date | null;
            lastTrafficResetAt: Date | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            };
        };
        hwidUserDevice: {
            createdAt: Date;
            updatedAt: Date;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    }, {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: string;
            updatedAt: string;
            shortUuid: string;
            username: string;
            description: string | null;
            expireAt: string;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            subRevokedAt: string | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: string | null;
            lastTrafficResetAt: string | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            };
            status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
            trafficLimitBytes?: number | undefined;
            trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
            lastTriggeredThreshold?: number | undefined;
        };
        hwidUserDevice: {
            createdAt: string;
            updatedAt: string;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "user_hwid_devices";
    event: "user_hwid_devices.added" | "user_hwid_devices.deleted";
    timestamp: Date;
    data: {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
            shortUuid: string;
            username: string;
            trafficLimitBytes: number;
            description: string | null;
            trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
            expireAt: Date;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            lastTriggeredThreshold: number;
            subRevokedAt: Date | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: Date | null;
            lastTrafficResetAt: Date | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            };
        };
        hwidUserDevice: {
            createdAt: Date;
            updatedAt: Date;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    };
}, {
    scope: "user_hwid_devices";
    event: "user_hwid_devices.added" | "user_hwid_devices.deleted";
    timestamp: string;
    data: {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: string;
            updatedAt: string;
            shortUuid: string;
            username: string;
            description: string | null;
            expireAt: string;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            subRevokedAt: string | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: string | null;
            lastTrafficResetAt: string | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            };
            status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
            trafficLimitBytes?: number | undefined;
            trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
            lastTriggeredThreshold?: number | undefined;
        };
        hwidUserDevice: {
            createdAt: string;
            updatedAt: string;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    };
}>;
export declare const RemnawaveWebhookNodeEvents: z.ZodObject<{
    scope: z.ZodLiteral<"node">;
    event: z.ZodEnum<["node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify", ...("node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    scope: "node";
    event: "node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify";
    timestamp: Date;
    data: {
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
    };
}, {
    scope: "node";
    event: "node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify";
    timestamp: string;
    data: {
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
    };
}>;
export declare const RemnawaveWebhookServiceEvents: z.ZodObject<{
    scope: z.ZodLiteral<"service">;
    event: z.ZodEnum<["service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed", ...("service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        loginAttempt: z.ZodOptional<z.ZodObject<{
            username: z.ZodString;
            ip: z.ZodString;
            userAgent: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            password: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        }, {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        }>>;
        panelVersion: z.ZodOptional<z.ZodString>;
        subpageConfig: z.ZodOptional<z.ZodObject<{
            action: z.ZodEnum<["CREATED" | "UPDATED" | "DELETED", ...("CREATED" | "UPDATED" | "DELETED")[]]>;
            uuid: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        }, {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        }>>;
    }, "strip", z.ZodTypeAny, {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    }, {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "service";
    event: "service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed";
    timestamp: Date;
    data: {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    };
}, {
    scope: "service";
    event: "service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed";
    timestamp: string;
    data: {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    };
}>;
export declare const RemnawaveWebhookErrorsEvents: z.ZodObject<{
    scope: z.ZodLiteral<"errors">;
    event: z.ZodEnum<["errors.bandwidth_usage_threshold_reached_max_notifications", ..."errors.bandwidth_usage_threshold_reached_max_notifications"[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
    }, {
        description: string;
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "errors";
    event: "errors.bandwidth_usage_threshold_reached_max_notifications";
    timestamp: Date;
    data: {
        description: string;
    };
}, {
    scope: "errors";
    event: "errors.bandwidth_usage_threshold_reached_max_notifications";
    timestamp: string;
    data: {
        description: string;
    };
}>;
export declare const RemnawaveWebhookCrmEvents: z.ZodObject<{
    scope: z.ZodLiteral<"crm">;
    event: z.ZodEnum<["crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days", ...("crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        providerName: z.ZodString;
        nodeName: z.ZodString;
        nextBillingAt: z.ZodEffects<z.ZodString, Date, string>;
        loginUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        loginUrl: string;
        nextBillingAt: Date;
        nodeName: string;
        providerName: string;
    }, {
        loginUrl: string;
        nextBillingAt: string;
        nodeName: string;
        providerName: string;
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "crm";
    event: "crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days";
    timestamp: Date;
    data: {
        loginUrl: string;
        nextBillingAt: Date;
        nodeName: string;
        providerName: string;
    };
}, {
    scope: "crm";
    event: "crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days";
    timestamp: string;
    data: {
        loginUrl: string;
        nextBillingAt: string;
        nodeName: string;
        providerName: string;
    };
}>;
export declare const RemnawaveWebhookEventSchema: z.ZodDiscriminatedUnion<"scope", [z.ZodObject<{
    scope: z.ZodLiteral<"user">;
    event: z.ZodEnum<["user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected", ...("user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        uuid: z.ZodString;
        id: z.ZodNumber;
        shortUuid: z.ZodString;
        username: z.ZodString;
        status: z.ZodDefault<z.ZodNativeEnum<{
            readonly ACTIVE: "ACTIVE";
            readonly DISABLED: "DISABLED";
            readonly LIMITED: "LIMITED";
            readonly EXPIRED: "EXPIRED";
        }>>;
        trafficLimitBytes: z.ZodDefault<z.ZodNumber>;
        trafficLimitStrategy: z.ZodDefault<z.ZodNativeEnum<{
            readonly NO_RESET: "NO_RESET";
            readonly DAY: "DAY";
            readonly WEEK: "WEEK";
            readonly MONTH: "MONTH";
        }>>;
        expireAt: z.ZodEffects<z.ZodString, Date, string>;
        telegramId: z.ZodNullable<z.ZodNumber>;
        email: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        tag: z.ZodNullable<z.ZodString>;
        hwidDeviceLimit: z.ZodNullable<z.ZodNumber>;
        externalSquadUuid: z.ZodNullable<z.ZodString>;
        trojanPassword: z.ZodString;
        vlessUuid: z.ZodString;
        ssPassword: z.ZodString;
        lastTriggeredThreshold: z.ZodDefault<z.ZodNumber>;
        subRevokedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        subLastUserAgent: z.ZodNullable<z.ZodString>;
        subLastOpenedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        lastTrafficResetAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
        createdAt: z.ZodEffects<z.ZodString, Date, string>;
        updatedAt: z.ZodEffects<z.ZodString, Date, string>;
    } & {
        subscriptionUrl: z.ZodString;
        activeInternalSquads: z.ZodArray<z.ZodObject<{
            uuid: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            uuid: string;
        }, {
            name: string;
            uuid: string;
        }>, "many">;
        userTraffic: z.ZodObject<{
            usedTrafficBytes: z.ZodNumber;
            lifetimeUsedTrafficBytes: z.ZodNumber;
            onlineAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            firstConnectedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            lastConnectedNodeUuid: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: Date | null;
            firstConnectedAt: Date | null;
            lastConnectedNodeUuid: string | null;
        }, {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: string | null;
            firstConnectedAt: string | null;
            lastConnectedNodeUuid: string | null;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
        shortUuid: string;
        username: string;
        trafficLimitBytes: number;
        description: string | null;
        trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
        expireAt: Date;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        lastTriggeredThreshold: number;
        subRevokedAt: Date | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: Date | null;
        lastTrafficResetAt: Date | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: Date | null;
            firstConnectedAt: Date | null;
            lastConnectedNodeUuid: string | null;
        };
    }, {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: string;
        updatedAt: string;
        shortUuid: string;
        username: string;
        description: string | null;
        expireAt: string;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        subRevokedAt: string | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: string | null;
        lastTrafficResetAt: string | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: string | null;
            firstConnectedAt: string | null;
            lastConnectedNodeUuid: string | null;
        };
        status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
        trafficLimitBytes?: number | undefined;
        trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
        lastTriggeredThreshold?: number | undefined;
    }>;
    meta: z.ZodNullable<z.ZodObject<{
        notConnectedAfterHours: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        notConnectedAfterHours?: number | null | undefined;
    }, {
        notConnectedAfterHours?: number | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    scope: "user";
    event: "user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected";
    timestamp: Date;
    data: {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
        shortUuid: string;
        username: string;
        trafficLimitBytes: number;
        description: string | null;
        trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
        expireAt: Date;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        lastTriggeredThreshold: number;
        subRevokedAt: Date | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: Date | null;
        lastTrafficResetAt: Date | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: Date | null;
            firstConnectedAt: Date | null;
            lastConnectedNodeUuid: string | null;
        };
    };
    meta: {
        notConnectedAfterHours?: number | null | undefined;
    } | null;
}, {
    scope: "user";
    event: "user.created" | "user.modified" | "user.deleted" | "user.revoked" | "user.disabled" | "user.enabled" | "user.limited" | "user.expired" | "user.traffic_reset" | "user.expires_in_72_hours" | "user.expires_in_48_hours" | "user.expires_in_24_hours" | "user.expired_24_hours_ago" | "user.first_connected" | "user.bandwidth_usage_threshold_reached" | "user.not_connected";
    timestamp: string;
    data: {
        id: number;
        uuid: string;
        tag: string | null;
        createdAt: string;
        updatedAt: string;
        shortUuid: string;
        username: string;
        description: string | null;
        expireAt: string;
        telegramId: number | null;
        email: string | null;
        hwidDeviceLimit: number | null;
        externalSquadUuid: string | null;
        trojanPassword: string;
        vlessUuid: string;
        ssPassword: string;
        subRevokedAt: string | null;
        subLastUserAgent: string | null;
        subLastOpenedAt: string | null;
        lastTrafficResetAt: string | null;
        subscriptionUrl: string;
        activeInternalSquads: {
            name: string;
            uuid: string;
        }[];
        userTraffic: {
            usedTrafficBytes: number;
            lifetimeUsedTrafficBytes: number;
            onlineAt: string | null;
            firstConnectedAt: string | null;
            lastConnectedNodeUuid: string | null;
        };
        status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
        trafficLimitBytes?: number | undefined;
        trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
        lastTriggeredThreshold?: number | undefined;
    };
    meta: {
        notConnectedAfterHours?: number | null | undefined;
    } | null;
}>, z.ZodObject<{
    scope: z.ZodLiteral<"user_hwid_devices">;
    event: z.ZodEnum<["user_hwid_devices.added" | "user_hwid_devices.deleted", ...("user_hwid_devices.added" | "user_hwid_devices.deleted")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        user: z.ZodObject<{
            uuid: z.ZodString;
            id: z.ZodNumber;
            shortUuid: z.ZodString;
            username: z.ZodString;
            status: z.ZodDefault<z.ZodNativeEnum<{
                readonly ACTIVE: "ACTIVE";
                readonly DISABLED: "DISABLED";
                readonly LIMITED: "LIMITED";
                readonly EXPIRED: "EXPIRED";
            }>>;
            trafficLimitBytes: z.ZodDefault<z.ZodNumber>;
            trafficLimitStrategy: z.ZodDefault<z.ZodNativeEnum<{
                readonly NO_RESET: "NO_RESET";
                readonly DAY: "DAY";
                readonly WEEK: "WEEK";
                readonly MONTH: "MONTH";
            }>>;
            expireAt: z.ZodEffects<z.ZodString, Date, string>;
            telegramId: z.ZodNullable<z.ZodNumber>;
            email: z.ZodNullable<z.ZodString>;
            description: z.ZodNullable<z.ZodString>;
            tag: z.ZodNullable<z.ZodString>;
            hwidDeviceLimit: z.ZodNullable<z.ZodNumber>;
            externalSquadUuid: z.ZodNullable<z.ZodString>;
            trojanPassword: z.ZodString;
            vlessUuid: z.ZodString;
            ssPassword: z.ZodString;
            lastTriggeredThreshold: z.ZodDefault<z.ZodNumber>;
            subRevokedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            subLastUserAgent: z.ZodNullable<z.ZodString>;
            subLastOpenedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            lastTrafficResetAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
            createdAt: z.ZodEffects<z.ZodString, Date, string>;
            updatedAt: z.ZodEffects<z.ZodString, Date, string>;
        } & {
            subscriptionUrl: z.ZodString;
            activeInternalSquads: z.ZodArray<z.ZodObject<{
                uuid: z.ZodString;
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                uuid: string;
            }, {
                name: string;
                uuid: string;
            }>, "many">;
            userTraffic: z.ZodObject<{
                usedTrafficBytes: z.ZodNumber;
                lifetimeUsedTrafficBytes: z.ZodNumber;
                onlineAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
                firstConnectedAt: z.ZodNullable<z.ZodEffects<z.ZodString, Date, string>>;
                lastConnectedNodeUuid: z.ZodNullable<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            }, {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            }>;
        }, "strip", z.ZodTypeAny, {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
            shortUuid: string;
            username: string;
            trafficLimitBytes: number;
            description: string | null;
            trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
            expireAt: Date;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            lastTriggeredThreshold: number;
            subRevokedAt: Date | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: Date | null;
            lastTrafficResetAt: Date | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            };
        }, {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: string;
            updatedAt: string;
            shortUuid: string;
            username: string;
            description: string | null;
            expireAt: string;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            subRevokedAt: string | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: string | null;
            lastTrafficResetAt: string | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            };
            status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
            trafficLimitBytes?: number | undefined;
            trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
            lastTriggeredThreshold?: number | undefined;
        }>;
        hwidUserDevice: z.ZodObject<{
            hwid: z.ZodString;
            userUuid: z.ZodString;
            platform: z.ZodNullable<z.ZodString>;
            osVersion: z.ZodNullable<z.ZodString>;
            deviceModel: z.ZodNullable<z.ZodString>;
            userAgent: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodEffects<z.ZodString, Date, string>;
            updatedAt: z.ZodEffects<z.ZodString, Date, string>;
        }, "strip", z.ZodTypeAny, {
            createdAt: Date;
            updatedAt: Date;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        }, {
            createdAt: string;
            updatedAt: string;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        }>;
    }, "strip", z.ZodTypeAny, {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
            shortUuid: string;
            username: string;
            trafficLimitBytes: number;
            description: string | null;
            trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
            expireAt: Date;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            lastTriggeredThreshold: number;
            subRevokedAt: Date | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: Date | null;
            lastTrafficResetAt: Date | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            };
        };
        hwidUserDevice: {
            createdAt: Date;
            updatedAt: Date;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    }, {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: string;
            updatedAt: string;
            shortUuid: string;
            username: string;
            description: string | null;
            expireAt: string;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            subRevokedAt: string | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: string | null;
            lastTrafficResetAt: string | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            };
            status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
            trafficLimitBytes?: number | undefined;
            trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
            lastTriggeredThreshold?: number | undefined;
        };
        hwidUserDevice: {
            createdAt: string;
            updatedAt: string;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "user_hwid_devices";
    event: "user_hwid_devices.added" | "user_hwid_devices.deleted";
    timestamp: Date;
    data: {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE";
            shortUuid: string;
            username: string;
            trafficLimitBytes: number;
            description: string | null;
            trafficLimitStrategy: "MONTH" | "NO_RESET" | "DAY" | "WEEK";
            expireAt: Date;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            lastTriggeredThreshold: number;
            subRevokedAt: Date | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: Date | null;
            lastTrafficResetAt: Date | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: Date | null;
                firstConnectedAt: Date | null;
                lastConnectedNodeUuid: string | null;
            };
        };
        hwidUserDevice: {
            createdAt: Date;
            updatedAt: Date;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    };
}, {
    scope: "user_hwid_devices";
    event: "user_hwid_devices.added" | "user_hwid_devices.deleted";
    timestamp: string;
    data: {
        user: {
            id: number;
            uuid: string;
            tag: string | null;
            createdAt: string;
            updatedAt: string;
            shortUuid: string;
            username: string;
            description: string | null;
            expireAt: string;
            telegramId: number | null;
            email: string | null;
            hwidDeviceLimit: number | null;
            externalSquadUuid: string | null;
            trojanPassword: string;
            vlessUuid: string;
            ssPassword: string;
            subRevokedAt: string | null;
            subLastUserAgent: string | null;
            subLastOpenedAt: string | null;
            lastTrafficResetAt: string | null;
            subscriptionUrl: string;
            activeInternalSquads: {
                name: string;
                uuid: string;
            }[];
            userTraffic: {
                usedTrafficBytes: number;
                lifetimeUsedTrafficBytes: number;
                onlineAt: string | null;
                firstConnectedAt: string | null;
                lastConnectedNodeUuid: string | null;
            };
            status?: "DISABLED" | "LIMITED" | "EXPIRED" | "ACTIVE" | undefined;
            trafficLimitBytes?: number | undefined;
            trafficLimitStrategy?: "MONTH" | "NO_RESET" | "DAY" | "WEEK" | undefined;
            lastTriggeredThreshold?: number | undefined;
        };
        hwidUserDevice: {
            createdAt: string;
            updatedAt: string;
            hwid: string;
            userUuid: string;
            platform: string | null;
            osVersion: string | null;
            deviceModel: string | null;
            userAgent: string | null;
        };
    };
}>, z.ZodObject<{
    scope: z.ZodLiteral<"node">;
    event: z.ZodEnum<["node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify", ...("node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    scope: "node";
    event: "node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify";
    timestamp: Date;
    data: {
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
    };
}, {
    scope: "node";
    event: "node.created" | "node.modified" | "node.disabled" | "node.enabled" | "node.deleted" | "node.connection_lost" | "node.connection_restored" | "node.traffic_notify";
    timestamp: string;
    data: {
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
    };
}>, z.ZodObject<{
    scope: z.ZodLiteral<"service">;
    event: z.ZodEnum<["service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed", ...("service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        loginAttempt: z.ZodOptional<z.ZodObject<{
            username: z.ZodString;
            ip: z.ZodString;
            userAgent: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            password: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        }, {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        }>>;
        panelVersion: z.ZodOptional<z.ZodString>;
        subpageConfig: z.ZodOptional<z.ZodObject<{
            action: z.ZodEnum<["CREATED" | "UPDATED" | "DELETED", ...("CREATED" | "UPDATED" | "DELETED")[]]>;
            uuid: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        }, {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        }>>;
    }, "strip", z.ZodTypeAny, {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    }, {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "service";
    event: "service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed";
    timestamp: Date;
    data: {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    };
}, {
    scope: "service";
    event: "service.panel_started" | "service.login_attempt_failed" | "service.login_attempt_success" | "service.subpage_config_changed";
    timestamp: string;
    data: {
        loginAttempt?: {
            username: string;
            ip: string;
            userAgent: string;
            password?: string | undefined;
            description?: string | undefined;
        } | undefined;
        panelVersion?: string | undefined;
        subpageConfig?: {
            uuid: string;
            action: "CREATED" | "UPDATED" | "DELETED";
        } | undefined;
    };
}>, z.ZodObject<{
    scope: z.ZodLiteral<"errors">;
    event: z.ZodEnum<["errors.bandwidth_usage_threshold_reached_max_notifications", ..."errors.bandwidth_usage_threshold_reached_max_notifications"[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
    }, {
        description: string;
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "errors";
    event: "errors.bandwidth_usage_threshold_reached_max_notifications";
    timestamp: Date;
    data: {
        description: string;
    };
}, {
    scope: "errors";
    event: "errors.bandwidth_usage_threshold_reached_max_notifications";
    timestamp: string;
    data: {
        description: string;
    };
}>, z.ZodObject<{
    scope: z.ZodLiteral<"crm">;
    event: z.ZodEnum<["crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days", ...("crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days")[]]>;
    timestamp: z.ZodEffects<z.ZodString, Date, string>;
    data: z.ZodObject<{
        providerName: z.ZodString;
        nodeName: z.ZodString;
        nextBillingAt: z.ZodEffects<z.ZodString, Date, string>;
        loginUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        loginUrl: string;
        nextBillingAt: Date;
        nodeName: string;
        providerName: string;
    }, {
        loginUrl: string;
        nextBillingAt: string;
        nodeName: string;
        providerName: string;
    }>;
}, "strip", z.ZodTypeAny, {
    scope: "crm";
    event: "crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days";
    timestamp: Date;
    data: {
        loginUrl: string;
        nextBillingAt: Date;
        nodeName: string;
        providerName: string;
    };
}, {
    scope: "crm";
    event: "crm.infra_billing_node_payment_in_7_days" | "crm.infra_billing_node_payment_in_48hrs" | "crm.infra_billing_node_payment_in_24hrs" | "crm.infra_billing_node_payment_due_today" | "crm.infra_billing_node_payment_overdue_24hrs" | "crm.infra_billing_node_payment_overdue_48hrs" | "crm.infra_billing_node_payment_overdue_7_days";
    timestamp: string;
    data: {
        loginUrl: string;
        nextBillingAt: string;
        nodeName: string;
        providerName: string;
    };
}>]>;
export type TRemnawaveWebhookEvent = z.infer<typeof RemnawaveWebhookEventSchema>;
export type TRemnawaveWebhookUserEvent = z.infer<typeof RemnawaveWebhookUserEvents>;
export type TRemnawaveWebhookNodeEvent = z.infer<typeof RemnawaveWebhookNodeEvents>;
export type TRemnawaveWebhookServiceEvent = z.infer<typeof RemnawaveWebhookServiceEvents>;
export type TRemnawaveWebhookErrorsEvent = z.infer<typeof RemnawaveWebhookErrorsEvents>;
export type TRemnawaveWebhookCrmEvent = z.infer<typeof RemnawaveWebhookCrmEvents>;
export type TRemnawaveWebhookUserHwidDevicesEvent = z.infer<typeof RemnawaveWebhookUserHwidDevicesEvents>;
