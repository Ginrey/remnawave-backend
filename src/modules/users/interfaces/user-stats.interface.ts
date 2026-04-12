import { TUsersStatus } from '@libs/contracts/constants';

export interface IUserOnlineStats {
    activeSubscriptionUpdatedLast24h: number;
    onlineNow: number;
    lastDay: number;
    lastWeek: number;
    neverOnline: number;
    subscriptionUpdatedLast24h: number;
}

export interface IUserStats {
    statusCounts: Record<TUsersStatus, number>;
    totalUsers: number;
}

export interface ShortUserStats {
    onlineStats: IUserOnlineStats;
    statusCounts: IUserStats;
}
