"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskString = maskString;
function maskString(str, delimiter) {
    if (str === null || str === undefined) {
        return null;
    }
    if (delimiter) {
        const parts = str.split(delimiter);
        const lastIndex = parts.length - 1;
        return parts
            .map((part, index) => (index === lastIndex ? part.replace(/./g, '*') : part))
            .join(delimiter);
    }
    return str
        .split('')
        .map(() => '*')
        .join('');
}
//# sourceMappingURL=mask-string.js.map