import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SubscriptionImportSourceController } from './subscription-import-source.controller';
import { SubscriptionImportSourceConverter } from './subscription-import-source.converter';
import { SubscriptionImportSourceRepository } from './repositories/subscription-import-source.repository';
import { SubscriptionImportSourceService } from './subscription-import-source.service';
import { SubscriptionFetchService } from './services/subscription-fetch.service';

@Module({
    imports: [CqrsModule],
    controllers: [SubscriptionImportSourceController],
    providers: [
        SubscriptionImportSourceRepository,
        SubscriptionImportSourceConverter,
        SubscriptionImportSourceService,
        SubscriptionFetchService,
    ],
    exports: [SubscriptionImportSourceService],
})
export class SubscriptionImportSourceModule {}
