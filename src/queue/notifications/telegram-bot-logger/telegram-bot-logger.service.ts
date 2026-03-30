import { Queue } from 'bullmq';
import _ from 'lodash';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { AbstractQueueService } from '../../queue.service';
import { TelegramBotLoggerJobNames } from './enums';
<<<<<<< HEAD
=======
import { IMessageEventPayload } from './interfaces';
>>>>>>> upstream/main
import { QUEUES_NAMES } from '../../queue.enum';

@Injectable()
export class TelegramBotLoggerQueueService
    extends AbstractQueueService
    implements OnApplicationBootstrap
{
    protected readonly logger: Logger = new Logger(
        _.upperFirst(_.camelCase(QUEUES_NAMES.NOTIFICATIONS.TELEGRAM)),
    );

    private _queue: Queue;

    get queue(): Queue {
        return this._queue;
    }

    constructor(
        @InjectQueue(QUEUES_NAMES.NOTIFICATIONS.TELEGRAM)
        private readonly telegramBotLoggerQueue: Queue,
    ) {
        super();
        this._queue = this.telegramBotLoggerQueue;
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.checkConnection();
        await this.queue.setGlobalConcurrency(200);
    }

<<<<<<< HEAD
    public async addJobToSendTelegramMessage(payload: {
        message: string;
        chatId: string;
        threadId: string | undefined;
    }) {
=======
    public async addJobToSendTelegramMessage(payload: IMessageEventPayload) {
>>>>>>> upstream/main
        return this.addJob(TelegramBotLoggerJobNames.sendTelegramMessage, payload);
    }

    public async rateLimit(seconds: number) {
        return this.queue.rateLimit(seconds * 1000);
    }
}
