"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigProfileInboundWithSquadsEntity = void 0;
const config_profile_inbound_entity_1 = require("./config-profile-inbound.entity");
class ConfigProfileInboundWithSquadsEntity extends config_profile_inbound_entity_1.ConfigProfileInboundEntity {
    activeSquads;
    constructor(configProfileInbound) {
        super(configProfileInbound);
        this.activeSquads = configProfileInbound.activeSquads.map((squad) => squad.uuid);
        return this;
    }
}
exports.ConfigProfileInboundWithSquadsEntity = ConfigProfileInboundWithSquadsEntity;
//# sourceMappingURL=config-profile-inbound-with-squads.entity.js.map