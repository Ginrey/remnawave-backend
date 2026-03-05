import { ConfigProfiles } from '@prisma/client';
export declare class ConfigProfileEntity implements ConfigProfiles {
    uuid: string;
    viewPosition: number;
    name: string;
    config: object;
    createdAt: Date;
    updatedAt: Date;
    constructor(configProfile: Partial<ConfigProfiles>);
}
