"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemnawaveSettingsEntity = void 0;
class RemnawaveSettingsEntity {
    id;
    passkeySettings;
    oauth2Settings;
    tgAuthSettings;
    passwordSettings;
    brandingSettings;
    constructor(remnawaveSettings) {
        Object.assign(this, remnawaveSettings);
        return this;
    }
}
exports.RemnawaveSettingsEntity = RemnawaveSettingsEntity;
//# sourceMappingURL=remnawave-settings.entity.js.map