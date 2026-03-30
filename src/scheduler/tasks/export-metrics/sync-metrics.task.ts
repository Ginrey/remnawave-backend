import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueryBus } from '@nestjs/cqrs';

import { resolveCountryEmoji } from '@common/utils/resolve-country-emoji';
import { METRIC_NAMES } from '@libs/contracts/constants';

import { GetAllNodesQuery } from '@modules/nodes/queries/get-all-nodes/get-all-nodes.query';

<<<<<<< HEAD
import { INodeBandwidthMetricLabels, INodeBaseMetricLabels } from '@scheduler/metrics-providers';
=======
import { INodeBaseMetricLabels } from '@scheduler/metrics-providers';
>>>>>>> upstream/main
import { JOBS_INTERVALS } from '@scheduler/intervals';

@Injectable()
export class SyncMetricsTask {
    private static readonly CRON_NAME = 'syncMetrics';
    private readonly logger = new Logger(SyncMetricsTask.name);

    constructor(
        @InjectMetric(METRIC_NAMES.NODE_ONLINE_USERS) public nodeOnlineUsers: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_STATUS) public nodeStatus: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_INBOUND_UPLOAD_BYTES)
        public nodeInboundUploadBytes: Counter<string>,
        @InjectMetric(METRIC_NAMES.NODE_INBOUND_DOWNLOAD_BYTES)
        public nodeInboundDownloadBytes: Counter<string>,
        @InjectMetric(METRIC_NAMES.NODE_OUTBOUND_UPLOAD_BYTES)
        public nodeOutboundUploadBytes: Counter<string>,
        @InjectMetric(METRIC_NAMES.NODE_OUTBOUND_DOWNLOAD_BYTES)
        public nodeOutboundDownloadBytes: Counter<string>,
<<<<<<< HEAD
=======
        @InjectMetric(METRIC_NAMES.NODE_MEMORY_TOTAL_BYTES)
        public nodeMemoryTotalBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_MEMORY_FREE_BYTES)
        public nodeMemoryFreeBytes: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_UPTIME_SECONDS)
        public nodeUptimeSeconds: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_CPU_COUNT)
        public nodeCpuCount: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_NETWORK_RX_BYTES_PER_SEC)
        public nodeNetworkRxBytesPerSec: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_NETWORK_TX_BYTES_PER_SEC)
        public nodeNetworkTxBytesPerSec: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_NETWORK_RX_BYTES_TOTAL)
        public nodeNetworkRxBytesTotal: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_NETWORK_TX_BYTES_TOTAL)
        public nodeNetworkTxBytesTotal: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_SYSTEM_INFO)
        public nodeSystemInfo: Gauge<string>,
        @InjectMetric(METRIC_NAMES.NODE_BASIC_INFO)
        public nodeBasicInfo: Gauge<string>,
>>>>>>> upstream/main
        private readonly queryBus: QueryBus,
    ) {}

    @Cron(JOBS_INTERVALS.METRIC_SYNC_METRICS, {
        name: SyncMetricsTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            await this.syncNodeMetrics();
        } catch (error) {
            this.logger.error(`Error in SyncMetricsTask: ${error}`);
        }
    }

    private async syncNodeMetrics(): Promise<void> {
        const nodesMap = new Map<string, INodeBaseMetricLabels>();

        try {
            const nodesResponse = await this.queryBus.execute(new GetAllNodesQuery());

<<<<<<< HEAD
            if (
                !nodesResponse.isOk ||
                !nodesResponse.response ||
                nodesResponse.response.length === 0
            ) {
=======
            if (!nodesResponse.isOk || !nodesResponse.response?.length) {
>>>>>>> upstream/main
                return;
            }

            for (const node of nodesResponse.response) {
                nodesMap.set(node.uuid, {
                    node_uuid: node.uuid,
                    node_name: node.name,
                    node_country_emoji: resolveCountryEmoji(node.countryCode),
                    provider_name: node.provider?.name || 'unknown',
                    tags: node.tags.join(','),
                });
            }

<<<<<<< HEAD
            const [
                { values: onlineUsersValues },
                { values: statusValues },
                { values: inboundUploadValues },
                { values: inboundDownloadValues },
                { values: outboundUploadValues },
                { values: outboundDownloadValues },
            ] = await Promise.all([
                this.nodeOnlineUsers.get(),
                this.nodeStatus.get(),
                this.nodeInboundUploadBytes.get(),
                this.nodeInboundDownloadBytes.get(),
                this.nodeOutboundUploadBytes.get(),
                this.nodeOutboundDownloadBytes.get(),
            ]);

            this.cleanupBaseMetrics(this.nodeOnlineUsers, onlineUsersValues, nodesMap);
            this.cleanupBaseMetrics(this.nodeStatus, statusValues, nodesMap);

            this.cleanupBandwidthMetrics(
                this.nodeInboundUploadBytes,
                inboundUploadValues,
                nodesMap,
            );
            this.cleanupBandwidthMetrics(
                this.nodeInboundDownloadBytes,
                inboundDownloadValues,
                nodesMap,
            );
            this.cleanupBandwidthMetrics(
                this.nodeOutboundUploadBytes,
                outboundUploadValues,
                nodesMap,
            );
            this.cleanupBandwidthMetrics(
                this.nodeOutboundDownloadBytes,
                outboundDownloadValues,
                nodesMap,
            );
=======
            const allMetrics: (Gauge<string> | Counter<string>)[] = [
                this.nodeOnlineUsers,
                this.nodeStatus,
                this.nodeMemoryTotalBytes,
                this.nodeMemoryFreeBytes,
                this.nodeUptimeSeconds,
                this.nodeCpuCount,
                this.nodeNetworkRxBytesPerSec,
                this.nodeNetworkTxBytesPerSec,
                this.nodeNetworkRxBytesTotal,
                this.nodeNetworkTxBytesTotal,
                this.nodeBasicInfo,
                this.nodeSystemInfo,
                this.nodeInboundUploadBytes,
                this.nodeInboundDownloadBytes,
                this.nodeOutboundUploadBytes,
                this.nodeOutboundDownloadBytes,
            ];

            for (const metric of allMetrics) {
                const { values } = await metric.get();
                for (const stat of values) {
                    if (!nodesMap.has(stat.labels.node_uuid as string)) {
                        metric.remove(stat.labels);
                    }
                }
            }
>>>>>>> upstream/main
        } catch (error) {
            this.logger.error(`Error in syncNodeMetrics: ${error}`);
        } finally {
            nodesMap.clear();
        }
    }
<<<<<<< HEAD

    private cleanupBaseMetrics(
        metric: Gauge<string>,
        values: any[],
        nodesMap: Map<string, INodeBaseMetricLabels>,
    ) {
        for (const stat of values) {
            const labels = stat.labels as INodeBaseMetricLabels;
            const existingNode = nodesMap.get(labels.node_uuid);

            if (!existingNode || !this.compareMetricLabels(existingNode, labels)) {
                metric.remove(stat.labels);
            }
        }
    }

    private cleanupBandwidthMetrics(
        metric: Counter<string>,
        values: any[],
        nodesMap: Map<string, INodeBaseMetricLabels>,
    ) {
        for (const stat of values) {
            const labels = stat.labels as INodeBandwidthMetricLabels;
            const existingNode = nodesMap.get(labels.node_uuid);

            if (!existingNode || !this.compareMetricLabels(existingNode, labels)) {
                metric.remove(stat.labels);
            }
        }
    }

    private compareMetricLabels(
        nodeA: INodeBaseMetricLabels,
        nodeB: INodeBaseMetricLabels | INodeBandwidthMetricLabels,
    ): boolean {
        return (
            nodeA.node_uuid === nodeB.node_uuid &&
            nodeA.node_name === nodeB.node_name &&
            nodeA.node_country_emoji === nodeB.node_country_emoji &&
            nodeA.provider_name === nodeB.provider_name &&
            nodeA.tags === nodeB.tags
        );
    }
=======
>>>>>>> upstream/main
}
