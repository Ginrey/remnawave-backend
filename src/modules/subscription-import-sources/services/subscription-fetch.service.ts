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
            const userInfo = this.parseSubscriptionUserInfo(
                response.headers['subscription-userinfo'] as string | undefined,
            );

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
                lastUploadBytes: userInfo.upload,
                lastDownloadBytes: userInfo.download,
                lastTotalBytes: userInfo.total,
                lastExpireAt: userInfo.expire !== null ? new Date(userInfo.expire * 1000) : null,
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
     * Parse the `subscription-userinfo` response header.
     * Format: "upload=0; download=1021436710582; total=0; expire=1774032913"
     * Returns null for any field that is absent or cannot be parsed.
     */
    private parseSubscriptionUserInfo(header: string | undefined): {
        upload: bigint | null;
        download: bigint | null;
        total: bigint | null;
        expire: number | null;
    } {
        const result = { upload: null, download: null, total: null, expire: null } as {
            upload: bigint | null;
            download: bigint | null;
            total: bigint | null;
            expire: number | null;
        };

        if (!header) return result;

        for (const part of header.split(';')) {
            const [key, value] = part.trim().split('=');
            if (!key || value === undefined) continue;
            const k = key.trim();
            const v = value.trim();
            if (k === 'upload') result.upload = BigInt(v);
            else if (k === 'download') result.download = BigInt(v);
            else if (k === 'total') result.total = BigInt(v);
            else if (k === 'expire') result.expire = Number(v);
        }

        return result;
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
