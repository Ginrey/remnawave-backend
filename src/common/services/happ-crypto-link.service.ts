import { createHappCryptoLink } from '@kastov/cryptohapp';

import { Injectable, Logger } from '@nestjs/common';

interface HappCryptoApiResponse {
    encrypted_link?: unknown;
}

export interface HappCryptoLinkResult {
    encryptedLink: string;
    version: 'crypt5' | 'crypt4';
}

@Injectable()
export class HappCryptoLinkService {
    private readonly logger = new Logger(HappCryptoLinkService.name);
    private readonly happCryptoApiUrl = 'https://crypto.happ.su/api-v2.php';
    private readonly happCryptoApiTimeoutMs = 10_000;
    private readonly crypt5CacheTtlMs = 24 * 60 * 60 * 1_000;
    private readonly crypt5Cache = new Map<string, { expiresAt: number; link: string }>();
    private readonly crypt5InFlight = new Map<string, Promise<string | null>>();

    public async encrypt(linkToEncrypt: string): Promise<HappCryptoLinkResult | null> {
        const crypt5Link = await this.tryCreateCrypt5Link(linkToEncrypt);

        if (crypt5Link) {
            return {
                encryptedLink: crypt5Link,
                version: 'crypt5',
            };
        }

        const crypt4Link = createHappCryptoLink(linkToEncrypt, 'v4', true);

        if (!crypt4Link) {
            return null;
        }

        return {
            encryptedLink: crypt4Link,
            version: 'crypt4',
        };
    }

    public async encryptCrypt5(linkToEncrypt: string): Promise<HappCryptoLinkResult | null> {
        const crypt5Link = await this.getCachedCrypt5Link(linkToEncrypt);

        if (!crypt5Link) {
            return null;
        }

        return {
            encryptedLink: crypt5Link,
            version: 'crypt5',
        };
    }

    private async getCachedCrypt5Link(linkToEncrypt: string): Promise<string | null> {
        const cached = this.crypt5Cache.get(linkToEncrypt);

        if (cached && cached.expiresAt > Date.now()) {
            return cached.link;
        }

        if (cached) {
            this.crypt5Cache.delete(linkToEncrypt);
        }

        const inFlight = this.crypt5InFlight.get(linkToEncrypt);

        if (inFlight) {
            return inFlight;
        }

        const request = this.tryCreateCrypt5Link(linkToEncrypt)
            .then((link) => {
                if (link) {
                    this.crypt5Cache.set(linkToEncrypt, {
                        expiresAt: Date.now() + this.crypt5CacheTtlMs,
                        link,
                    });
                }

                return link;
            })
            .finally(() => {
                this.crypt5InFlight.delete(linkToEncrypt);
            });

        this.crypt5InFlight.set(linkToEncrypt, request);

        return request;
    }

    private async tryCreateCrypt5Link(linkToEncrypt: string): Promise<string | null> {
        try {
            const response = await fetch(this.happCryptoApiUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                signal: AbortSignal.timeout(this.happCryptoApiTimeoutMs),
                body: JSON.stringify({
                    url: linkToEncrypt,
                }),
            });

            if (!response.ok) {
                this.logger.warn(`Happ crypt5 API responded with ${response.status}`);
                return null;
            }

            const data = (await response.json()) as HappCryptoApiResponse;

            if (
                typeof data.encrypted_link !== 'string' ||
                !data.encrypted_link.startsWith('happ://crypt5/')
            ) {
                this.logger.warn('Happ crypt5 API returned an invalid encrypted link');
                return null;
            }

            return data.encrypted_link;
        } catch (error) {
            this.logger.warn(`Happ crypt5 API request failed: ${String(error)}`);
            return null;
        }
    }
}
