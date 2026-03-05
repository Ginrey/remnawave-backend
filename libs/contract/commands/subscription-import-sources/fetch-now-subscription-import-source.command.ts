import { z } from 'zod';

import { SUBSCRIPTION_IMPORT_SOURCES_ROUTES, REST_API } from '../../api';
import { getEndpointDetails } from '../../constants';
import { SubscriptionImportSourceSchema } from '../../models';

export namespace FetchNowSubscriptionImportSourceCommand {
    export const url = REST_API.SUBSCRIPTION_IMPORT_SOURCES.ACTIONS.FETCH_NOW;
    export const TSQ_url = url(':uuid');

    export const endpointDetails = getEndpointDetails(
        SUBSCRIPTION_IMPORT_SOURCES_ROUTES.ACTIONS.FETCH_NOW(':uuid'),
        'post',
        'Trigger immediate fetch for import source',
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
