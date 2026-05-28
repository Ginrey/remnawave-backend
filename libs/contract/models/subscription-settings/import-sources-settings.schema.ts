import { z } from 'zod';

export const ImportSourceBalancerStrategySchema = z.enum(['random', 'leastPing', 'leastLoad']);
export const ImportSourcesInactiveUserFallbackModeSchema = z.enum(['customRemarks', 'empty']);

export const ImportSourcesXrayJsonSettingsSchema = z.object({
    autoStrategy: ImportSourceBalancerStrategySchema,
    manualStrategy: ImportSourceBalancerStrategySchema,
    autoProbeUrl: z.string().min(1).max(512),
    autoProbeInterval: z.string().min(1).max(32),
    autoSortEnabled: z.boolean(),
    inactiveUserFallbackMode: ImportSourcesInactiveUserFallbackModeSchema,
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
