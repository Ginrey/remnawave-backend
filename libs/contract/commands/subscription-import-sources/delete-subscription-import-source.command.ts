import { z } from 'zod';

import { SUBSCRIPTION_IMPORT_SOURCES_ROUTES, REST_API } from '../../api';
import { getEndpointDetails } from '../../constants';

export namespace DeleteSubscriptionImportSourceCommand {
    export const url = REST_API.SUBSCRIPTION_IMPORT_SOURCES.DELETE;
    export const TSQ_url = url(':uuid');

    export const endpointDetails = getEndpointDetails(
        SUBSCRIPTION_IMPORT_SOURCES_ROUTES.DELETE(':uuid'),
        'delete',
        'Delete subscription import source',
    );

    export const RequestSchema = z.object({
        uuid: z.string().uuid(),
    });

    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = z.object({
        response: z.object({
            isDeleted: z.boolean(),
        }),
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
