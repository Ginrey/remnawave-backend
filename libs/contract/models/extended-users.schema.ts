import { z } from 'zod';

import { BaseInternalSquadSchema } from './base-internal-squad.schema';
import { UserTrafficSchema } from './user-traffic.schema';
import { UsersSchema } from './users.schema';

export const ExtendedUsersSchema = UsersSchema.extend({
    subscriptionUrl: z.string(),
    subscriptionPageUrl: z.string(),
    activeInternalSquads: z.array(BaseInternalSquadSchema),
    userTraffic: UserTrafficSchema,
});

export const PublicSubscriptionUserSchema = UsersSchema.pick({
    shortUuid: true,
    username: true,
    status: true,
    trafficLimitBytes: true,
    trafficLimitStrategy: true,
    expireAt: true,
    telegramId: true,
    email: true,
    description: true,
    tag: true,
    hwidDeviceLimit: true,
    externalSquadUuid: true,
    lastTriggeredThreshold: true,
    subRevokedAt: true,
    lastTrafficResetAt: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    subscriptionPageUrl: z.string(),
    happCryptoLink: z.string().nullable(),
    happCryptoLinkVersion: z.enum(['crypt5']).nullable(),
    userTraffic: UserTrafficSchema,
});
