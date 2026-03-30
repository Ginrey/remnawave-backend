import allMeasures, {
    AllMeasures,
    AllMeasuresSystems,
    AllMeasuresUnits,
} from 'convert-units/definitions/all';
import configureMeasurements, { Converter } from 'convert-units';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Gauge } from 'prom-client';
<<<<<<< HEAD
import xbytes from 'xbytes';
import { t } from 'try';
import pm2 from 'pm2';
=======
>>>>>>> upstream/main

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueryBus } from '@nestjs/cqrs';

import { resolveCountryEmoji } from '@common/utils/resolve-country-emoji';
<<<<<<< HEAD
import { TResult } from '@common/types';
import { METRIC_NAMES } from '@libs/contracts/constants';

import { GetShortUserStatsQuery } from '@modules/users/queries/get-short-user-stats/get-short-user-stats.query';
import { GetAllNodesQuery } from '@modules/nodes/queries/get-all-nodes/get-all-nodes.query';
import { ShortUserStats } from '@modules/users/interfaces/user-stats.interface';
import { NodesEntity } from '@modules/nodes/entities/nodes.entity';

import { INodeBaseMetricLabels } from '@scheduler/metrics-providers';
import { JOBS_INTERVALS } from '@scheduler/intervals';

interface AxmMonitorMetric {
    value: string | number;
    type: string;
    unit?: string;
    historic: boolean;
}

interface AxmMonitor {
    'Used Heap Size': AxmMonitorMetric;
    'Heap Usage': AxmMonitorMetric;
    'Heap Size': AxmMonitorMetric;
    'Event Loop Latency p95': AxmMonitorMetric;
    'Event Loop Latency': AxmMonitorMetric;
    'Active handles': AxmMonitorMetric;
    'Active requests': AxmMonitorMetric;
    HTTP: AxmMonitorMetric;
    'HTTP P95 Latency': AxmMonitorMetric;
    'HTTP Mean Latency': AxmMonitorMetric;
}

=======
import { RuntimeMetric } from '@common/runtime-metrics/interfaces';
import { RawCacheService } from '@common/raw-cache';
import { TResult } from '@common/types';
import { INTERNAL_CACHE_KEYS, METRIC_NAMES } from '@libs/contracts/constants';

import { GetShortUserStatsQuery } from '@modules/users/queries/get-short-user-stats/get-short-user-stats.query';
import { GetAllNodesQuery } from '@modules/nodes/queries/get-all-nodes/get-all-nodes.query';
import { GetNodesSystemStatsQuery } from '@modules/nodes/queries/get-nodes-system-stats';
import { ShortUserStats } from '@modules/users/interfaces/user-stats.interface';
import { NodesEntity } from '@modules/nodes/entities/nodes.entity';

import {
    INodeBaseMetricLabels,
    INodeMetricLabel,
    INodeSystemMetricLabels,
} from '@scheduler/metrics-providers';
import { JOBS_INTERVALS } from '@scheduler/intervals';

>>>>>>> upstream/main
@Injectable()
export class ExportMetricsTask {
    private static readonly CRON_NAME = 'exportMetrics';
    private readonly logger = new Logger(ExportMetricsTask.name);

    private convert: (
        value?: number | undefined,
    ) => Converter<AllMeasures, AllMeasuresSystems, AllMeasuresUnits, number>;

    private cachedUserStats: ShortUserStats | null;
    private lastUserStatsUpdateTime: number;
    private readonly CACHE_TTL_MS: number;

    constructor(
<<<<<<< HEAD
=======
        private readonly rawCacheService: RawCacheService,
>>>>>>> upstream/main
        @InjectMetric(METRIC_NAMES.USERS_STATUS) public usersStatus: Gauge<string>,
        @InjectMetric(METRIC_NAMES.USERS_ONLINE_STATS) public usersOnlineStats: Gauge<string>,
        @InjectMetric(METRIC_NAMES.USERS_TOTAL) public usersTotal: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_ONLINE_USERS) public nodeOnlineUsers: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_STATUS) public nodeStatus: Gauge<string>,
<<<<<<< HEAD
        @InjectMetric(METRIC_NAMES.NODEJS_HEAP_USED_BYTES)
        public nodejsHeapUsedBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_HEAP_TOTAL_BYTES)
        public nodejsHeapTotalBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_HEAP_USAGE_PERCENT)
        public nodejsHeapUsagePercent: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_ACTIVE_HANDLERS)
        public nodejsActiveHandlers: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_ACTIVE_REQUESTS)
        public nodejsActiveRequests: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_EVENT_LOOP_LATENCY_P50)
        public nodejsEventLoopLatencyP50: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_EVENT_LOOP_LATENCY_P95)
        public nodejsEventLoopLatencyP95: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_CPU_USAGE_PERCENT)
        public nodejsCpuUsagePercent: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_MEMORY_USAGE_BYTES)
        public nodejsMemoryUsageBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_HTTP_REQ_RATE)
        public nodejsHttpReqRate: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_HTTP_REQ_LATENCY_P95)
        public nodejsHttpReqLatencyP95: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODEJS_HTTP_REQ_LATENCY_P50)
        public nodejsHttpReqLatencyP50: Gauge<string>,
=======

        @InjectMetric(METRIC_NAMES.PROCESS_RSS_BYTES)
        public processRssBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_HEAP_USED_BYTES)
        public processHeapUsedBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_HEAP_TOTAL_BYTES)
        public processHeapTotalBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_EXTERNAL_BYTES)
        public processExternalBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_ARRAY_BUFFERS_BYTES)
        public processArrayBuffersBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_EVENT_LOOP_DELAY_MS)
        public processEventLoopDelayMs: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_EVENT_LOOP_P99_MS)
        public processEventLoopP99Ms: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_ACTIVE_HANDLES)
        public processActiveHandles: Gauge<string>,
        @InjectMetric(METRIC_NAMES.PROCESS_UPTIME_SECONDS)
        public processUptimeSeconds: Gauge<string>,

        @InjectMetric(METRIC_NAMES.NODE_NETWORK_RX_BYTES_PER_SEC)
        public nodeNetworkRxBytesPerSec: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_NETWORK_TX_BYTES_PER_SEC)
        public nodeNetworkTxBytesPerSec: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_NETWORK_RX_BYTES_TOTAL)
        public nodeNetworkRxBytesTotal: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_NETWORK_TX_BYTES_TOTAL)
        public nodeNetworkTxBytesTotal: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_MEMORY_TOTAL_BYTES)
        public nodeMemoryTotalBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_MEMORY_FREE_BYTES)
        public nodeMemoryFreeBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_UPTIME_SECONDS)
        public nodeUptimeSeconds: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_CPU_COUNT)
        public nodeCpuCount: Gauge<string>,

        @InjectMetric(METRIC_NAMES.NODE_SYSTEM_INFO)
        public nodeSystemInfo: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_BASIC_INFO)
        public nodeBasicInfo: Gauge<string>,

>>>>>>> upstream/main
        private readonly queryBus: QueryBus,
    ) {
        this.lastUserStatsUpdateTime = 0;
        this.CACHE_TTL_MS = 60000;
        this.cachedUserStats = null;
        this.convert = configureMeasurements(allMeasures);
    }

    @Cron(JOBS_INTERVALS.METRIC_EXPORT_METRICS, {
        name: ExportMetricsTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            await this.reportShortUserStats();
            await this.reportNodesStats();
<<<<<<< HEAD
            await this.reportPm2Stats();
=======
            await this.reportRuntimeMetrics();
>>>>>>> upstream/main
        } catch (error) {
            this.logger.error(`Error in ExportMetricsTask: ${error}`);
        }
    }

    private async reportShortUserStats() {
        try {
            const currentTime = Date.now();
            const shouldUpdateCache =
                !this.cachedUserStats ||
                currentTime - this.lastUserStatsUpdateTime > this.CACHE_TTL_MS;

            if (shouldUpdateCache) {
                // this.logger.debug('Updating user stats cache from database...');
                const usersResponse = await this.getShortUserStats();

                if (!usersResponse.isOk) {
                    return;
                }

                this.cachedUserStats = usersResponse.response;
                this.lastUserStatsUpdateTime = currentTime;

                // this.logger.debug(
                //     `User stats cache updated successfully at ${new Date().toISOString()}`,
                // );
            } else {
                // this.logger.debug('Using cached user stats (less than 1 minute old)');
            }

            if (this.cachedUserStats) {
                const stats = this.cachedUserStats;

                Object.entries(stats.statusCounts.statusCounts).forEach(([status, count]) => {
                    this.usersStatus.set({ status }, count);
                });

                Object.entries(stats.onlineStats).forEach(([metricType, value]) => {
                    this.usersOnlineStats.set({ metricType }, value);
                });

                this.usersTotal.set({ type: 'all' }, stats.statusCounts.totalUsers);

                // this.logger.debug(
                //     `Short users stats metrics updated from ${shouldUpdateCache ? 'fresh' : 'cached'} data.`,
                // );
            }
        } catch (error) {
            this.logger.error(`Error in reportShortUserStats: ${error}`);
        }
    }

    private async reportNodesStats() {
        try {
            const nodesResponse = await this.getAllNodes();
            if (!nodesResponse.isOk) {
                return;
            }

            const nodes = nodesResponse.response;

<<<<<<< HEAD
            nodes.forEach((node) => {
                this.nodeOnlineUsers.set(
                    {
                        node_uuid: node.uuid,
                        node_name: node.name,
                        node_country_emoji: resolveCountryEmoji(node.countryCode),
                        provider_name: node.provider?.name || 'unknown',
                        tags: node.tags.join(','),
                    } satisfies INodeBaseMetricLabels,
                    node.usersOnline ?? 0,
                );

                this.nodeStatus.set(
                    {
                        node_uuid: node.uuid,
                        node_name: node.name,
                        node_country_emoji: resolveCountryEmoji(node.countryCode),
                        provider_name: node.provider?.name || 'unknown',
                        tags: node.tags.join(','),
                    } satisfies INodeBaseMetricLabels,
                    node.isConnected ? 1 : 0,
                );
=======
            this.nodeBasicInfo.reset();
            this.nodeSystemInfo.reset();

            const nodesSystemStats = await this.queryBus.execute(
                new GetNodesSystemStatsQuery(nodes.map((node) => ({ uuid: node.uuid }))),
            );

            nodes.forEach((node) => {
                const infoLabels = {
                    node_uuid: node.uuid,
                    node_name: node.name,
                    node_country_emoji: resolveCountryEmoji(node.countryCode),
                    provider_name: node.provider?.name || 'unknown',
                    tags: node.tags.join(','),
                } satisfies INodeBaseMetricLabels;

                this.nodeBasicInfo.set(infoLabels, 1);

                const baseNodeLabels = {
                    node_uuid: node.uuid,
                } satisfies INodeMetricLabel;

                this.nodeStatus.set(baseNodeLabels, node.isConnected ? 1 : 0);

                if (nodesSystemStats.isOk && nodesSystemStats.response.get(node.uuid)) {
                    const nodeSystemStats = nodesSystemStats.response.get(node.uuid);

                    if (nodeSystemStats) {
                        this.nodeOnlineUsers.set(baseNodeLabels, nodeSystemStats.onlineUsers);
                    }

                    if (nodeSystemStats && nodeSystemStats.system) {
                        this.nodeSystemInfo.set(
                            {
                                node_uuid: node.uuid,
                                arch: nodeSystemStats.system.info.arch,
                                cpu_model: nodeSystemStats.system.info.cpuModel,
                                hostname: nodeSystemStats.system.info.hostname,
                                platform: nodeSystemStats.system.info.platform,
                                release: nodeSystemStats.system.info.release,
                                version: nodeSystemStats.system.info.version,
                            } satisfies INodeSystemMetricLabels,
                            1,
                        );

                        this.nodeMemoryTotalBytes.set(
                            baseNodeLabels,
                            nodeSystemStats.system.info.memoryTotal,
                        );
                        this.nodeMemoryFreeBytes.set(
                            baseNodeLabels,
                            nodeSystemStats.system.stats.memoryFree,
                        );

                        this.nodeUptimeSeconds.set(
                            baseNodeLabels,
                            nodeSystemStats.system.stats.uptime,
                        );
                        this.nodeCpuCount.set(baseNodeLabels, nodeSystemStats.system.info.cpus);

                        if (nodeSystemStats && nodeSystemStats.system.stats.interface) {
                            this.nodeNetworkRxBytesPerSec.set(
                                baseNodeLabels,
                                nodeSystemStats.system.stats.interface.rxBytesPerSec,
                            );
                            this.nodeNetworkTxBytesPerSec.set(
                                baseNodeLabels,
                                nodeSystemStats.system.stats.interface.txBytesPerSec,
                            );
                            this.nodeNetworkRxBytesTotal.set(
                                baseNodeLabels,
                                nodeSystemStats.system.stats.interface.rxTotal,
                            );
                            this.nodeNetworkTxBytesTotal.set(
                                baseNodeLabels,
                                nodeSystemStats.system.stats.interface.txTotal,
                            );
                        } else {
                            this.removeNodeSystemMetrics(baseNodeLabels);
                        }
                    } else {
                        this.removeNodeSystemMetrics(baseNodeLabels);
                    }
                } else {
                    this.removeNodeSystemMetrics(baseNodeLabels);
                }
>>>>>>> upstream/main
            });
        } catch (error) {
            this.logger.error(`Error in reportNodesStats: ${error}`);
        }
    }

    private async getShortUserStats(): Promise<TResult<ShortUserStats>> {
        return this.queryBus.execute<GetShortUserStatsQuery, TResult<ShortUserStats>>(
            new GetShortUserStatsQuery(),
        );
    }

    private async getAllNodes(): Promise<TResult<NodesEntity[]>> {
        return this.queryBus.execute<GetAllNodesQuery, TResult<NodesEntity[]>>(
            new GetAllNodesQuery(),
        );
    }

<<<<<<< HEAD
    public async reportPm2Stats() {
        const list = await new Promise<pm2.ProcessDescription[]>((resolve, reject) => {
            pm2.list((err, processes) => {
                if (err) {
                    this.logger.error('Error getting PM2 processes:', err);
                    reject(err);
                } else {
                    resolve(processes);
                }
            });
        });

        for (const process of list) {
            try {
                if (process.pm2_env) {
                    if (
                        'INSTANCE_ID' in process.pm2_env &&
                        typeof process.pm2_env.INSTANCE_ID === 'number' &&
                        'axm_monitor' in process.pm2_env
                    ) {
                        const axmMonitor = process.pm2_env.axm_monitor as AxmMonitor;

                        if (axmMonitor['Used Heap Size']?.value !== undefined) {
                            this.nodejsHeapUsedBytes.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                this.convertToBytes(
                                    axmMonitor['Used Heap Size'].value,
                                    axmMonitor['Used Heap Size'].unit || 'B',
                                ),
                            );
                        }

                        this.nodejsHeapTotalBytes.set(
                            {
                                instance_id: process.pm2_env.INSTANCE_ID,
                                instance_name: process.name,
                            },
                            this.convertToBytes(
                                axmMonitor['Heap Size'].value,
                                axmMonitor['Heap Size'].unit || 'B',
                            ),
                        );

                        if (axmMonitor['Heap Usage']?.value !== undefined) {
                            this.nodejsHeapUsagePercent.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                Number(axmMonitor['Heap Usage'].value),
                            );
                        }

                        if (axmMonitor['Active handles']?.value !== undefined) {
                            this.nodejsActiveHandlers.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                Number(axmMonitor['Active handles'].value),
                            );
                        }

                        if (axmMonitor['Active requests']?.value !== undefined) {
                            this.nodejsActiveRequests.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                Number(axmMonitor['Active requests'].value),
                            );
                        }

                        if (axmMonitor['Event Loop Latency p95']?.value !== undefined) {
                            this.nodejsEventLoopLatencyP95.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                this.convert(Number(axmMonitor['Event Loop Latency p95'].value))
                                    .from(axmMonitor['Event Loop Latency p95'].unit || 'ms')
                                    .to('ms'),
                            );
                        }

                        if (axmMonitor['Event Loop Latency']?.value !== undefined) {
                            this.nodejsEventLoopLatencyP50.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                this.convert(Number(axmMonitor['Event Loop Latency'].value))
                                    .from(axmMonitor['Event Loop Latency'].unit || 'ms')
                                    .to('ms'),
                            );
                        }

                        this.nodejsCpuUsagePercent.set(
                            {
                                instance_id: process.pm2_env.INSTANCE_ID,
                                instance_name: process.name,
                            },
                            process.monit?.cpu || 0,
                        );

                        this.nodejsMemoryUsageBytes.set(
                            {
                                instance_id: process.pm2_env.INSTANCE_ID,
                                instance_name: process.name,
                            },
                            this.convertToBytes(process.monit?.memory || 0, 'B'),
                        );

                        if (axmMonitor['HTTP']?.value !== undefined) {
                            this.nodejsHttpReqRate.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                Number(axmMonitor['HTTP'].value),
                            );
                        }

                        if (axmMonitor['HTTP P95 Latency']?.value !== undefined) {
                            this.nodejsHttpReqLatencyP95.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                this.convert(Number(axmMonitor['HTTP P95 Latency'].value))
                                    .from(axmMonitor['HTTP P95 Latency'].unit || 'ms')
                                    .to('ms'),
                            );
                        }

                        if (axmMonitor['HTTP Mean Latency']?.value !== undefined) {
                            this.nodejsHttpReqLatencyP50.set(
                                {
                                    instance_id: process.pm2_env.INSTANCE_ID,
                                    instance_name: process.name,
                                },
                                this.convert(Number(axmMonitor['HTTP Mean Latency'].value))
                                    .from(axmMonitor['HTTP Mean Latency'].unit || 'ms')
                                    .to('ms'),
                            );
                        }
                    }
                }
            } catch (error) {
                this.logger.warn(`Error in reportPm2Stats for process ${process.name}: ${error}`);
                continue;
            }
        }

        return;
    }

    private convertToBytes(value: string | number, unit: string): number {
        const [ok, error, parsedValue] = t(xbytes.parseSize, `${value} ${unit}`, { iec: true });

        if (!ok) {
            this.logger.error(`Error converting ${value} ${unit} to bytes: ${error}`);
            return 0;
        }

        return parsedValue;
=======
    public async reportRuntimeMetrics() {
        try {
            const raw = await this.rawCacheService.hgetallParsed<Record<string, RuntimeMetric>>(
                INTERNAL_CACHE_KEYS.RUNTIME_METRICS,
            );

            if (!raw) {
                return;
            }

            for (const m of Object.values(raw)) {
                const labels = { instance_id: m.instanceId, instance_name: m.instanceType };

                this.processRssBytes.set(labels, m.rss);
                this.processHeapUsedBytes.set(labels, m.heapUsed);
                this.processHeapTotalBytes.set(labels, m.heapTotal);
                this.processExternalBytes.set(labels, m.external);
                this.processArrayBuffersBytes.set(labels, m.arrayBuffers);
                this.processEventLoopDelayMs.set(labels, m.eventLoopDelayMs);
                this.processEventLoopP99Ms.set(labels, m.eventLoopP99Ms);
                this.processActiveHandles.set(labels, m.activeHandles);
                this.processUptimeSeconds.set(labels, m.uptime);
            }
        } catch (error) {
            this.logger.error(`Error in reportRuntimeMetrics: ${error}`);
        }
    }

    private removeNodeSystemMetrics(baseNodeLabels: INodeMetricLabel) {
        this.nodeMemoryTotalBytes.remove({ node_uuid: baseNodeLabels.node_uuid });
        this.nodeMemoryFreeBytes.remove({ node_uuid: baseNodeLabels.node_uuid });
        this.nodeUptimeSeconds.remove({ node_uuid: baseNodeLabels.node_uuid });
        this.nodeCpuCount.remove({ node_uuid: baseNodeLabels.node_uuid });
        this.nodeNetworkRxBytesPerSec.remove({ node_uuid: baseNodeLabels.node_uuid });
        this.nodeNetworkRxBytesTotal.remove({ node_uuid: baseNodeLabels.node_uuid });
        this.nodeNetworkTxBytesPerSec.remove({ node_uuid: baseNodeLabels.node_uuid });
        this.nodeNetworkTxBytesTotal.remove({ node_uuid: baseNodeLabels.node_uuid });
>>>>>>> upstream/main
    }
}
