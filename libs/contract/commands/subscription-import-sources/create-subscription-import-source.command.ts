import { z } from 'zod';

import { SUBSCRIPTION_IMPORT_SOURCES_ROUTES, REST_API } from '../../api';
import { getEndpointDetails } from '../../constants';
import { SubscriptionImportSourceSchema } from '../../models';

export namespace CreateSubscriptionImportSourceCommand {
    export const url = REST_API.SUBSCRIPTION_IMPORT_SOURCES.CREATE;
    export const TSQ_url = url;

    export const endpointDetails = getEndpointDetails(
        SUBSCRIPTION_IMPORT_SOURCES_ROUTES.CREATE,
        'post',
        'Create subscription import source',
    );

    export const RequestSchema = z.object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name must be less than 100 characters'),
        url: z.string().url('Must be a valid URL'),
        isEnabled: z.boolean().default(true),
        fetchIntervalMinutes: z.number().int().min(5).max(1440).default(60),
        configProfileInboundUuid: z.string().uuid().nullable().optional(),
        fetchHeaders: z.record(z.string()).nullable().optional(),
    });

    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = z.object({
        response: SubscriptionImportSourceSchema,
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
