import { z } from 'zod';

export const ImportSourceBalancerStrategySchema = z.enum(['random', 'leastPing', 'leastLoad']);
export const ImportSourcesInactiveUserFallbackModeSchema = z.enum(['customRemarks', 'empty']);
export const ImportSourcesClientPresetSchema = z.enum(['happSafe', 'advanced']);
export const ImportSourcesAutoFallbackPolicySchema = z.enum(['first', 'stableHash']);
export const ImportSourcesDomainStrategySchema = z.enum(['AsIs', 'IPIfNonMatch', 'IPOnDemand']);
export const ImportSourcesGroupSelectionModeSchema = z.enum(['stickyHealth', 'all']);

export const ImportSourcesXrayJsonSettingsSchema = z.object({
    autoStrategy: ImportSourceBalancerStrategySchema,
    manualStrategy: ImportSourceBalancerStrategySchema,
    autoProbeUrl: z.string().min(1).max(512),
    autoProbeInterval: z.string().min(1).max(32),
    autoSortEnabled: z.boolean(),
    inactiveUserFallbackMode: ImportSourcesInactiveUserFallbackModeSchema,
    clientPreset: ImportSourcesClientPresetSchema,
    autoIncludeLte: z.boolean(),
    autoExcludedCountryCodes: z.array(z.string().regex(/^[A-Za-z]{2}$/)).max(64),
    autoFallbackPolicy: ImportSourcesAutoFallbackPolicySchema,
    observatoryEnableConcurrency: z.boolean(),
    routingDomainStrategy: ImportSourcesDomainStrategySchema.nullable(),
    directPrivateNetworks: z.boolean(),
    blockBitTorrent: z.boolean(),
    importGroupSelectionMode: ImportSourcesGroupSelectionModeSchema,
});

export const ImportSourcesSettingsSchema = z.object({
    xrayJson: ImportSourcesXrayJsonSettingsSchema,
});

export type TImportSourceBalancerStrategy = z.infer<typeof ImportSourceBalancerStrategySchema>;
export type TImportSourcesSettings = z.infer<typeof ImportSourcesSettingsSchema>;
export type TImportSourcesXrayJsonSettings = z.infer<typeof ImportSourcesXrayJsonSettingsSchema>;

export const DEFAULT_IMPORT_SOURCES_SETTINGS: TImportSourcesSettings = {
    xrayJson: {
        autoStrategy: 'random',
        manualStrategy: 'random',
        autoProbeUrl: 'http://www.gstatic.com/generate_204',
        autoProbeInterval: '2m',
        autoSortEnabled: true,
        inactiveUserFallbackMode: 'customRemarks',
        clientPreset: 'happSafe',
        autoIncludeLte: true,
        autoExcludedCountryCodes: ['RU'],
        autoFallbackPolicy: 'first',
        observatoryEnableConcurrency: true,
        routingDomainStrategy: null,
        directPrivateNetworks: false,
        blockBitTorrent: false,
        importGroupSelectionMode: 'stickyHealth',
    },
};

const PartialImportSourcesSettingsSchema = z.object({
    xrayJson: ImportSourcesXrayJsonSettingsSchema.partial().optional(),
});

export function resolveImportSourcesSettings(value: unknown): TImportSourcesSettings {
    const parsed = PartialImportSourcesSettingsSchema.safeParse(value);

    if (!parsed.success) {
        return DEFAULT_IMPORT_SOURCES_SETTINGS;
    }

    return {
        xrayJson: {
            ...DEFAULT_IMPORT_SOURCES_SETTINGS.xrayJson,
            ...(parsed.data.xrayJson ?? {}),
        },
    };
}
