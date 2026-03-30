<<<<<<< HEAD
export const MIHOMO_EXTENDED_CLIENTS = [/^FlClash ?X\//, /^Flowvy\//, /^prizrak-box\//] as const;
export const XRAY_EXTENDED_CLIENTS = [/^Happ\//] as const;

export function isMihomoExtendedClient(userAgent: string): boolean {
    return MIHOMO_EXTENDED_CLIENTS.some((client) => client.test(userAgent));
}

export function isXrayExtendedClient(userAgent: string): boolean {
    return XRAY_EXTENDED_CLIENTS.some((client) => client.test(userAgent));
=======
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
>>>>>>> upstream/main
}

export const JSON_SUBSCRIPTION_FALLBACK_CLIENTS = [
    /^[Ss]treisand/,
    /^Happ\//,
<<<<<<< HEAD
=======
    /^INCY\//,
>>>>>>> upstream/main
    /^ktor-client/,
    /^V2Box/,
    /^io\.github\.saeeddev94\.xray\//,
    /^v2rayNG\/(\d+\.\d+\.\d+)/,
    /^v2rayN\/(\d+\.\d+\.\d+)/,
] as const;

export function isJsonSubscriptionFallbackSupported(userAgent: string): boolean {
    return JSON_SUBSCRIPTION_FALLBACK_CLIENTS.some((client) => client.test(userAgent));
}
