import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ICrud } from '@common/types/crud-port';

import { SubscriptionImportSourceConverter } from '../subscription-import-source.converter';
import { SubscriptionImportSourceEntity } from '../entities';
import { ISubscriptionImportSourceGroup } from '../interfaces/import-source-group.interface';

@Injectable()
export class SubscriptionImportSourceRepository
    implements ICrud<SubscriptionImportSourceEntity>
{
    constructor(
        private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
        private readonly converter: SubscriptionImportSourceConverter,
    ) {}

    public async create(
        entity: SubscriptionImportSourceEntity,
    ): Promise<SubscriptionImportSourceEntity> {
        const model = this.converter.fromEntityToPrismaModel(entity);
        const result = await this.prisma.tx.subscriptionImportSources.create({
            data: {
                ...model,
                fetchHeaders: (model.fetchHeaders ?? Prisma.JsonNull) as any,
            },
        });
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByUUID(uuid: string): Promise<SubscriptionImportSourceEntity | null> {
        const result = await this.prisma.tx.subscriptionImportSources.findUnique({
            where: { uuid },
        });
        if (!result) return null;
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findAll(): Promise<SubscriptionImportSourceEntity[]> {
        const list = await this.prisma.tx.subscriptionImportSources.findMany({
            orderBy: { createdAt: 'asc' },
        });
        return this.converter.fromPrismaModelsToEntities(list);
    }

    public async findEnabled(): Promise<SubscriptionImportSourceEntity[]> {
        const list = await this.prisma.tx.subscriptionImportSources.findMany({
            where: { isEnabled: true },
            orderBy: { createdAt: 'asc' },
        });
        return this.converter.fromPrismaModelsToEntities(list);
    }

    public async update(
        entity: Partial<SubscriptionImportSourceEntity>,
    ): Promise<SubscriptionImportSourceEntity | null> {
        const { uuid, fetchHeaders, ...rest } = entity;
        const result = await this.prisma.tx.subscriptionImportSources.update({
            where: { uuid },
            data: {
                ...rest,
                ...(fetchHeaders !== undefined && {
                    fetchHeaders: (fetchHeaders ?? Prisma.JsonNull) as any,
                }),
            },
        });
        return this.converter.fromPrismaModelToEntity(result);
    }

    public async findByCriteria(
        dto: Partial<SubscriptionImportSourceEntity>,
    ): Promise<SubscriptionImportSourceEntity[]> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { cachedRawLines, fetchHeaders, ...whereDto } = dto;
        const list = await this.prisma.tx.subscriptionImportSources.findMany({
            where: { ...whereDto },
        });
        return this.converter.fromPrismaModelsToEntities(list);
    }

    public async deleteByUUID(uuid: string): Promise<boolean> {
        const result = await this.prisma.tx.subscriptionImportSources.delete({ where: { uuid } });
        return !!result;
    }

    /**
     * Returns cached raw proxy lines for the user, applying group-based random selection.
     *
     * Sources that share the same non-null `importGroup` are treated as a pool:
     * exactly ONE source is picked at random from each group, preventing clients
     * from receiving duplicate/redundant configs. Sources with no group (null)
     * always contribute their lines individually.
     */
    public async findRawLinesForUser(userId: bigint): Promise<string[]> {
        const sources = await this.prisma.tx.subscriptionImportSources.findMany({
            where: {
                isEnabled: true,
                configProfileInbound: {
                    internalSquadInbounds: {
                        some: {
                            internalSquad: {
                                internalSquadMembers: {
                                    some: { userId },
                                },
                            },
                        },
                    },
                },
            },
            select: { cachedRawLines: true, importGroup: true },
        });

        const groups = new Map<string, (typeof sources)>();
        const ungrouped: (typeof sources) = [];

        for (const source of sources) {
            if (source.importGroup) {
                const bucket = groups.get(source.importGroup) ?? [];
                bucket.push(source);
                groups.set(source.importGroup, bucket);
            } else {
                ungrouped.push(source);
            }
        }

        const winners: (typeof sources) = [...ungrouped];
        for (const bucket of groups.values()) {
            const pick = bucket[Math.floor(Math.random() * bucket.length)];
            winners.push(pick);
        }

        return winners.flatMap((s) => s.cachedRawLines);
    }

    public async findGroupedRawLinesForUser(
        userId: bigint,
    ): Promise<ISubscriptionImportSourceGroup[]> {
        const sources = await this.prisma.tx.subscriptionImportSources.findMany({
            where: {
                isEnabled: true,
                configProfileInbound: {
                    internalSquadInbounds: {
                        some: {
                            internalSquad: {
                                internalSquadMembers: {
                                    some: { userId },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
            select: {
                name: true,
                importGroup: true,
                cachedRawLines: true,
            },
        });

        const groups = new Map<string, ISubscriptionImportSourceGroup>();

        for (const source of sources) {
            const groupKey = source.importGroup ?? `source:${source.name}`;
            const existing = groups.get(groupKey);

            if (existing) {
                existing.sourceNames.push(source.name);
                existing.rawLines.push(...source.cachedRawLines);
                continue;
            }

            groups.set(groupKey, {
                name: source.importGroup ?? source.name,
                importGroup: source.importGroup,
                sourceNames: [source.name],
                rawLines: [...source.cachedRawLines],
            });
        }

        return Array.from(groups.values()).filter((group) => group.rawLines.length > 0);
    }
}
