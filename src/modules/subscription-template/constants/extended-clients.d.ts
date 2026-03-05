export declare const MIHOMO_EXTENDED_CLIENTS: readonly [RegExp, RegExp, RegExp];
export declare const XRAY_EXTENDED_CLIENTS: readonly [RegExp];
export declare function isMihomoExtendedClient(userAgent: string): boolean;
export declare function isXrayExtendedClient(userAgent: string): boolean;
export declare const JSON_SUBSCRIPTION_FALLBACK_CLIENTS: readonly [RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp];
export declare function isJsonSubscriptionFallbackSupported(userAgent: string): boolean;
