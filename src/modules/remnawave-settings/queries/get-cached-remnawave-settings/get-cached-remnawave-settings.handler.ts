<<<<<<< HEAD
import type { Cache } from 'cache-manager';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';

=======
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { RawCacheService } from '@common/raw-cache';
>>>>>>> upstream/main
import { CACHE_KEYS, CACHE_KEYS_TTL } from '@libs/contracts/constants';

import { RemnawaveSettingsRepository } from '@modules/remnawave-settings/repositories/remnawave-settings.repository';
import { RemnawaveSettingsEntity } from '@modules/remnawave-settings/entities';

import { GetCachedRemnawaveSettingsQuery } from './get-cached-remnawave-settings.query';

@QueryHandler(GetCachedRemnawaveSettingsQuery)
export class GetCachedRemnawaveSettingsHandler implements IQueryHandler<
    GetCachedRemnawaveSettingsQuery,
    RemnawaveSettingsEntity
> {
    private readonly logger = new Logger(GetCachedRemnawaveSettingsHandler.name);
    constructor(
        private readonly remnawaveSettingsRepository: RemnawaveSettingsRepository,
<<<<<<< HEAD
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
=======
        private readonly rawCacheService: RawCacheService,
>>>>>>> upstream/main
    ) {}

    async execute(): Promise<RemnawaveSettingsEntity> {
        try {
<<<<<<< HEAD
            const cached = await this.cacheManager.get<RemnawaveSettingsEntity>(
=======
            const cached = await this.rawCacheService.get<RemnawaveSettingsEntity>(
>>>>>>> upstream/main
                CACHE_KEYS.REMNAWAVE_SETTINGS,
            );
            if (cached) {
                return cached;
            }

            const settings = await this.remnawaveSettingsRepository.getSettings();

<<<<<<< HEAD
            await this.cacheManager.set(
=======
            await this.rawCacheService.set(
>>>>>>> upstream/main
                CACHE_KEYS.REMNAWAVE_SETTINGS,
                settings,
                CACHE_KEYS_TTL.REMNAWAVE_SETTINGS,
            );

            return settings;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
