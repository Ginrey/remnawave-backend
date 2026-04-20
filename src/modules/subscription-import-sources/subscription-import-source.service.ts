import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { Injectable, Logger } from '@nestjs/common';

import { fail, ok, TResult } from '@common/types';
import { ERRORS } from '@libs/contracts/constants';

import { SubscriptionImportSourceEntity } from './entities';
import { SubscriptionImportSourceRepository } from './repositories/subscription-import-source.repository';
import {
    CreateSubscriptionImportSourceRequestDto,
    UpdateSubscriptionImportSourceRequestDto,
} from './dtos';
import {
    GetSubscriptionImportSourceResponseModel,
    GetSubscriptionImportSourcesResponseModel,
} from './models';
import { ISubscriptionImportSourceGroup } from './interfaces/import-source-group.interface';
import { SubscriptionFetchService } from './services/subscription-fetch.service';

@Injectable()
export class SubscriptionImportSourceService {
    private readonly logger = new Logger(SubscriptionImportSourceService.name);

    constructor(
        private readonly repository: SubscriptionImportSourceRepository,
        private readonly fetchService: SubscriptionFetchService,
    ) {}

    public async getAll(): Promise<TResult<GetSubscriptionImportSourcesResponseModel>> {
        try {
            const sources = await this.repository.findAll();
            return ok(new GetSubscriptionImportSourcesResponseModel(sources, sources.length));
        } catch (error) {
            this.logger.error(error);
            return fail(ERRORS.GET_SUBSCRIPTION_IMPORT_SOURCES_ERROR);
        }
    }

    public async getByUuid(
        uuid: string,
    ): Promise<TResult<GetSubscriptionImportSourceResponseModel>> {
        try {
            const source = await this.repository.findByUUID(uuid);
            if (!source) {
                return fail(ERRORS.SUBSCRIPTION_IMPORT_SOURCE_NOT_FOUND);
            }
            return ok(new GetSubscriptionImportSourceResponseModel(source));
        } catch (error) {
            this.logger.error(error);
            return fail(ERRORS.GET_SUBSCRIPTION_IMPORT_SOURCE_BY_UUID_ERROR);
        }
    }

    public async create(
        dto: CreateSubscriptionImportSourceRequestDto,
    ): Promise<TResult<GetSubscriptionImportSourceResponseModel>> {
        try {
            const entity = new SubscriptionImportSourceEntity({
                name: dto.name,
                url: dto.url,
                isEnabled: dto.isEnabled ?? true,
                fetchIntervalMinutes: dto.fetchIntervalMinutes ?? 60,
                configProfileInboundUuid: dto.configProfileInboundUuid ?? null,
                importGroup: dto.importGroup ?? null,
                fetchHeaders: dto.fetchHeaders ?? null,
                lastFetchedAt: null,
                lastFetchStatus: null,
                lastFetchError: null,
                lastHostsCount: null,
            });

            const created = await this.repository.create(entity);
            return ok(new GetSubscriptionImportSourceResponseModel(created));
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2002' &&
                Array.isArray(error.meta?.target) &&
                (error.meta.target as string[]).includes('name')
            ) {
                return fail(ERRORS.SUBSCRIPTION_IMPORT_SOURCE_NAME_ALREADY_EXISTS);
            }
            this.logger.error(error);
            return fail(ERRORS.CREATE_SUBSCRIPTION_IMPORT_SOURCE_ERROR);
        }
    }

    public async update(
        dto: UpdateSubscriptionImportSourceRequestDto & { uuid: string },
    ): Promise<TResult<GetSubscriptionImportSourceResponseModel>> {
        try {
            const existing = await this.repository.findByUUID(dto.uuid);
            if (!existing) {
                return fail(ERRORS.SUBSCRIPTION_IMPORT_SOURCE_NOT_FOUND);
            }

            const updated = await this.repository.update({
                uuid: dto.uuid,
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.url !== undefined && { url: dto.url }),
                ...(dto.isEnabled !== undefined && { isEnabled: dto.isEnabled }),
                ...(dto.fetchIntervalMinutes !== undefined && {
                    fetchIntervalMinutes: dto.fetchIntervalMinutes,
                }),
                ...(dto.configProfileInboundUuid !== undefined && {
                    configProfileInboundUuid: dto.configProfileInboundUuid,
                }),
                ...(dto.importGroup !== undefined && { importGroup: dto.importGroup }),
                ...(dto.fetchHeaders !== undefined && { fetchHeaders: dto.fetchHeaders }),
            });

            if (!updated) {
                return fail(ERRORS.UPDATE_SUBSCRIPTION_IMPORT_SOURCE_ERROR);
            }

            return ok(new GetSubscriptionImportSourceResponseModel(updated));
        } catch (error) {
            this.logger.error(error);
            return fail(ERRORS.UPDATE_SUBSCRIPTION_IMPORT_SOURCE_ERROR);
        }
    }

    public async delete(uuid: string): Promise<TResult<{ isDeleted: boolean }>> {
        try {
            const existing = await this.repository.findByUUID(uuid);
            if (!existing) {
                return fail(ERRORS.SUBSCRIPTION_IMPORT_SOURCE_NOT_FOUND);
            }
            const isDeleted = await this.repository.deleteByUUID(uuid);
            return ok({ isDeleted });
        } catch (error) {
            this.logger.error(error);
            return fail(ERRORS.DELETE_SUBSCRIPTION_IMPORT_SOURCE_ERROR);
        }
    }

    public async fetchNow(
        uuid: string,
    ): Promise<TResult<GetSubscriptionImportSourceResponseModel>> {
        try {
            const source = await this.repository.findByUUID(uuid);
            if (!source) {
                return fail(ERRORS.SUBSCRIPTION_IMPORT_SOURCE_NOT_FOUND);
            }

            await this.fetchService.fetchAndSync(source);

            const updated = await this.repository.findByUUID(uuid);
            if (!updated) {
                return fail(ERRORS.SUBSCRIPTION_IMPORT_SOURCE_NOT_FOUND);
            }

            return ok(new GetSubscriptionImportSourceResponseModel(updated));
        } catch (error) {
            this.logger.error(error);
            return fail(ERRORS.FETCH_SUBSCRIPTION_IMPORT_SOURCE_ERROR);
        }
    }

    /**
     * Called by the scheduler to sync all enabled sources whose interval has elapsed.
     */
    public async syncDue(): Promise<void> {
        try {
            const sources = await this.repository.findEnabled();
            const now = new Date();

            for (const source of sources) {
                const minutesSinceLastFetch = source.lastFetchedAt
                    ? (now.getTime() - source.lastFetchedAt.getTime()) / 60_000
                    : Infinity;

                if (minutesSinceLastFetch >= source.fetchIntervalMinutes) {
                    await this.fetchService.fetchAndSync(source);
                }
            }
        } catch (error) {
            this.logger.error('Error in syncDue:', error);
        }
    }

    /**
     * Returns all raw proxy lines (vless://, trojan://, etc.) from enabled import sources
     * that are configured for inbounds the given user belongs to.
     * These lines must be included verbatim in the user's subscription — credentials
     * belong to the external server and must not be modified.
     */
    public async getRawLinesForUser(userId: bigint): Promise<string[]> {
        try {
            return await this.repository.findRawLinesForUser(userId);
        } catch (error) {
            this.logger.error('Error in getRawLinesForUser:', error);
            return [];
        }
    }

    public async getGroupedRawLinesForUser(
        userId: bigint,
    ): Promise<ISubscriptionImportSourceGroup[]> {
        try {
            return await this.repository.findGroupedRawLinesForUser(userId);
        } catch (error) {
            this.logger.error('Error in getGroupedRawLinesForUser:', error);
            return [];
        }
    }
}
