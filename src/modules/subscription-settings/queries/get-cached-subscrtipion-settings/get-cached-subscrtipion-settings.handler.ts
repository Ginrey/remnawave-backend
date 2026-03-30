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

import { SubscriptionSettingsEntity } from '@modules/subscription-settings/entities';

import { SubscriptionSettingsRepository } from '../../repositories/subscription-settings.repository';
import { GetCachedSubscriptionSettingsQuery } from './get-cached-subscrtipion-settings.query';

@QueryHandler(GetCachedSubscriptionSettingsQuery)
export class GetCachedSubscriptionSettingsHandler implements IQueryHandler<GetCachedSubscriptionSettingsQuery> {
    private readonly logger = new Logger(GetCachedSubscriptionSettingsHandler.name);

    constructor(
        private readonly subscriptionSettingsRepository: SubscriptionSettingsRepository,
<<<<<<< HEAD
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
=======
        private readonly rawCacheService: RawCacheService,
>>>>>>> upstream/main
    ) {}

    async execute() {
        try {
<<<<<<< HEAD
            const cached = await this.cacheManager.get<SubscriptionSettingsEntity>(
=======
            const cached = await this.rawCacheService.get<SubscriptionSettingsEntity>(
>>>>>>> upstream/main
                CACHE_KEYS.SUBSCRIPTION_SETTINGS,
            );

            if (cached) {
                return cached;
            }

            const settings = await this.subscriptionSettingsRepository.findFirst();

            if (!settings) {
                return null;
            }

<<<<<<< HEAD
            await this.cacheManager.set(
=======
            await this.rawCacheService.set(
>>>>>>> upstream/main
                CACHE_KEYS.SUBSCRIPTION_SETTINGS,
                settings,
                CACHE_KEYS_TTL.SUBSCRIPTION_SETTINGS,
            );

            return settings;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
}
