import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { PrometheusReporterModule } from '@integration-modules/prometheus-reporter/prometheus-reporter.module';
<<<<<<< HEAD
import { SubscriptionImportSourceModule } from '@modules/subscription-import-sources/subscription-import-source.module';
=======
>>>>>>> upstream/main

import { NodesMetricMessageController } from './tasks/export-metrics/nodes-metric-message.controller';
import { METRIC_PROVIDERS } from './metrics-providers';
import { ENQUEUE_SERVICES } from './enqueue';
import { EVENT_LISTENERS } from './events';
import { JOBS_SERVICES } from './tasks';

@Module({
<<<<<<< HEAD
    imports: [CqrsModule, PrometheusReporterModule, SubscriptionImportSourceModule],
=======
    imports: [CqrsModule, PrometheusReporterModule],
>>>>>>> upstream/main
    controllers: [NodesMetricMessageController],
    providers: [...ENQUEUE_SERVICES, ...JOBS_SERVICES, ...METRIC_PROVIDERS, ...EVENT_LISTENERS],
})
export class SchedulerModule {}
