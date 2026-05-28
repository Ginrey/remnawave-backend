import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { ImportSourceGeoIpClassifierService } from './services/import-source-geoip-classifier.service';
import { SubscriptionTemplateRepository } from './repositories/subscription-template.repository';
import { ResolveProxyConfigService } from './resolve-proxy/resolve-proxy-config.service';
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
        ImportSourceGeoIpClassifierService,
        ResolveProxyConfigService,
        ...TEMPLATE_RENDERERS,
        RenderTemplatesService,
        ...QUERIES,
    ],
    exports: [
        SubscriptionTemplateService,
        ImportSourceGeoIpClassifierService,
        RenderTemplatesService,
        ...TEMPLATE_RENDERERS,
        ResolveProxyConfigService,
    ],
})
export class SubscriptionTemplateModule {}
