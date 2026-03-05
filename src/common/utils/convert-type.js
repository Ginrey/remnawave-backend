"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapBigInt = wrapBigInt;
exports.wrapBigIntNullable = wrapBigIntNullable;
exports.wrapDbNull = wrapDbNull;
exports.mapDefined = mapDefined;
exports.hasContent = hasContent;
const client_1 = require("@prisma/client");
function wrapBigInt(value) {
    if (value === undefined) {
        return value;
    }
    return BigInt(value);
}
function wrapBigIntNullable(value) {
    if (value === undefined || value === null) {
        return value;
    }
    return BigInt(value);
}
function wrapDbNull(value, filterEmptyObj) {
    if (value === null)
        return client_1.Prisma.DbNull;
    if (filterEmptyObj && typeof value === 'object' && Object.keys(value).length === 0)
        return client_1.Prisma.DbNull;
    return value;
}
function mapDefined(value, fn) {
    return value !== undefined ? fn(value) : undefined;
}
function hasContent(value) {
    if (value === null || value === undefined)
        return false;
    if (typeof value === 'object' && Object.keys(value).length === 0)
        return false;
    return true;
}
//# sourceMappingURL=convert-type.js.map