import { ResolvedProxyConfig } from '@modules/subscription-template/resolve-proxy/interfaces';

import { PublicSubscriptionUserResponseModel } from './public-subscription-user.response.model';
import { ISubscriptionHeaders } from '../interfaces';

export class RawSubscriptionWithHostsResponse {
    public user: PublicSubscriptionUserResponseModel;
    public convertedUserInfo: {
        daysLeft: number;
        trafficLimit: string;
        trafficUsed: string;
        lifetimeTrafficUsed: string;
        isHwidLimited: boolean;
    };
    public resolvedProxyConfigs: ResolvedProxyConfig[];
    public headers: ISubscriptionHeaders;
    public templateValues: Record<string, string>;

    constructor(data: RawSubscriptionWithHostsResponse) {
        this.user = data.user;
        this.convertedUserInfo = data.convertedUserInfo;
        this.resolvedProxyConfigs = data.resolvedProxyConfigs;
        this.headers = data.headers;
        this.templateValues = data.templateValues;
    }
}
