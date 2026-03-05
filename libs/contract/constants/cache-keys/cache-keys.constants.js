"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_CACHE_KEYS_TTL = exports.INTERNAL_CACHE_KEYS = exports.CACHE_KEYS_TTL = exports.CACHE_KEYS = void 0;
exports.CACHE_KEYS = {
    SUBSCRIPTION_SETTINGS: 'subscription_settings',
    EXTERNAL_SQUAD_SETTINGS: (uuid) => `external_squad_settings:${uuid}`,
    SUBSCRIPTION_TEMPLATE: (name, type) => `subscription_template:${name}:${type}`,
    PASSKEY_REGISTRATION_OPTIONS: (uuid) => `passkey_registration_options:${uuid}`,
    PASSKEY_AUTHENTICATION_OPTIONS: (uuid) => `passkey_authentication_options:${uuid}`,
    REMNAWAVE_SETTINGS: 'remnawave_settings',
    SHORT_UUID_RANGE: 'short_uuid_range',
};
exports.CACHE_KEYS_TTL = {
    REMNAWAVE_SETTINGS: 86_400_000,
    EXTERNAL_SQUAD_SETTINGS: 3_600_000,
    SUBSCRIPTION_SETTINGS: 3_600_000,
    SHORT_UUID_RANGE: 86_400_000,
};
exports.INTERNAL_CACHE_KEYS = {
    NODE_USER_USAGE_PREFIX: 'node_user_usage:',
    NODE_USER_USAGE: (nodeId) => `${exports.INTERNAL_CACHE_KEYS.NODE_USER_USAGE_PREFIX}${nodeId.toString()}`,
    NODE_USER_USAGE_KEYS: 'node_user_usage_keys',
    PROCESSING_POSTFIX: ':processing',
};
exports.INTERNAL_CACHE_KEYS_TTL = {
    NODE_USER_USAGE: 10_800,
};
//# sourceMappingURL=cache-keys.constants.js.map