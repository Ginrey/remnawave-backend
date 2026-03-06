import { IMPORT_FETCH_STATUS, TImportFetchStatus } from '@libs/contracts/models';

import { SubscriptionImportSourceEntity } from '../entities';

export class GetSubscriptionImportSourceResponseModel {
    uuid: string;
    name: string;
    url: string;
    isEnabled: boolean;
    fetchIntervalMinutes: number;
    configProfileInboundUuid: string | null;
    lastFetchedAt: Date | null;
    lastFetchStatus: TImportFetchStatus | null;
    lastFetchError: string | null;
    lastHostsCount: number | null;
    importGroup: string | null;
    fetchHeaders: Record<string, string> | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(entity: SubscriptionImportSourceEntity) {
        this.uuid = entity.uuid;
        this.name = entity.name;
        this.url = entity.url;
        this.isEnabled = entity.isEnabled;
        this.fetchIntervalMinutes = entity.fetchIntervalMinutes;
        this.configProfileInboundUuid = entity.configProfileInboundUuid;
        this.lastFetchedAt = entity.lastFetchedAt;
        this.lastFetchStatus = (entity.lastFetchStatus as TImportFetchStatus | null) ?? null;
        this.lastFetchError = entity.lastFetchError;
        this.lastHostsCount = entity.lastHostsCount;
        this.importGroup = entity.importGroup ?? null;
        this.fetchHeaders = (entity.fetchHeaders as Record<string, string> | null) ?? null;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}

export class GetSubscriptionImportSourcesResponseModel {
    total: number;
    importSources: GetSubscriptionImportSourceResponseModel[];

    constructor(entities: SubscriptionImportSourceEntity[], total: number) {
        this.total = total;
        this.importSources = entities.map((e) => new GetSubscriptionImportSourceResponseModel(e));
    }
}
