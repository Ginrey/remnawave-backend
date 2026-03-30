<<<<<<< HEAD
import { UpdateSubLastOpenedAndUserAgentHandler } from './update-sub-last-opened-and-user-agent';
=======
>>>>>>> upstream/main
import { BatchResetLimitedUsersTrafficHandler } from './batch-reset-limited-users-traffic';
import { TriggerThresholdNotificationHandler } from './trigger-threshold-notification';
import { BulkAllExtendExpirationDateHandler } from './bulk-all-extend-expiration-date';
import { BulkIncrementUsedTrafficHandler } from './bulk-increment-used-traffic';
import { UpdateExceededTrafficUsersHandler } from './update-exceeded-users';
import { RevokeUserSubscriptionHandler } from './revoke-user-subscription';
import { BatchResetUserTrafficHandler } from './batch-reset-user-traffic';
import { UpdateUserWithServiceHandler } from './update-user-with-service';
import { BulkDeleteByStatusHandler } from './bulk-delete-by-status';
import { BulkUpdateAllUsersHandler } from './bulk-update-all-users';
import { UpdateExpiredUsersHandler } from './update-expired-users';
import { ResetUserTrafficHandler } from './reset-user-traffic';
import { BulkSyncUsersHandler } from './bulk-sync-users';

export const COMMANDS = [
<<<<<<< HEAD
    UpdateSubLastOpenedAndUserAgentHandler,
=======
>>>>>>> upstream/main
    BatchResetUserTrafficHandler,
    UpdateExpiredUsersHandler,
    UpdateExceededTrafficUsersHandler,
    BatchResetLimitedUsersTrafficHandler,
    BulkIncrementUsedTrafficHandler,
    RevokeUserSubscriptionHandler,
    ResetUserTrafficHandler,
    UpdateUserWithServiceHandler,
    TriggerThresholdNotificationHandler,
    BulkDeleteByStatusHandler,
    BulkUpdateAllUsersHandler,
    BulkSyncUsersHandler,
    BulkAllExtendExpirationDateHandler,
];
