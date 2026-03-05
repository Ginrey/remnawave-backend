import axios from 'axios';

import { Injectable, Logger } from '@nestjs/common';

import { IMPORT_FETCH_STATUS } from '@libs/contracts/models';

import { SubscriptionImportSourceRepository } from '../repositories/subscription-import-source.repository';
import { SubscriptionImportSourceEntity } from '../entities';

/** Protocols we accept from external subscriptions */
const ACCEPTED_PROTOCOLS = [
    'vless://',
    'vmess://',
    'trojan://',
    'ss://',
    'hysteria2://',
    'hy2://',
    'tuic://',
    'reality://',
    'shadowsocks://',
];

@Injectable()
export class SubscriptionFetchService {
    private readonly logger = new Logger(SubscriptionFetchService.name);

    constructor(
        private readonly importSourceRepository: SubscriptionImportSourceRepository,
    ) {}

    /**
     * Fetch the external subscription URL and cache raw proxy lines.
     * Lines are stored verbatim so they reach clients unchanged.
     * Credentials (UUID, password, key) belong to the external server
     * and must never be modified by Remnawave.
     */
    public async fetchAndSync(source: SubscriptionImportSourceEntity): Promise<void> {
        this.logger.log(`Fetching import source "${source.name}" [${source.uuid}]`);

        try {
            const response = await axios.get<string>(source.url, {
                timeout: 30_000,
                responseType: 'text',
                headers: {
                    ...(source.fetchHeaders ?? {}),
                },
                maxRedirects: 5,
            });

            const rawLines = this.extractRawProxyLines(response.data);

            if (rawLines.length === 0) {
                this.logger.warn(
                    `No proxy lines found in source "${source.name}". ` +
                    `Response may be empty, unsupported format, or contain only Clash/JSON configs.`,
                );
            }

            await this.importSourceRepository.update({
                uuid: source.uuid,
                cachedRawLines: rawLines,
                lastFetchedAt: new Date(),
                lastFetchStatus: IMPORT_FETCH_STATUS.SUCCESS,
                lastFetchError: null,
                lastHostsCount: rawLines.length,
            });

            this.logger.log(
                `Cached ${rawLines.length} proxy lines from source "${source.name}"`,
            );
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to fetch source "${source.name}": ${errMsg}`);

            await this.importSourceRepository.update({
                uuid: source.uuid,
                lastFetchedAt: new Date(),
                lastFetchStatus: IMPORT_FETCH_STATUS.ERROR,
                lastFetchError: errMsg.slice(0, 500),
            });
        }
    }

    /**
     * Decode base64 if needed, then extract proxy URI lines.
     * Only lines starting with known VPN protocols are kept.
     * This guarantees the original credentials are preserved exactly.
     */
    private extractRawProxyLines(rawBody: string): string[] {
        const trimmed = rawBody.trim();
        let text = trimmed;

        // Try base64 decode — many subscription providers encode their response
        if (!/^(vless|vmess|trojan|ss|hysteria2|hy2|tuic|reality|shadowsocks):\/\//.test(trimmed)) {
            try {
                const decoded = Buffer.from(trimmed, 'base64').toString('utf-8');

                // Only use decoded version if it looks like proxy lines
                if (ACCEPTED_PROTOCOLS.some((p) => decoded.includes(p))) {
                    text = decoded;
                }
            } catch {
                // not base64, keep original
            }
        }

        return text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => ACCEPTED_PROTOCOLS.some((proto) => line.startsWith(proto)));
    }
}
