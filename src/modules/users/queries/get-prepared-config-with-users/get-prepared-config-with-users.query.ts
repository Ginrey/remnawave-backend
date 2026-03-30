<<<<<<< HEAD
=======
import { XrayConfig } from 'xray-typed';

>>>>>>> upstream/main
import { Query } from '@nestjs/cqrs';

import { StartXrayCommand } from '@remnawave/node-contract';

<<<<<<< HEAD
import { IXrayConfig } from '@common/helpers/xray-config/interfaces';
=======
>>>>>>> upstream/main
import { TResult } from '@common/types';

import { ConfigProfileInboundEntity } from '@modules/config-profiles/entities';

export interface IGetPreparedConfigWithUsersResponse {
<<<<<<< HEAD
    config: IXrayConfig;
=======
    config: XrayConfig;
>>>>>>> upstream/main
    hashesPayload: StartXrayCommand.Request['internals']['hashes'];
}

export class GetPreparedConfigWithUsersQuery extends Query<
    TResult<IGetPreparedConfigWithUsersResponse>
> {
    constructor(
        public readonly configProfileUuid: string,
        public readonly activeInbounds: ConfigProfileInboundEntity[],
    ) {
        super();
    }
}
