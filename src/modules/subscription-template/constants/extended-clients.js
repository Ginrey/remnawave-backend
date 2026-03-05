"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_SUBSCRIPTION_FALLBACK_CLIENTS = exports.XRAY_EXTENDED_CLIENTS = exports.MIHOMO_EXTENDED_CLIENTS = void 0;
exports.isMihomoExtendedClient = isMihomoExtendedClient;
exports.isXrayExtendedClient = isXrayExtendedClient;
exports.isJsonSubscriptionFallbackSupported = isJsonSubscriptionFallbackSupported;
exports.MIHOMO_EXTENDED_CLIENTS = [/^FlClash ?X\//, /^Flowvy\//, /^prizrak-box\//];
exports.XRAY_EXTENDED_CLIENTS = [/^Happ\//];
function isMihomoExtendedClient(userAgent) {
    return exports.MIHOMO_EXTENDED_CLIENTS.some((client) => client.test(userAgent));
}
function isXrayExtendedClient(userAgent) {
    return exports.XRAY_EXTENDED_CLIENTS.some((client) => client.test(userAgent));
}
exports.JSON_SUBSCRIPTION_FALLBACK_CLIENTS = [
    /^[Ss]treisand/,
    /^Happ\//,
    /^ktor-client/,
    /^V2Box/,
    /^io\.github\.saeeddev94\.xray\//,
    /^v2rayNG\/(\d+\.\d+\.\d+)/,
    /^v2rayN\/(\d+\.\d+\.\d+)/,
];
function isJsonSubscriptionFallbackSupported(userAgent) {
    return exports.JSON_SUBSCRIPTION_FALLBACK_CLIENTS.some((client) => client.test(userAgent));
}
//# sourceMappingURL=extended-clients.js.map