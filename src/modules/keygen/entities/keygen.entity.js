"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeygenEntity = void 0;
class KeygenEntity {
    uuid;
    privKey;
    pubKey;
    caCert;
    caKey;
    clientCert;
    clientKey;
    createdAt;
    updatedAt;
    constructor(keygen) {
        Object.assign(this, keygen);
        return this;
    }
}
exports.KeygenEntity = KeygenEntity;
//# sourceMappingURL=keygen.entity.js.map