"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVlessFlow = exports.hasVlessSettingsWithFlow = void 0;
exports.getVlessFlowFromDbInbound = getVlessFlowFromDbInbound;
const hasVlessSettingsWithFlow = (obj) => {
    return (typeof obj === 'object' &&
        obj !== null &&
        'settings' in obj &&
        typeof obj.settings === 'object' &&
        obj.settings !== null &&
        'flow' in obj.settings &&
        typeof obj.settings.flow === 'string');
};
exports.hasVlessSettingsWithFlow = hasVlessSettingsWithFlow;
const getVlessFlow = (inbound) => {
    if (inbound.protocol !== 'vless') {
        return undefined;
    }
    if (inbound.settings.flow !== undefined) {
        if (inbound.settings.flow === 'xtls-rprx-vision') {
            return 'xtls-rprx-vision';
        }
        else {
            return '';
        }
    }
    if (inbound.streamSettings) {
        if (['reality', 'tls'].includes(inbound.streamSettings.security || '') &&
            ['raw', 'tcp'].includes(inbound.streamSettings.network)) {
            return 'xtls-rprx-vision';
        }
    }
    return '';
};
exports.getVlessFlow = getVlessFlow;
function getVlessFlowFromDbInbound(inbound) {
    if (inbound.type === 'vless') {
        if (inbound.rawInbound && (0, exports.hasVlessSettingsWithFlow)(inbound.rawInbound)) {
            if (inbound.rawInbound.settings.flow === 'xtls-rprx-vision') {
                return 'xtls-rprx-vision';
            }
            else {
                return '';
            }
        }
    }
    if ((inbound.network === 'tcp' || inbound.network === 'raw') &&
        (inbound.security === 'reality' || inbound.security === 'tls')) {
        return 'xtls-rprx-vision';
    }
    return '';
}
//# sourceMappingURL=get-vless-flow.js.map