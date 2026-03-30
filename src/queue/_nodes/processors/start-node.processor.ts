import { Job } from 'bullmq';
import semver from 'semver';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { formatExecutionTime, getTime } from '@common/utils/get-elapsed-time';
import { AxiosService } from '@common/axios/axios.service';
<<<<<<< HEAD
import { EVENTS } from '@libs/contracts/constants';
=======
import { RawCacheService } from '@common/raw-cache';
import { CACHE_KEYS, CACHE_KEYS_TTL, EVENTS } from '@libs/contracts/constants';
>>>>>>> upstream/main

import { NodeEvent } from '@integration-modules/notifications/interfaces';

import { GetPreparedConfigWithUsersQuery } from '@modules/users/queries/get-prepared-config-with-users';
<<<<<<< HEAD
=======
import { GetPluginByUuidQuery } from '@modules/node-plugins/queries/get-plugin-by-uuid';
>>>>>>> upstream/main
import { GetNodeByUuidQuery } from '@modules/nodes/queries/get-node-by-uuid';
import { UpdateNodeCommand } from '@modules/nodes/commands/update-node';

import { QUEUES_NAMES } from '@queue/queue.enum';

import { NODES_JOB_NAMES } from '../constants/nodes-job-name.constant';
import { NodesQueuesService } from '../nodes-queues.service';

@Processor(QUEUES_NAMES.NODES.START, {
    concurrency: 40,
})
export class StartNodeProcessor extends WorkerHost {
    private readonly logger = new Logger(StartNodeProcessor.name);

    constructor(
        private readonly axios: AxiosService,
        private readonly nodesQueuesService: NodesQueuesService,
        private readonly queryBus: QueryBus,
        private readonly eventEmitter: EventEmitter2,
        private readonly commandBus: CommandBus,
<<<<<<< HEAD
=======
        private readonly rawCacheService: RawCacheService,
>>>>>>> upstream/main
    ) {
        super();
    }

    async process(job: Job<{ nodeUuid: string }>) {
        try {
            const { nodeUuid } = job.data;

            const nodeCheckup = await this.queryBus.execute(new GetNodeByUuidQuery(nodeUuid));

            if (!nodeCheckup.isOk) {
                this.logger.error(`Node ${nodeUuid} not found`);
                return;
            }

            const { response: node } = nodeCheckup;

            if (node.isConnecting) {
                return;
            }

<<<<<<< HEAD
=======
            await this.rawCacheService.delMany([
                CACHE_KEYS.NODE_SYSTEM_STATS(nodeUuid),
                CACHE_KEYS.NODE_USERS_ONLINE(nodeUuid),
                CACHE_KEYS.NODE_XRAY_UPTIME(nodeUuid),
            ]);

>>>>>>> upstream/main
            if (node.activeInbounds.length === 0 || !node.activeConfigProfileUuid) {
                this.logger.warn(
                    `Node ${nodeUuid} has no active config profile or inbounds, disabling and clearing profile from node...`,
                );

                await this.commandBus.execute(
                    new UpdateNodeCommand({
                        uuid: node.uuid,
                        isDisabled: true,
                        activeConfigProfileUuid: null,
                        isConnecting: false,
                        isConnected: false,
                        lastStatusMessage: null,
                        lastStatusChange: new Date(),
<<<<<<< HEAD
                        usersOnline: 0,
=======
>>>>>>> upstream/main
                    }),
                );

                await this.nodesQueuesService.stopNode({
                    nodeUuid: node.uuid,
                    isNeedToBeDeleted: false,
                });

                return;
            }

            await this.commandBus.execute(
                new UpdateNodeCommand({
                    uuid: node.uuid,
                    isConnecting: true,
                }),
            );

            const xrayStatusResponse = await this.axios.getNodeHealth(node.address, node.port);

            if (!xrayStatusResponse.isOk) {
                await this.commandBus.execute(
                    new UpdateNodeCommand({
                        uuid: node.uuid,
                        lastStatusMessage: xrayStatusResponse.message ?? null,
                        lastStatusChange: new Date(),
                        isConnected: false,
                        isConnecting: false,
<<<<<<< HEAD
                        usersOnline: 0,
=======
>>>>>>> upstream/main
                    }),
                );

                this.logger.error(
                    `Pre-check failed. Node: ${node.uuid} – ${node.address}:${node.port}, error: ${xrayStatusResponse.message}`,
                );

                return;
            }

<<<<<<< HEAD
            if (
                xrayStatusResponse.response.nodeVersion === null ||
                xrayStatusResponse.response.nodeVersion === undefined
            ) {
                await this.commandBus.execute(
                    new UpdateNodeCommand({
                        uuid: node.uuid,
                        lastStatusMessage:
                            'Unknown node version. Please upgrade Remnawave Node to the latest version.',
                        lastStatusChange: new Date(),
                        isConnected: false,
                        isConnecting: false,
                        usersOnline: 0,
=======
            if (semver.lt(xrayStatusResponse.response.nodeVersion, '2.7.0')) {
                await this.commandBus.execute(
                    new UpdateNodeCommand({
                        uuid: node.uuid,
                        lastStatusMessage: `Outdated version ${xrayStatusResponse.response.nodeVersion} of Remnawave Node. Please upgrade to the latest version (>= 2.7.0).`,
                        lastStatusChange: new Date(),
                        isConnected: false,
                        isConnecting: false,
>>>>>>> upstream/main
                    }),
                );

                this.logger.error(
<<<<<<< HEAD
                    `Node ${node.uuid} – unknown node version. Please upgrade Remnawave Node to the latest version.`,
                );
                return;
            } else if (semver.lt(xrayStatusResponse.response.nodeVersion, '2.5.0')) {
                this.logger.warn(
                    `Node ${node.uuid} running on outdated version of Remnawave Node. Please upgrade to the latest version. Some features may not work properly.`,
                );
=======
                    `Outdated version ${xrayStatusResponse.response.nodeVersion} of Remnawave Node. Please upgrade to the latest version (>= 2.7.0).`,
                );

                return;
            }

            let plugin: {
                uuid: string;
                config: Record<string, unknown>;
                name: string;
            } | null = null;

            if (node.activePluginUuid) {
                const getNodePluginResult = await this.queryBus.execute(
                    new GetPluginByUuidQuery(node.activePluginUuid),
                );

                if (!getNodePluginResult.isOk) {
                    this.logger.error(`Failed to get node plugin: ${getNodePluginResult.message}`);
                    return;
                }
                const { response: nodePlugin } = getNodePluginResult;
                plugin = {
                    uuid: nodePlugin.uuid,
                    config: nodePlugin.pluginConfig as Record<string, unknown>,
                    name: nodePlugin.name,
                };
            }

            const syncNodePluginsResponse = await this.axios.syncNodePlugins(
                {
                    plugin,
                },
                node.address,
                node.port,
            );

            if (!syncNodePluginsResponse.isOk) {
                await this.commandBus.execute(
                    new UpdateNodeCommand({
                        uuid: node.uuid,
                        isConnecting: false,
                        isConnected: false,
                        lastStatusMessage: `Failed to sync node plugins: ${syncNodePluginsResponse.message}`,
                        lastStatusChange: new Date(),
                    }),
                );

                this.logger.error(
                    `Failed to sync node plugins: ${syncNodePluginsResponse.message}`,
                );
                return;
>>>>>>> upstream/main
            }

            const startTime = getTime();
            const config = await this.queryBus.execute(
                new GetPreparedConfigWithUsersQuery(
                    node.activeConfigProfileUuid,
                    node.activeInbounds,
                ),
            );

            this.logger.log(`Generated config for node in ${formatExecutionTime(startTime)}`);

            if (!config.isOk) {
                throw new Error('Failed to get config for node');
            }

            const reqStartTime = getTime();

            const startNodeResult = await this.axios.startXray(
                {
                    xrayConfig: config.response.config as unknown as Record<string, unknown>,
                    internals: { hashes: config.response.hashesPayload, forceRestart: false },
                },
                node.address,
                node.port,
            );

            this.logger.log(`Started node in ${formatExecutionTime(reqStartTime)}`);

            if (!startNodeResult.isOk) {
                await this.commandBus.execute(
                    new UpdateNodeCommand({
                        uuid: node.uuid,
                        lastStatusMessage: startNodeResult.message ?? null,
                        lastStatusChange: new Date(),
                        isConnected: false,
                        isConnecting: false,
<<<<<<< HEAD
                        usersOnline: 0,
=======
>>>>>>> upstream/main
                    }),
                );

                return;
            }

            const nodeResponse = startNodeResult.response.response;

<<<<<<< HEAD
            const updateNodeResult = await this.commandBus.execute(
                new UpdateNodeCommand({
                    uuid: node.uuid,
                    xrayVersion: nodeResponse.version,
                    nodeVersion: nodeResponse.nodeInformation?.version || null,
=======
            await this.rawCacheService.setMany([
                {
                    key: CACHE_KEYS.NODE_SYSTEM_INFO(node.uuid),
                    value: nodeResponse.system.info,
                },
                {
                    key: CACHE_KEYS.NODE_VERSIONS(node.uuid),
                    value:
                        nodeResponse.nodeInformation.version && nodeResponse.version
                            ? {
                                  xray: nodeResponse.version,
                                  node: nodeResponse.nodeInformation.version,
                              }
                            : null,
                },
                {
                    key: CACHE_KEYS.NODE_SYSTEM_STATS(node.uuid),
                    value: nodeResponse.system.stats,
                    ttlSeconds: CACHE_KEYS_TTL.NODE_SYSTEM_STATS,
                },
            ]);

            const updateNodeResult = await this.commandBus.execute(
                new UpdateNodeCommand({
                    uuid: node.uuid,
>>>>>>> upstream/main
                    isConnected: nodeResponse.isStarted,
                    lastStatusMessage: nodeResponse.error ?? null,
                    lastStatusChange: new Date(),
                    isConnecting: false,
<<<<<<< HEAD
                    cpuCount: nodeResponse.systemInformation?.cpuCores ?? null,
                    cpuModel: nodeResponse.systemInformation?.cpuModel ?? null,
                    totalRam: nodeResponse.systemInformation?.memoryTotal ?? null,
                    usersOnline: 0,
=======
>>>>>>> upstream/main
                }),
            );

            if (!updateNodeResult.isOk) {
                this.logger.error(`Failed to update node ${node.uuid}`);
                return;
            }

            if (!node.isConnected) {
                this.eventEmitter.emit(
                    EVENTS.NODE.CONNECTION_RESTORED,
                    new NodeEvent(updateNodeResult.response, EVENTS.NODE.CONNECTION_RESTORED),
                );
            }

            return;
        } catch (error) {
            this.logger.error(`Error handling "${NODES_JOB_NAMES.START_NODE}" job: ${error}`);
        }
    }
}
