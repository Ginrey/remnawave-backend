import { z } from 'zod';

import { SUBSCRIPTION_IMPORT_SOURCES_ROUTES, REST_API } from '../../api';
import { getEndpointDetails } from '../../constants';
import { SubscriptionImportSourceSchema } from '../../models';

export namespace GetSubscriptionImportSourcesCommand {
    export const url = REST_API.SUBSCRIPTION_IMPORT_SOURCES.GET;
    export const TSQ_url = url;

    export const endpointDetails = getEndpointDetails(
        SUBSCRIPTION_IMPORT_SOURCES_ROUTES.GET,
        'get',
        'Get all subscription import sources',
    );

    export const ResponseSchema = z.object({
        response: z.object({
            total: z.number(),
            importSources: z.array(SubscriptionImportSourceSchema),
        }),
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
