import { ConfigProfileInbounds } from '@prisma/client';
export declare class ConfigProfileInboundEntity implements ConfigProfileInbounds {
    uuid: string;
    profileUuid: string;
    tag: string;
    type: string;
    network: string | null;
    security: string | null;
    port: number | null;
    rawInbound: object | null;
    constructor(configProfileInbound: Partial<ConfigProfileInbounds>);
}
