import {
    TBrandingSettings,
    TOauth2Settings,
    TPasswordAuthSettings,
    TRemnawavePasskeySettings,
<<<<<<< HEAD
    TTgAuthSettings,
=======
>>>>>>> upstream/main
} from '@libs/contracts/models';

import { RemnawaveSettingsEntity } from '../entities';

export class RemnawaveSettingsResponseModel {
    public passkeySettings: TRemnawavePasskeySettings;
    public oauth2Settings: TOauth2Settings;
<<<<<<< HEAD
    public tgAuthSettings: TTgAuthSettings;
=======
>>>>>>> upstream/main
    public passwordSettings: TPasswordAuthSettings;
    public brandingSettings: TBrandingSettings;

    constructor(entity: RemnawaveSettingsEntity) {
        this.passkeySettings = entity.passkeySettings;
        this.oauth2Settings = entity.oauth2Settings;
<<<<<<< HEAD
        this.tgAuthSettings = entity.tgAuthSettings;
=======
>>>>>>> upstream/main
        this.passwordSettings = entity.passwordSettings;
        this.brandingSettings = entity.brandingSettings;
    }
}
