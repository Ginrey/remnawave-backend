import { NestjsGrammyModule } from '@kastov/grammy-nestjs';
<<<<<<< HEAD
=======
import { ProxyAgent } from 'proxy-agent';
>>>>>>> upstream/main

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { BOT_NAME } from './constants/bot-name.constant';
import { BotUpdateService } from './bot.update.service';
import { TELEGRAM_BOT_EVENTS } from './events';

@Module({
    imports: [
        ConfigModule,
        NestjsGrammyModule.forRootAsync({
            imports: [ConfigModule],
            botName: BOT_NAME,
<<<<<<< HEAD
            useFactory: async (configService: ConfigService) => ({
                token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
                disableUpdates: true,
            }),
=======
            useFactory: async (configService: ConfigService) => {
                let agent: ProxyAgent | undefined = undefined;

                const token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
                const apiRoot = configService.getOrThrow<string>('TELEGRAM_BOT_API_ROOT');
                const proxy = configService.get<string>('TELEGRAM_BOT_PROXY');

                if (proxy) {
                    agent = new ProxyAgent({
                        getProxyForUrl: () => proxy,
                    });
                }

                return {
                    token: token,
                    disableUpdates: true,
                    options: {
                        client: {
                            apiRoot: apiRoot,
                            baseFetchConfig: {
                                agent,
                                compress: true,
                            },
                        },
                    },
                };
            },
>>>>>>> upstream/main

            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [BotUpdateService, ...TELEGRAM_BOT_EVENTS],
})
export class TelegramBotModule {}
