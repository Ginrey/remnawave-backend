import { z } from 'zod';

import { SUBSCRIPTION_IMPORT_SOURCES_ROUTES, REST_API } from '../../api';
import { getEndpointDetails } from '../../constants';
import { SubscriptionImportSourceSchema } from '../../models';

export namespace UpdateSubscriptionImportSourceCommand {
    export const url = (uuid: string) => REST_API.SUBSCRIPTION_IMPORT_SOURCES.UPDATE(uuid);
    export const TSQ_url = url(':uuid');

    export const endpointDetails = getEndpointDetails(
        SUBSCRIPTION_IMPORT_SOURCES_ROUTES.UPDATE(':uuid'),
        'patch',
        'Update subscription import source',
    );

    export const RequestSchema = z.object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name must be less than 100 characters')
            .optional(),
        url: z.string().url('Must be a valid URL').optional(),
        isEnabled: z.boolean().optional(),
        fetchIntervalMinutes: z.number().int().min(5).max(1440).optional(),
        configProfileInboundUuid: z.string().uuid().nullable().optional(),
        importGroup: z.string().min(1).max(100).nullable().optional(),
        fetchHeaders: z.record(z.string()).nullable().optional(),
    });

    export type Request = z.infer<typeof RequestSchema>;

    export const ResponseSchema = z.object({
        response: SubscriptionImportSourceSchema,
    });

    export type Response = z.infer<typeof ResponseSchema>;
}
