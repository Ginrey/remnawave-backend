<<<<<<< HEAD
import { InjectRedis } from '@songkeys/nestjs-redis';
import { Job } from 'bullmq';
import Redis from 'ioredis';
=======
import { Job } from 'bullmq';
>>>>>>> upstream/main

import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';

<<<<<<< HEAD
import { INTERNAL_CACHE_KEYS } from '@libs/contracts/constants';

import { BulkUpsertUserHistoryEntryCommand } from '@modules/nodes-user-usage-history/commands/bulk-upsert-user-history-entry/bulk-upsert-user-history-entry.command';
=======
import { RawCacheService } from '@common/raw-cache';
import { INTERNAL_CACHE_KEYS } from '@libs/contracts/constants';

import { BulkUpsertUserHistoryEntryCommand } from '@modules/nodes-user-usage-history/commands/bulk-upsert-user-history-entry';
>>>>>>> upstream/main
import { NodesUserUsageHistoryEntity } from '@modules/nodes-user-usage-history/entities';

import { IRecordUserUsageFromRedisPayload } from './interfaces';
import { PushFromRedisJobNames } from './enums';
import { QUEUES_NAMES } from '../queue.enum';

@Processor(QUEUES_NAMES.PUSH_TO_DB, {
    concurrency: 10,
    limiter: {
        max: 3,
        duration: 500,
    },
})
export class PushFromRedisQueueProcessor extends WorkerHost implements OnApplicationBootstrap {
    private readonly logger = new Logger(PushFromRedisQueueProcessor.name);
    private readonly disableUserUsageRecords: boolean;

    constructor(
        private readonly commandBus: CommandBus,
<<<<<<< HEAD
        @InjectRedis() private readonly redis: Redis,
=======
        private readonly rawCacheService: RawCacheService,
>>>>>>> upstream/main
        private readonly configService: ConfigService,
    ) {
        super();

        this.disableUserUsageRecords = this.configService.getOrThrow<boolean>(
            'SERVICE_DISABLE_USER_USAGE_RECORDS',
        );
    }
<<<<<<< HEAD
=======

>>>>>>> upstream/main
    onApplicationBootstrap() {
        if (this.disableUserUsageRecords) {
            this.logger.warn(
                'SERVICE_DISABLE_USER_USAGE_RECORDS is enabled, user usage records will not be recorded.',
            );
        } else {
            this.logger.log('User usage records will be recorded to the database.');
        }
    }

    async process(job: Job) {
        switch (job.name) {
            case PushFromRedisJobNames.recordUserUsage:
                return await this.handleRecordUserUsageJob(job);
            default:
                this.logger.warn(`Job "${job.name}" is not handled.`);
                break;
        }
    }

    private async handleRecordUserUsageJob(job: Job<IRecordUserUsageFromRedisPayload>) {
        const { redisKey } = job.data;
        const processingKey = `${redisKey}${INTERNAL_CACHE_KEYS.PROCESSING_POSTFIX}`;

        try {
            if (this.disableUserUsageRecords) {
                return;
            }

<<<<<<< HEAD
            const exists = await this.redis.exists(redisKey);

            if (exists === 0) {
                return;
            }

            await this.redis.rename(redisKey, processingKey);

            const results = await this.redis.hgetall(processingKey);

            for await (const batch of this.batchEntries(results, redisKey)) {
=======
            const exists = await this.rawCacheService.exists(redisKey);

            if (!exists) {
                return;
            }

            await this.rawCacheService.rename(redisKey, processingKey);

            const nodeId = BigInt(redisKey.split(':')[1]);

            for await (const batch of this.scanAndBatch(processingKey, nodeId)) {
>>>>>>> upstream/main
                await this.commandBus.execute(new BulkUpsertUserHistoryEntryCommand(batch));
            }

            return;
        } catch (error) {
            this.logger.error(
                `Error handling "${PushFromRedisJobNames.recordUserUsage}" job: ${error}`,
            );
            return;
        } finally {
<<<<<<< HEAD
            await this.redis.del(processingKey);
        }
    }

    private async *batchEntries(
        data: Record<string, string>,
        keyString: string,
        batchSize: number = 10_000,
    ): AsyncGenerator<NodesUserUsageHistoryEntity[]> {
        const entries = Object.entries(data);
        let batch: NodesUserUsageHistoryEntity[] = [];

        for (const [userId, totalBytes] of entries) {
            batch.push(
                new NodesUserUsageHistoryEntity({
                    nodeId: BigInt(keyString.split(':')[1]),
                    userId: BigInt(userId),
                    totalBytes: BigInt(totalBytes),
                }),
            );

            if (batch.length >= batchSize) {
                yield batch;
                batch = [];
            }
        }

        if (batch.length > 0) {
            yield batch;
=======
            await this.rawCacheService.del(processingKey);
        }
    }

    private async *scanAndBatch(
        key: string,
        nodeId: bigint,
        batchSize: number = 10_000,
    ): AsyncGenerator<NodesUserUsageHistoryEntity[]> {
        const stream = this.rawCacheService.hscanStream(key, { count: batchSize });

        for await (const chunk of stream) {
            const batch: NodesUserUsageHistoryEntity[] = [];

            for (let i = 0; i < chunk.length; i += 2) {
                batch.push(
                    new NodesUserUsageHistoryEntity({
                        nodeId,
                        userId: BigInt(chunk[i]),
                        totalBytes: BigInt(chunk[i + 1]),
                    }),
                );
            }

            if (batch.length > 0) {
                yield batch;
            }
>>>>>>> upstream/main
        }
    }
}
