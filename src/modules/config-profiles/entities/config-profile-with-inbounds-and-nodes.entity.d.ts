import { JsonArray, JsonObject } from '@prisma/client/runtime/library';
import { ConfigProfiles } from '@prisma/client';
import { ConfigProfileInboundEntity } from './config-profile-inbound.entity';
export declare class ConfigProfileWithInboundsAndNodesEntity implements ConfigProfiles {
    uuid: string;
    viewPosition: number;
    name: string;
    config: string | number | boolean | JsonObject | JsonArray | null | object;
    inbounds: ConfigProfileInboundEntity[];
    nodes: {
        uuid: string;
        name: string;
        countryCode: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    constructor(configProfileWithInboundsAndNodes: Partial<ConfigProfileWithInboundsAndNodesEntity>);
}
