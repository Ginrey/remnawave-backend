<<<<<<< HEAD
import { IRawHost } from '@modules/subscription-template/generators/interfaces';
=======
import { ResolvedProxyConfig } from '@modules/subscription-template/resolve-proxy/interfaces';
>>>>>>> upstream/main
import { GetFullUserResponseModel } from '@modules/users/models';

import { ISubscriptionHeaders } from '../interfaces';

export class RawSubscriptionWithHostsResponse {
    public user: GetFullUserResponseModel;
    public convertedUserInfo: {
        daysLeft: number;
        trafficLimit: string;
        trafficUsed: string;
        lifetimeTrafficUsed: string;
        isHwidLimited: boolean;
    };
<<<<<<< HEAD
    public rawHosts: IRawHost[];
=======
    public resolvedProxyConfigs: ResolvedProxyConfig[];
>>>>>>> upstream/main
    public headers: ISubscriptionHeaders;

    constructor(data: RawSubscriptionWithHostsResponse) {
        this.user = data.user;
        this.convertedUserInfo = data.convertedUserInfo;
<<<<<<< HEAD
        this.rawHosts = data.rawHosts;
=======
        this.resolvedProxyConfigs = data.resolvedProxyConfigs;
>>>>>>> upstream/main
        this.headers = data.headers;
    }
}
