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

const PLACEHOLDER_ADDRESSES = new Set(['0.0.0.0', '::', '::0']);
const ZERO_UUID = '00000000-0000-0000-0000-000000000000';

function decodeBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const remainder = normalized.length % 4;
    const padded =
        remainder === 0 ? normalized : normalized.padEnd(normalized.length + (4 - remainder), '=');

    return Buffer.from(padded, 'base64').toString('utf-8');
}

function hasValidUrlProxyEndpoint(line: string): boolean {
    try {
        const url = new URL(line);
        const address = url.hostname;
        const port = Number(url.port);
        const username = decodeURIComponent(url.username);

        return Boolean(
            address &&
            !PLACEHOLDER_ADDRESSES.has(address) &&
            port > 1 &&
            username &&
            username !== ZERO_UUID,
        );
    } catch {
        return false;
    }
}

function hasValidVmessEndpoint(line: string): boolean {
    try {
        const encoded = line.slice(line.indexOf('://') + 3);
        const payload = JSON.parse(decodeBase64Url(encoded)) as Record<string, string>;

        return Boolean(
            payload.add &&
            !PLACEHOLDER_ADDRESSES.has(payload.add) &&
            Number(payload.port) > 1 &&
            payload.id &&
            payload.id !== ZERO_UUID,
        );
    } catch {
        return false;
    }
}

function hasValidShadowsocksEndpoint(line: string): boolean {
    try {
        const hashless = line.split('#', 1)[0];
        const queryless = hashless.split('?', 1)[0];
        const payload = queryless.slice(queryless.indexOf('://') + 3);
        let decoded = payload;

        if (!payload.includes('@')) {
            decoded = decodeBase64Url(payload);
        }

        const atIndex = decoded.lastIndexOf('@');
        if (atIndex === -1) return false;

        let credentials = decoded.slice(0, atIndex);
        const serverPart = decoded.slice(atIndex + 1);

        if (!credentials.includes(':')) {
            credentials = decodeBase64Url(credentials);
        }

        const separatorIndex = credentials.indexOf(':');
        if (separatorIndex === -1) return false;

        const method = credentials.slice(0, separatorIndex);
        const password = credentials.slice(separatorIndex + 1);
        const serverUrl = new URL(`http://${serverPart}`);

        return Boolean(
            method &&
            password &&
            serverUrl.hostname &&
            !PLACEHOLDER_ADDRESSES.has(serverUrl.hostname) &&
            Number(serverUrl.port) > 1,
        );
    } catch {
        return false;
    }
}

function hasServerData(line: string): boolean {
    const scheme = line.slice(0, line.indexOf('://')).toLowerCase();

    switch (scheme) {
        case 'vless':
        case 'trojan':
            return hasValidUrlProxyEndpoint(line);
        case 'vmess':
            return hasValidVmessEndpoint(line);
        case 'ss':
        case 'shadowsocks':
            return hasValidShadowsocksEndpoint(line);
        default:
            return true;
    }
}

@Injectable()
export class SubscriptionFetchService {
    private readonly logger = new Logger(SubscriptionFetchService.name);

    constructor(private readonly importSourceRepository: SubscriptionImportSourceRepository) {}

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

            this.logger.log(`Cached ${rawLines.length} proxy lines from source "${source.name}"`);
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
            .filter(
                (line) =>
                    ACCEPTED_PROTOCOLS.some((proto) => line.startsWith(proto)) &&
                    hasServerData(line),
            );
    }
}
