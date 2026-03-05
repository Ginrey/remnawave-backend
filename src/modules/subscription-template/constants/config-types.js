"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_CONFIG_TYPES_VALUES = exports.SUBSCRIPTION_CONFIG_TYPES = void 0;
const constants_1 = require("@libs/contracts/constants");
exports.SUBSCRIPTION_CONFIG_TYPES = {
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.MIHOMO]: {
        CONTENT_TYPE: 'text/yaml',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.CLASH]: {
        CONTENT_TYPE: 'text/yaml',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.STASH]: {
        CONTENT_TYPE: 'text/yaml',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.SINGBOX]: {
        CONTENT_TYPE: 'application/json',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.XRAY_BASE64]: {
        CONTENT_TYPE: 'text/plain',
        isBase64: true,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.XRAY_JSON]: {
        CONTENT_TYPE: 'application/json',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.BLOCK]: {
        CONTENT_TYPE: 'text/plain',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.STATUS_CODE_404]: {
        CONTENT_TYPE: 'text/plain',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.STATUS_CODE_451]: {
        CONTENT_TYPE: 'text/plain',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.SOCKET_DROP]: {
        CONTENT_TYPE: 'text/plain',
        isBase64: false,
    },
    [constants_1.RESPONSE_RULES_RESPONSE_TYPES.BROWSER]: {
        CONTENT_TYPE: 'text/html',
        isBase64: false,
    },
};
exports.SUBSCRIPTION_CONFIG_TYPES_VALUES = Object.values(exports.SUBSCRIPTION_CONFIG_TYPES);
//# sourceMappingURL=config-types.js.map