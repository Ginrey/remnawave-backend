"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionImportSourceSchema = exports.IMPORT_FETCH_STATUS = void 0;
const zod_1 = require("zod");
exports.IMPORT_FETCH_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};
exports.SubscriptionImportSourceSchema = zod_1.z.object({
    uuid: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    url: zod_1.z.string().url(),
    isEnabled: zod_1.z.boolean(),
    fetchIntervalMinutes: zod_1.z.number().int().min(5).max(1440),
    configProfileInboundUuid: zod_1.z.string().uuid().nullable(),
    lastFetchedAt: zod_1.z
        .string()
        .datetime()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    lastFetchStatus: zod_1.z.nativeEnum(exports.IMPORT_FETCH_STATUS).nullable(),
    lastFetchError: zod_1.z.string().nullable(),
    lastHostsCount: zod_1.z.number().int().nullable(),
    createdAt: zod_1.z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    updatedAt: zod_1.z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
});
//# sourceMappingURL=subscription-import-source.schema.js.map