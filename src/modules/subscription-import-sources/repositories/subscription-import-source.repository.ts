import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ICrud } from '@common/types/crud-port';

import { SubscriptionImportSourceConverter } from '../subscription-import-source.converter';
import { SubscriptionImportSourceEntity } from '../entities';

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
     * Returns all cached raw proxy lines from enabled import sources
     * that are linked to the config profile inbounds this user belongs to.
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
            select: { cachedRawLines: true },
        });

        return sources.flatMap((s) => s.cachedRawLines);
    }
}
