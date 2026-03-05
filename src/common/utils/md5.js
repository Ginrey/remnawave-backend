"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = md5;
const node_crypto_1 = require("node:crypto");
function md5(data) {
    return (0, node_crypto_1.createHash)('md5').update(data).digest('hex');
}
//# sourceMappingURL=md5.js.map