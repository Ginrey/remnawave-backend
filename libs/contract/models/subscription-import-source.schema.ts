import { z } from 'zod';

export const IMPORT_FETCH_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
} as const;

export type TImportFetchStatus = (typeof IMPORT_FETCH_STATUS)[keyof typeof IMPORT_FETCH_STATUS];

export const SubscriptionImportSourceSchema = z.object({
    uuid: z.string().uuid(),
    name: z.string(),
    url: z.string().url(),
    isEnabled: z.boolean(),
    fetchIntervalMinutes: z.number().int().min(5).max(1440),
    configProfileInboundUuid: z.string().uuid().nullable(),
    lastFetchedAt: z
        .string()
        .datetime()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    lastFetchStatus: z.nativeEnum(IMPORT_FETCH_STATUS).nullable(),
    lastFetchError: z.string().nullable(),
    lastHostsCount: z.number().int().nullable(),
    importGroup: z.string().nullable(),
    fetchHeaders: z.record(z.string()).nullable(),
    createdAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    updatedAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
});

export type TSubscriptionImportSource = z.infer<typeof SubscriptionImportSourceSchema>;
