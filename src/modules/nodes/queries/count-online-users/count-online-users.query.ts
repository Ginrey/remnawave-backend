<<<<<<< HEAD
export class CountOnlineUsersQuery {
    constructor() {}
=======
import { Query } from '@nestjs/cqrs';

import { TResult } from '@common/types';

export class CountOnlineUsersQuery extends Query<TResult<{ usersOnline: number }>> {
    constructor() {
        super();
    }
>>>>>>> upstream/main
}
