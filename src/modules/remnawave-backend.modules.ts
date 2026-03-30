import { ConditionalModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { isRestApi, isScheduler } from '@common/utils/startup-app';

<<<<<<< HEAD
import { SubscriptionImportSourceModule } from './subscription-import-sources/subscription-import-source.module';
=======
>>>>>>> upstream/main
import { UserSubscriptionRequestHistoryModule } from './user-subscription-request-history/user-subscription-request-history.module';
import { SubscriptionResponseRulesModule } from './subscription-response-rules/subscription-response-rules.module';
import { NodesTrafficUsageHistoryModule } from './nodes-traffic-usage-history/nodes-traffic-usage-history.module';
import { NodesUserUsageHistoryModule } from './nodes-user-usage-history/nodes-user-usage-history.module';
import { SubscriptionTemplateModule } from './subscription-template/subscription-template.module';
import { SubscriptionSettingsModule } from './subscription-settings/subscription-settings.module';
import { SubscriptionPageConfigModule } from './subscription-page-configs/subpage-configs.module';
import { NodesUsageHistoryModule } from './nodes-usage-history/nodes-usage-history.module';
import { RemnawaveSettingsModule } from './remnawave-settings/remnawave-settings.module';
import { RemnawaveServiceModule } from './remnawave-service/remnawave-service.module';
import { HwidUserDevicesModule } from './hwid-user-devices/hwid-user-devices.module';
import { ExternalSquadModule } from './external-squads/external-squads.module';
import { ConfigProfileModule } from './config-profiles/config-profile.module';
import { InternalSquadModule } from './internal-squads/internal-squad.module';
import { InfraBillingModule } from './infra-billing/infra-billing.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ApiTokensModule } from './api-tokens/api-tokens.module';
import { IpControlModule } from './ip-control/ip-control.module';
<<<<<<< HEAD
=======
import { MetadataModule } from './metadata/metadata.module';
>>>>>>> upstream/main
import { KeygenModule } from './keygen/keygen.module';
import { SystemModule } from './system/system.module';
import { HostsModule } from './hosts/hosts.module';
import { NodesModule } from './nodes/nodes.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
<<<<<<< HEAD
=======
import { NodePluginModule } from './node-plugins';
>>>>>>> upstream/main
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        RemnawaveSettingsModule,
        ConditionalModule.registerWhen(AdminModule, () => isRestApi()),
        ConditionalModule.registerWhen(AuthModule, () => isRestApi()),
        ConditionalModule.registerWhen(SubscriptionPageConfigModule, () => isRestApi()),
        UsersModule,
        ConditionalModule.registerWhen(SubscriptionResponseRulesModule, () => isRestApi()),
        ConditionalModule.registerWhen(SubscriptionModule, () => isRestApi()),
        ConditionalModule.registerWhen(ApiTokensModule, () => isRestApi()),
        ConfigProfileModule,
        InternalSquadModule,
        ExternalSquadModule,
        KeygenModule,
        NodesModule,
<<<<<<< HEAD
=======
        NodePluginModule,
>>>>>>> upstream/main
        NodesTrafficUsageHistoryModule,
        HostsModule,
        NodesUserUsageHistoryModule,
        HwidUserDevicesModule,
        NodesUsageHistoryModule,
        InfraBillingModule,
        UserSubscriptionRequestHistoryModule,
        ConditionalModule.registerWhen(SystemModule, () => isRestApi()),
        ConditionalModule.registerWhen(SubscriptionTemplateModule, () => isRestApi()),
        ConditionalModule.registerWhen(SubscriptionSettingsModule, () => isRestApi()),
        ConditionalModule.registerWhen(RemnawaveServiceModule, () => isScheduler()),
        ConditionalModule.registerWhen(IpControlModule, () => isRestApi()),
<<<<<<< HEAD
        ConditionalModule.registerWhen(SubscriptionImportSourceModule, () => isRestApi()),
=======
        ConditionalModule.registerWhen(MetadataModule, () => isRestApi()),
>>>>>>> upstream/main
    ],
})
export class RemnawaveModules {}
