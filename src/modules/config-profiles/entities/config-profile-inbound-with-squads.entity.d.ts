import { ConfigProfileInboundEntity } from './config-profile-inbound.entity';
export declare class ConfigProfileInboundWithSquadsEntity extends ConfigProfileInboundEntity {
    activeSquads: string[];
    constructor(configProfileInbound: {
        activeSquads: {
            uuid: string;
        }[];
    } & Partial<ConfigProfileInboundEntity>);
}
