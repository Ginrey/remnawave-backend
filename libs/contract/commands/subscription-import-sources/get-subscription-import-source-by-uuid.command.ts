import { z } from 'zod';

import { SUBSCRIPTION_IMPORT_SOURCES_ROUTES, REST_API } from '../../api';
import { getEndpointDetails } from '../../constants';
import { SubscriptionImportSourceSchema } from '../../models';

export namespace GetSubscriptionImportSourceByUuidCommand {
    export const url = REST_API.SUBSCRIPTION_IMPORT_SOURCES.GET_BY_UUID;
    export const TSQ_url = url(':uuid');

    export const endpointDetails = getEndpointDetails(
        SUBSCRIPTION_IMPORT_SOURCES_ROUTES.GET_BY_UUID(':uuid'),
        'get',
        'Get subscription import source by UUID',
    );

    export const RequestSchema = z.object({
        uuid: z.string().uuid(),
    });

    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = z.object({
        response: SubscriptionImportSourceSchema,
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
