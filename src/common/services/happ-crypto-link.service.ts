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

    private async tryCreateCrypt5Link(linkToEncrypt: string): Promise<string | null> {
        try {
            const response = await fetch(this.happCryptoApiUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                signal: AbortSignal.timeout(3_000),
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
