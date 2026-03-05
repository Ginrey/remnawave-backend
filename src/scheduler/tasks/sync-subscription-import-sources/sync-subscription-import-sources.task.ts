import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SubscriptionImportSourceService } from '@modules/subscription-import-sources/subscription-import-source.service';

import { JOBS_INTERVALS } from '../../intervals';

@Injectable()
export class SyncSubscriptionImportSourcesTask {
    private static readonly CRON_NAME = 'syncSubscriptionImportSources';
    private readonly logger = new Logger(SyncSubscriptionImportSourcesTask.name);

    constructor(
        private readonly subscriptionImportSourceService: SubscriptionImportSourceService,
    ) {}

    @Cron(JOBS_INTERVALS.SYNC_SUBSCRIPTION_IMPORT_SOURCES, {
        name: SyncSubscriptionImportSourcesTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron(): Promise<void> {
        try {
            this.logger.debug('Running subscription import sources sync...');
            await this.subscriptionImportSourceService.syncDue();
        } catch (error) {
            this.logger.error('Error in SyncSubscriptionImportSourcesTask:', error);
        }
    }
}
