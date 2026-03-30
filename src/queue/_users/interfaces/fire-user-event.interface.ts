<<<<<<< HEAD
import { TUserEvents } from '@libs/contracts/constants';

import { IMetaInfo } from '@integration-modules/notifications/interfaces/meta-info.interface';

=======
import { TTorrentBlockerEvents, TUserEvents } from '@libs/contracts/constants';

import { IMetaInfo } from '@integration-modules/notifications/interfaces/meta-info.interface';

import { ITorrentBlockerReport } from '@modules/node-plugins/interfaces';

>>>>>>> upstream/main
export interface IFireUserEventPayload {
    users: { tId: bigint }[];
    userEvent: TUserEvents;
    skipTelegramNotification?: boolean;
    meta?: IMetaInfo;
}

export interface IFireUserEventJobData {
    tId: string;
    meta?: IMetaInfo;
    userEvent: TUserEvents;
    skipTelegramNotification?: boolean;
}
<<<<<<< HEAD
=======

export interface IFireTorrentBlockerEventJobData {
    event: TTorrentBlockerEvents;
    tId: string;
    nodeUuid: string;
    report: ITorrentBlockerReport;
    skipTelegramNotification?: boolean;
}
>>>>>>> upstream/main
