export class GetSubscriptionRequestHistoryStatsResponseModel {
    public readonly byParsedApp: { app: string; count: number }[];
    public readonly hourlyRequestStats: { dateTime: Date; requestCount: number }[];
    public readonly uniqueUsersLast24h: number;

    constructor(data: GetSubscriptionRequestHistoryStatsResponseModel) {
        this.byParsedApp = data.byParsedApp;
        this.hourlyRequestStats = data.hourlyRequestStats;
        this.uniqueUsersLast24h = data.uniqueUsersLast24h;
    }
}
