"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigProfileEntity = void 0;
class ConfigProfileEntity {
    uuid;
    viewPosition;
    name;
    config;
    createdAt;
    updatedAt;
    constructor(configProfile) {
        Object.assign(this, configProfile);
        return this;
    }
}
exports.ConfigProfileEntity = ConfigProfileEntity;
//# sourceMappingURL=config-profile.entity.js.map