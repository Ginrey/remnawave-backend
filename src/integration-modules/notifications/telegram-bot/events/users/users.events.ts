import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

import { NotificationsConfigService } from '@common/config/common-config';
import { TUserEvents } from '@libs/contracts/constants';

import { UserEvent } from '@integration-modules/notifications/interfaces';

import { TelegramBotLoggerQueueService } from '@queue/notifications/telegram-bot-logger';

import { USERS_EVENTS_TEMPLATES } from './users.events.templates';

type EventHandler = (event: UserEvent) => string | null;

@Injectable()
export class UsersEvents implements OnApplicationBootstrap {
<<<<<<< HEAD
    private readonly adminId: string | undefined;
    private readonly adminThreadId: string | undefined;
=======
    private readonly chatId: string | undefined;
    private readonly threadId: string | undefined;
>>>>>>> upstream/main
    private readonly logger = new Logger(UsersEvents.name);

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly notificationsConfig: NotificationsConfigService,
        private readonly telegramQueue: TelegramBotLoggerQueueService,
        private readonly configService: ConfigService,
    ) {
<<<<<<< HEAD
        this.adminId = this.configService.get<string>('TELEGRAM_NOTIFY_USERS_CHAT_ID');
        this.adminThreadId = this.configService.get<string>('TELEGRAM_NOTIFY_USERS_THREAD_ID');
=======
        const chatId = this.configService.get<string>('TELEGRAM_NOTIFY_USERS');
        if (chatId) {
            [this.chatId, this.threadId] = chatId.split(':');
        }
>>>>>>> upstream/main
    }

    async onApplicationBootstrap(): Promise<void> {
        this.registerEnabledListeners();
    }

    private registerEnabledListeners(): void {
<<<<<<< HEAD
        if (!this.adminId) return;
=======
        if (!this.chatId) return;
>>>>>>> upstream/main

        for (const [eventName, template] of Object.entries(USERS_EVENTS_TEMPLATES)) {
            if (!this.notificationsConfig.isEnabled(eventName as TUserEvents, 'telegram')) {
                this.logger.debug(
                    `[USERS_EVENTS] Event "${eventName}" is not enabled for Telegram.`,
                );
                continue;
            }

            this.eventEmitter.on(eventName, async (event: UserEvent) => {
                await this.handleEvent(event, template);
            });
        }
    }

    private async handleEvent(event: UserEvent, template: EventHandler): Promise<void> {
        const message = template(event);

        if (!message) return;

        await this.telegramQueue.addJobToSendTelegramMessage({
            message,
<<<<<<< HEAD
            chatId: this.adminId!,
            threadId: this.adminThreadId,
=======
            chatId: this.chatId!,
            threadId: this.threadId,
>>>>>>> upstream/main
        });
    }
}
