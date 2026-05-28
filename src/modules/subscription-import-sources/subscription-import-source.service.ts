import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createHash } from 'node:crypto';

import { Injectable, Logger } from '@nestjs/common';

import { fail, ok, TResult } from '@common/types';
import { IMPORT_FETCH_STATUS } from '@libs/contracts/models';
import { ERRORS } from '@libs/contracts/constants';

import {
    GetSubscriptionImportSourceResponseModel,
    GetSubscriptionImportSourcesResponseModel,
} from './models';
import {
    CreateSubscriptionImportSourceRequestDto,
    UpdateSubscriptionImportSourceRequestDto,
} from './dtos';
import { SubscriptionImportSourceRepository } from './repositories/subscription-import-source.repository';
import { ISubscriptionImportSourceGroup } from './interfaces/import-source-group.interface';
import { SubscriptionFetchService } from './services/subscription-fetch.service';
import { SubscriptionImportSourceEntity } from './entities';

const XRAY_JSON_IMPORT_PROTOCOL = 'xray-json://';
const IMPORT_SOURCE_STALE_INTERVAL_MULTIPLIER = 3;
const IMPORT_SOURCE_MIN_FRESH_WINDOW_MS = 15 * 60_000;
const IMPORT_SOURCE_MIN_HOST_COUNT_RATIO = 0.6;

type SelectableImportSource = Awaited<
    ReturnType<SubscriptionImportSourceRepository['findSourcesForUser']>
>[number];

type ImportSourceHealthTier = 'fresh-success' | 'success-cache' | 'non-error-cache' | 'any-cache';

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
        dto: { uuid: string } & UpdateSubscriptionImportSourceRequestDto,
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
    public async getRawLinesForUser(
        userId: bigint,
        includeAllImportSources = false,
    ): Promise<string[]> {
        try {
            const selectedSources = includeAllImportSources
                ? await this.selectAllSourcesForUser(userId)
                : await this.selectStableSourcesForUser(userId);
            return selectedSources.flatMap((source) =>
                source.rawLines.filter((line) => !line.startsWith(XRAY_JSON_IMPORT_PROTOCOL)),
            );
        } catch (error) {
            this.logger.error('Error in getRawLinesForUser:', error);
            return [];
        }
    }

    public async getGroupedRawLinesForUser(
        userId: bigint,
        includeAllImportSources = false,
    ): Promise<ISubscriptionImportSourceGroup[]> {
        try {
            return includeAllImportSources
                ? await this.selectAllSourcesForUser(userId)
                : await this.selectStableSourcesForUser(userId);
        } catch (error) {
            this.logger.error('Error in getGroupedRawLinesForUser:', error);
            return [];
        }
    }

    private async selectAllSourcesForUser(
        userId: bigint,
    ): Promise<ISubscriptionImportSourceGroup[]> {
        const sources = await this.repository.findSourcesForUser(userId);

        return sources
            .filter((source) => source.cachedRawLines.length > 0)
            .sort((left, right) => this.compareSourcesForStableOutput(left, right))
            .map((source) => ({
                name: source.importGroup ?? source.name,
                importGroup: source.importGroup,
                sourceNames: [source.name],
                rawLines: [...source.cachedRawLines],
            }));
    }

    private async selectStableSourcesForUser(
        userId: bigint,
    ): Promise<ISubscriptionImportSourceGroup[]> {
        const sources = await this.repository.findSourcesForUser(userId);
        const groupedSources = new Map<string, typeof sources>();
        const selectedSources: ISubscriptionImportSourceGroup[] = [];

        for (const source of sources) {
            if (!source.importGroup) {
                if (source.cachedRawLines.length > 0) {
                    selectedSources.push({
                        name: source.name,
                        importGroup: null,
                        sourceNames: [source.name],
                        rawLines: [...source.cachedRawLines],
                    });
                }
                continue;
            }

            const bucket = groupedSources.get(source.importGroup) ?? [];
            bucket.push(source);
            groupedSources.set(source.importGroup, bucket);
        }

        for (const [groupKey, bucket] of groupedSources.entries()) {
            const selected = this.selectSourceForImportGroup(userId, groupKey, bucket);

            if (!selected) {
                continue;
            }

            selectedSources.push({
                name: selected.importGroup ?? selected.name,
                importGroup: selected.importGroup,
                sourceNames: [selected.name],
                rawLines: [...selected.cachedRawLines],
            });
        }

        return selectedSources;
    }

    private selectSourceForImportGroup(
        userId: bigint,
        groupKey: string,
        bucket: SelectableImportSource[],
    ): SelectableImportSource | null {
        const sourcesWithCache = bucket.filter((source) => source.cachedRawLines.length > 0);
        if (sourcesWithCache.length === 0) return null;

        const stickyPrimary = this.pickStableSource(userId, groupKey, sourcesWithCache);

        if (stickyPrimary && this.canUseStickyPrimary(stickyPrimary, sourcesWithCache)) {
            return stickyPrimary;
        }

        for (const tier of [
            'fresh-success',
            'success-cache',
            'non-error-cache',
            'any-cache',
        ] satisfies ImportSourceHealthTier[]) {
            const candidates = this.getTierCandidates(sourcesWithCache, tier);
            const selected = this.pickStableSource(userId, `${groupKey}:${tier}`, candidates);

            if (selected) return selected;
        }

        return null;
    }

    private pickStableSource(
        userId: bigint,
        groupKey: string,
        sources: SelectableImportSource[],
    ): SelectableImportSource | null {
        if (sources.length === 0) return null;

        return sources.reduce(
            (selected, source) => {
                if (!selected) return source;

                const selectedScore = this.getRendezvousScore(userId, groupKey, selected);
                const sourceScore = this.getRendezvousScore(userId, groupKey, source);

                if (sourceScore > selectedScore) return source;
                if (sourceScore < selectedScore) return selected;

                return source.name.localeCompare(selected.name) < 0 ? source : selected;
            },
            null as SelectableImportSource | null,
        );
    }

    private getRendezvousScore(
        userId: bigint,
        groupKey: string,
        source: SelectableImportSource,
    ): bigint {
        const hash = createHash('sha256')
            .update(`${userId.toString()}:${groupKey}:${source.uuid}`)
            .digest('hex')
            .slice(0, 16);

        return BigInt(`0x${hash}`);
    }

    private canUseStickyPrimary(
        source: SelectableImportSource,
        alternatives: SelectableImportSource[],
    ): boolean {
        return (
            source.cachedRawLines.length > 0 &&
            source.lastFetchStatus !== IMPORT_FETCH_STATUS.ERROR &&
            !this.isSourceSeverelyDepleted(source, alternatives)
        );
    }

    private getTierCandidates(
        sources: SelectableImportSource[],
        tier: ImportSourceHealthTier,
    ): SelectableImportSource[] {
        const candidates = sources.filter((source) => this.isSourceInHealthTier(source, tier));
        const stableCandidates = candidates.filter(
            (source) => !this.isSourceSeverelyDepleted(source, candidates),
        );

        return stableCandidates.length > 0 ? stableCandidates : candidates;
    }

    private isSourceInHealthTier(
        source: SelectableImportSource,
        tier: ImportSourceHealthTier,
    ): boolean {
        if (source.cachedRawLines.length === 0) return false;

        switch (tier) {
            case 'fresh-success':
                return (
                    source.lastFetchStatus === IMPORT_FETCH_STATUS.SUCCESS &&
                    this.isSourceFresh(source)
                );
            case 'success-cache':
                return source.lastFetchStatus === IMPORT_FETCH_STATUS.SUCCESS;
            case 'non-error-cache':
                return source.lastFetchStatus !== IMPORT_FETCH_STATUS.ERROR;
            case 'any-cache':
                return true;
        }
    }

    private isSourceFresh(source: SelectableImportSource): boolean {
        if (!source.lastFetchedAt) return false;

        const freshWindowMs = Math.max(
            source.fetchIntervalMinutes * IMPORT_SOURCE_STALE_INTERVAL_MULTIPLIER * 60_000,
            IMPORT_SOURCE_MIN_FRESH_WINDOW_MS,
        );

        return Date.now() - source.lastFetchedAt.getTime() <= freshWindowMs;
    }

    private isSourceSeverelyDepleted(
        source: SelectableImportSource,
        alternatives: SelectableImportSource[],
    ): boolean {
        const bestHostCount = Math.max(
            ...alternatives.map((item) => this.getSourceHostCount(item)),
        );
        if (bestHostCount < 10) return false;

        return this.getSourceHostCount(source) < bestHostCount * IMPORT_SOURCE_MIN_HOST_COUNT_RATIO;
    }

    private getSourceHostCount(source: SelectableImportSource): number {
        return source.lastHostsCount ?? source.cachedRawLines.length;
    }

    private compareSourcesForStableOutput(
        left: SelectableImportSource,
        right: SelectableImportSource,
    ): number {
        return (
            this.getSourceHealthSortIndex(left) - this.getSourceHealthSortIndex(right) ||
            (left.importGroup ?? left.name).localeCompare(right.importGroup ?? right.name) ||
            left.name.localeCompare(right.name)
        );
    }

    private getSourceHealthSortIndex(source: SelectableImportSource): number {
        if (
            source.cachedRawLines.length > 0 &&
            source.lastFetchStatus === IMPORT_FETCH_STATUS.SUCCESS &&
            this.isSourceFresh(source)
        ) {
            return 0;
        }

        if (
            source.cachedRawLines.length > 0 &&
            source.lastFetchStatus === IMPORT_FETCH_STATUS.SUCCESS
        ) {
            return 1;
        }

        if (
            source.cachedRawLines.length > 0 &&
            source.lastFetchStatus !== IMPORT_FETCH_STATUS.ERROR
        ) {
            return 2;
        }

        return 3;
    }
}
