import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { GetSystemStatsCommand } from '@remnawave/node-contract';

<<<<<<< HEAD
import { AxiosService } from '@common/axios';
import { EVENTS } from '@libs/contracts/constants';
=======
import { RawCacheService } from '@common/raw-cache';
import { AxiosService } from '@common/axios';
import { CACHE_KEYS, CACHE_KEYS_TTL, EVENTS } from '@libs/contracts/constants';
>>>>>>> upstream/main

import { NodeEvent } from '@integration-modules/notifications/interfaces';

import { UpdateNodeCommand } from '@modules/nodes/commands/update-node';

import { NodesQueuesService } from '@queue/_nodes';
import { QUEUES_NAMES } from '@queue/queue.enum';

import { NODES_JOB_NAMES } from '../constants/nodes-job-name.constant';
import { INodeHealthCheckPayload } from '../interfaces';

@Processor(QUEUES_NAMES.NODES.HEALTH_CHECK, {
    concurrency: 40,
})
export class NodeHealthCheckQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeHealthCheckQueueProcessor.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventEmitter: EventEmitter2,
        private readonly axios: AxiosService,
        private readonly nodesQueuesService: NodesQueuesService,
<<<<<<< HEAD
=======
        private readonly rawCacheService: RawCacheService,
>>>>>>> upstream/main
    ) {
        super();
    }
    async process(job: Job<INodeHealthCheckPayload>) {
        try {
            const { nodeAddress, nodePort, nodeUuid, isConnected } = job.data;

            const attemptsLimit = 2;
            let attempts = 0;

            let message = '';

            while (attempts < attemptsLimit) {
<<<<<<< HEAD
                const response = await this.axios.getSystemStats(nodeAddress, nodePort);

                switch (response.isOk) {
                    case true:
                        return await this.handleConnectedNode(
                            nodeUuid,
                            isConnected,
                            response.response,
                        );
                    case false:
                        message = response.message ?? 'Unknown error';
=======
                const statResult = await this.axios.getSystemStats(nodeAddress, nodePort);

                switch (statResult.isOk) {
                    case true:
                        return await this.handleConnectedNode(
                            nodeUuid,
                            nodeAddress,
                            nodePort,
                            isConnected,
                            statResult.response.response,
                        );
                    case false:
                        message = statResult.message ?? 'Unknown error';
>>>>>>> upstream/main
                        attempts++;

                        this.logger.warn(
                            `Node ${nodeUuid}, ${nodeAddress}:${nodePort} – health check attempt ${attempts} of ${attemptsLimit}, message: ${message}`,
                        );

                        continue;
                    default:
                        message = 'Unknown error';
                        this.logger.error(
                            `Node ${nodeUuid}, ${nodeAddress}:${nodePort} – health check attempt ${attempts} of ${attemptsLimit}, message: ${message}`,
                        );

                        attempts++;
                        continue;
                }
            }

            return await this.handleDisconnectedNode(nodeUuid, isConnected, message);
        } catch (error) {
            this.logger.error(
                `Error handling "${NODES_JOB_NAMES.NODE_HEALTH_CHECK}" job: ${error}`,
            );
            return;
        }
    }

    private async handleConnectedNode(
        nodeUuid: string,
<<<<<<< HEAD
        isConnected: boolean,
        response: GetSystemStatsCommand.Response,
    ) {
        if (typeof response.response.uptime !== 'number') {
            this.logger.error(`Node ${nodeUuid} – uptime is not a number`);
            return;
        }

        const nodeUpdatedResponse = await this.commandBus.execute(
            new UpdateNodeCommand({
                uuid: nodeUuid,
                isConnected: true,
                lastStatusChange: new Date(),
                lastStatusMessage: '',
                xrayUptime: response.response.uptime.toString(),
            }),
        );

        if (!nodeUpdatedResponse.isOk) {
            return;
        }

        if (!isConnected) {
=======
        nodeAddress: string,
        nodePort: number | null,
        isConnected: boolean,
        stats: GetSystemStatsCommand.Response['response'],
    ) {
        if (stats.xrayInfo === null) {
            this.logger.error(`Node ${nodeUuid} – xrayInfo is null`);

            await this.commandBus.execute(
                new UpdateNodeCommand({
                    uuid: nodeUuid,
                    isConnected: false,
                    lastStatusChange: new Date(),
                    lastStatusMessage: 'Required info is missing. Outdated version?',
                }),
            );

            return;
        }

        await this.rawCacheService.setMany([
            {
                key: CACHE_KEYS.NODE_SYSTEM_STATS(nodeUuid),
                value: stats.system.stats,
                ttlSeconds: CACHE_KEYS_TTL.NODE_SYSTEM_STATS,
            },
            {
                key: CACHE_KEYS.NODE_XRAY_UPTIME(nodeUuid),
                value: stats.xrayInfo.uptime,
                ttlSeconds: CACHE_KEYS_TTL.NODE_XRAY_UPTIME,
            },
        ]);

        const reports = stats.plugins.torrentBlocker.reportsCount;
        if (reports !== undefined && reports > 0) {
            await this.nodesQueuesService.collectReports({
                nodeUuid,
                address: nodeAddress,
                port: nodePort,
            });

            this.logger.log(`Node ${nodeUuid} has ${reports} reports, collecting reports...`);
        }

        if (!isConnected) {
            const nodeUpdatedResponse = await this.commandBus.execute(
                new UpdateNodeCommand({
                    uuid: nodeUuid,
                    isConnected: true,
                }),
            );

            if (!nodeUpdatedResponse.isOk) {
                return;
            }

>>>>>>> upstream/main
            await this.nodesQueuesService.startNode({ nodeUuid });

            this.eventEmitter.emit(
                EVENTS.NODE.CONNECTION_RESTORED,
                new NodeEvent(nodeUpdatedResponse.response, EVENTS.NODE.CONNECTION_RESTORED),
            );
        }

        return;
    }

    private async handleDisconnectedNode(
        nodeUuid: string,
        isConnected: boolean,
        message: string | undefined,
    ) {
<<<<<<< HEAD
=======
        await this.rawCacheService.delMany([
            CACHE_KEYS.NODE_SYSTEM_INFO(nodeUuid),
            CACHE_KEYS.NODE_USERS_ONLINE(nodeUuid),
            CACHE_KEYS.NODE_XRAY_UPTIME(nodeUuid),
        ]);

>>>>>>> upstream/main
        const newNodeEntity = await this.commandBus.execute(
            new UpdateNodeCommand({
                uuid: nodeUuid,
                isConnected: false,
                lastStatusChange: new Date(),
                lastStatusMessage: message,
<<<<<<< HEAD
                usersOnline: 0,
                xrayUptime: '0',
=======
>>>>>>> upstream/main
            }),
        );

        if (!newNodeEntity.isOk) {
            return;
        }

        await this.nodesQueuesService.startNode({ nodeUuid });

        if (isConnected) {
            this.eventEmitter.emit(
                EVENTS.NODE.CONNECTION_LOST,
                new NodeEvent(newNodeEntity.response, EVENTS.NODE.CONNECTION_LOST),
            );
        }

        this.logger.warn(
            `Lost connection to Node ${nodeUuid}, ${newNodeEntity.response.address}:${newNodeEntity.response.port}, message: ${message}`,
        );

        return;
    }
}
