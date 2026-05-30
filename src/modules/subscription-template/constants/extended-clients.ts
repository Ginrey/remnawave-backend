export const EXTENDED_CLIENTS_REGEXES = [
    /^FlClash ?X\//,
    /^Flowvy\//,
    /^prizrak-box\//,
    /^koala-clash\//,
    /^Happ\//,
    /^INCY\//,
] as const;

export function isExtendedClient(userAgent: string): boolean {
    return EXTENDED_CLIENTS_REGEXES.some((client) => client.test(userAgent));
}

export const JSON_SUBSCRIPTION_FALLBACK_CLIENTS = [
    /^[Ss]treisand/,
    // Only Happ >= 2.0 supports the xray JSON array subscription format.
    // Happ 1.x has a JSON subscription parsing bug (fixed in 1.11.0 as "fix ordering json subscription").
    /^Happ\/([2-9]|\d{2,})\./,
    /^INCY\//,
    /^ktor-client/,
    /^V2Box/,
    /^io\.github\.saeeddev94\.xray\//,
    /^v2rayNG\/(\d+\.\d+\.\d+)/,
    /^v2rayN\/(\d+\.\d+\.\d+)/,
] as const;

export function isJsonSubscriptionFallbackSupported(userAgent: string): boolean {
    return JSON_SUBSCRIPTION_FALLBACK_CLIENTS.some((client) => client.test(userAgent));
}
