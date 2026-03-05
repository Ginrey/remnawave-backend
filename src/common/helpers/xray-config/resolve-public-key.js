"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveInboundAndPublicKey = resolveInboundAndPublicKey;
exports.resolveInboundAndMlDsa65PublicKey = resolveInboundAndMlDsa65PublicKey;
exports.resolveEncryptionFromDecryption = resolveEncryptionFromDecryption;
exports.getMlDsa65PublicKey = getMlDsa65PublicKey;
const node_crypto_1 = require("node:crypto");
const ml_dsa_js_1 = require("@noble/post-quantum/ml-dsa.js");
const generate_encryption_from_decryption_1 = require("../vless-encryption/generate-encryption-from-decryption");
async function resolveInboundAndPublicKey(inbounds) {
    const publicKeyMap = new Map();
    for (const inbound of inbounds) {
        if (inbound.streamSettings?.realitySettings?.privateKey) {
            try {
                if (publicKeyMap.has(inbound.tag)) {
                    continue;
                }
                const { publicKey: jwkPublicKey } = await createX25519KeyPairFromBase64(inbound.streamSettings.realitySettings.privateKey);
                const publicKeyJwk = jwkPublicKey.export({ format: 'jwk' });
                if (!publicKeyJwk) {
                    continue;
                }
                const pubKeyRaw = publicKeyJwk.x;
                if (!pubKeyRaw) {
                    continue;
                }
                publicKeyMap.set(inbound.tag, pubKeyRaw);
            }
            catch {
                continue;
            }
        }
    }
    return publicKeyMap;
}
async function resolveInboundAndMlDsa65PublicKey(inbounds) {
    const mldsa65PublicKeyMap = new Map();
    for (const inbound of inbounds) {
        if (inbound.streamSettings?.realitySettings?.mldsa65Seed) {
            try {
                if (mldsa65PublicKeyMap.has(inbound.tag)) {
                    continue;
                }
                const publicKey = getMlDsa65PublicKey(inbound.streamSettings.realitySettings.mldsa65Seed);
                if (!publicKey) {
                    continue;
                }
                mldsa65PublicKeyMap.set(inbound.tag, publicKey);
            }
            catch {
                continue;
            }
        }
    }
    return mldsa65PublicKeyMap;
}
async function resolveEncryptionFromDecryption(inbounds) {
    const encryptionMap = new Map();
    for (const inbound of inbounds) {
        try {
            if (inbound.protocol !== 'vless') {
                continue;
            }
            if (!inbound.settings) {
                continue;
            }
            if (!inbound.settings.decryption) {
                continue;
            }
            if (inbound.settings.decryption === 'none') {
                continue;
            }
            if (encryptionMap.has(inbound.tag)) {
                continue;
            }
            const encryption = await (0, generate_encryption_from_decryption_1.generateEncryptionFromDecryption)(inbound.settings.decryption);
            encryptionMap.set(inbound.tag, encryption.encryption);
        }
        catch {
            continue;
        }
    }
    return encryptionMap;
}
async function createX25519KeyPairFromBase64(base64PrivateKey) {
    return new Promise((resolve, reject) => {
        try {
            const rawPrivateKey = Buffer.from(base64PrivateKey, 'base64');
            const jwkPrivateKey = {
                kty: 'OKP',
                crv: 'X25519',
                d: Buffer.from(rawPrivateKey).toString('base64url'),
                x: '',
            };
            const privateKey = (0, node_crypto_1.createPrivateKey)({
                key: jwkPrivateKey,
                format: 'jwk',
            });
            const publicKey = (0, node_crypto_1.createPublicKey)(privateKey);
            resolve({ publicKey, privateKey });
        }
        catch (error) {
            reject(error);
        }
    });
}
function getMlDsa65PublicKey(seed) {
    try {
        const seedBuffer = Buffer.from(seed, 'base64');
        const { publicKey } = ml_dsa_js_1.ml_dsa65.keygen(seedBuffer);
        return Buffer.from(publicKey).toString('base64url');
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=resolve-public-key.js.map