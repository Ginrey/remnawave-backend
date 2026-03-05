"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigProfileInboundEntity = void 0;
class ConfigProfileInboundEntity {
    uuid;
    profileUuid;
    tag;
    type;
    network;
    security;
    port;
    rawInbound;
    constructor(configProfileInbound) {
        Object.assign(this, configProfileInbound);
        return this;
    }
}
exports.ConfigProfileInboundEntity = ConfigProfileInboundEntity;
//# sourceMappingURL=config-profile-inbound.entity.js.map