import { RemnawaveSettings } from '@prisma/client';
import { TBrandingSettings, TOauth2Settings, TPasswordAuthSettings, TRemnawavePasskeySettings, TTgAuthSettings } from '@libs/contracts/models';
export declare class RemnawaveSettingsEntity implements RemnawaveSettings {
    id: number;
    passkeySettings: TRemnawavePasskeySettings;
    oauth2Settings: TOauth2Settings;
    tgAuthSettings: TTgAuthSettings;
    passwordSettings: TPasswordAuthSettings;
    brandingSettings: TBrandingSettings;
    constructor(remnawaveSettings: Partial<RemnawaveSettings>);
}
