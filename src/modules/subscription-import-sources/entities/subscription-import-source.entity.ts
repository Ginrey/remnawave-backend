import { SubscriptionImportSources } from '@prisma/client';

export class SubscriptionImportSourceEntity implements SubscriptionImportSources {
    uuid: string;
    name: string;
    url: string;
    isEnabled: boolean;
    fetchIntervalMinutes: number;
    configProfileInboundUuid: string | null;
    lastFetchedAt: Date | null;
    lastFetchStatus: string | null;
    lastFetchError: string | null;
    lastHostsCount: number | null;
    cachedRawLines: string[];
    importGroup: string | null;
    fetchHeaders: PrismaJson.FetchHeaders | null;
    lastUploadBytes: bigint | null;
    lastDownloadBytes: bigint | null;
    lastTotalBytes: bigint | null;
    lastExpireAt: Date | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<SubscriptionImportSources>) {
        Object.assign(this, data);
    }
}
