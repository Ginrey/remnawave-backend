import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { SubscriptionTemplateRepository } from './repositories/subscription-template.repository';
<<<<<<< HEAD
=======
import { ResolveProxyConfigService } from './resolve-proxy/resolve-proxy-config.service';
>>>>>>> upstream/main
import { SubscriptionTemplateController } from './subscription-template.controller';
import { SubscriptionTemplateConverter } from './subscription-template.converter';
import { SubscriptionTemplateService } from './subscription-template.service';
import { RenderTemplatesService } from './render-templates.service';
import { TEMPLATE_RENDERERS } from './generators';
import { QUERIES } from './queries';
@Module({
    imports: [CqrsModule],
    controllers: [SubscriptionTemplateController],
    providers: [
        SubscriptionTemplateService,
        SubscriptionTemplateRepository,
        SubscriptionTemplateConverter,
<<<<<<< HEAD
=======
        ResolveProxyConfigService,
>>>>>>> upstream/main
        ...TEMPLATE_RENDERERS,
        RenderTemplatesService,
        ...QUERIES,
    ],
<<<<<<< HEAD
    exports: [SubscriptionTemplateService, RenderTemplatesService, ...TEMPLATE_RENDERERS],
=======
    exports: [
        SubscriptionTemplateService,
        RenderTemplatesService,
        ...TEMPLATE_RENDERERS,
        ResolveProxyConfigService,
    ],
>>>>>>> upstream/main
})
export class SubscriptionTemplateModule {}
