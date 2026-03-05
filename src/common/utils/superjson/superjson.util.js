"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCustom = serializeCustom;
exports.deserialize = deserialize;
const class_transformer_1 = require("class-transformer");
const superjson_1 = __importDefault(require("superjson"));
function serializeCustom(data) {
    return superjson_1.default.stringify((0, class_transformer_1.instanceToPlain)(data));
}
function deserialize(data, type) {
    return (0, class_transformer_1.plainToInstance)(type, superjson_1.default.parse(data));
}
//# sourceMappingURL=superjson.util.js.map