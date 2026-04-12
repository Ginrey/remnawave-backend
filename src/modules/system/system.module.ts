import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { UserSubscriptionRequestHistoryModule } from '@modules/user-subscription-request-history/user-subscription-request-history.module';
import { SubscriptionResponseRulesModule } from '@modules/subscription-response-rules/subscription-response-rules.module';

import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
    imports: [CqrsModule, SubscriptionResponseRulesModule, UserSubscriptionRequestHistoryModule],
    controllers: [SystemController],
    providers: [SystemService],
})
export class SystemModule {}
