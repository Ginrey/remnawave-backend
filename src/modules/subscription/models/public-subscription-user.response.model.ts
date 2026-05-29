import { TResetPeriods, TUsersStatus } from '@libs/contracts/constants';

import { UserEntity } from '@modules/users/entities/user.entity';

export class PublicSubscriptionUserResponseModel {
    public readonly shortUuid: string;
    public readonly username: string;
    public readonly status: TUsersStatus;
    public readonly trafficLimitBytes: number;
    public readonly trafficLimitStrategy: TResetPeriods;
    public readonly expireAt: Date;
    public readonly telegramId: number | null;
    public readonly email: string | null;
    public readonly description: null | string;
    public readonly tag: null | string;
    public readonly hwidDeviceLimit: number | null;
    public readonly externalSquadUuid: string | null;
    public readonly lastTriggeredThreshold: number;
    public readonly subRevokedAt: Date | null;
    public readonly lastTrafficResetAt: Date | null;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly subscriptionPageUrl: string;
    public readonly happCryptoLink: string | null;
    public readonly happCryptoLinkVersion: 'crypt5' | null;
    public readonly userTraffic: {
        usedTrafficBytes: number;
        lifetimeUsedTrafficBytes: number;
        onlineAt: Date | null;
        lastConnectedNodeUuid: string | null;
        firstConnectedAt: Date | null;
    };

    constructor(
        entity: UserEntity,
        subPublicDomain: string,
        happCryptoLink: string | null,
        happCryptoLinkVersion: 'crypt5' | null,
    ) {
        this.shortUuid = entity.shortUuid;
        this.username = entity.username;
        this.status = entity.status;
        this.trafficLimitBytes = Number(entity.trafficLimitBytes);
        this.trafficLimitStrategy = entity.trafficLimitStrategy;
        this.expireAt = entity.expireAt;
        this.telegramId = entity.telegramId ? Number(entity.telegramId) : null;
        this.email = entity.email;
        this.description = entity.description;
        this.tag = entity.tag;
        this.hwidDeviceLimit = entity.hwidDeviceLimit;
        this.externalSquadUuid = entity.externalSquadUuid;
        this.lastTriggeredThreshold = entity.lastTriggeredThreshold;
        this.subRevokedAt = entity.subRevokedAt;
        this.lastTrafficResetAt = entity.lastTrafficResetAt;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        this.subscriptionPageUrl = `https://${subPublicDomain}/${entity.shortUuid}`;
        this.happCryptoLink = happCryptoLink;
        this.happCryptoLinkVersion = happCryptoLinkVersion;
        this.userTraffic = {
            usedTrafficBytes: Number(entity.userTraffic.usedTrafficBytes),
            lifetimeUsedTrafficBytes: Number(entity.userTraffic.lifetimeUsedTrafficBytes),
            onlineAt: entity.userTraffic.onlineAt,
            lastConnectedNodeUuid: entity.userTraffic.lastConnectedNodeUuid,
            firstConnectedAt: entity.userTraffic.firstConnectedAt,
        };
    }
}
