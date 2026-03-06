import { SubscriptionImportSources } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { UniversalConverter } from '@common/converter/universalConverter';

import { SubscriptionImportSourceEntity } from './entities';

const modelToEntity = (model: SubscriptionImportSources): SubscriptionImportSourceEntity => {
    return new SubscriptionImportSourceEntity(model);
};

const entityToModel = (entity: SubscriptionImportSourceEntity): SubscriptionImportSources => {
    return {
        uuid: entity.uuid,
        name: entity.name,
        url: entity.url,
        isEnabled: entity.isEnabled,
        fetchIntervalMinutes: entity.fetchIntervalMinutes,
        configProfileInboundUuid: entity.configProfileInboundUuid,
        lastFetchedAt: entity.lastFetchedAt,
        lastFetchStatus: entity.lastFetchStatus,
        lastFetchError: entity.lastFetchError,
        lastHostsCount: entity.lastHostsCount,
        cachedRawLines: entity.cachedRawLines ?? [],
        importGroup: entity.importGroup ?? null,
        fetchHeaders: entity.fetchHeaders ?? null,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    };
};

@Injectable()
export class SubscriptionImportSourceConverter extends UniversalConverter<
    SubscriptionImportSourceEntity,
    SubscriptionImportSources
> {
    constructor() {
        super(modelToEntity, entityToModel);
    }
}
