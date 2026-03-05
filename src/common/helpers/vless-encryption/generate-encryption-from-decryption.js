"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDecryption = parseDecryption;
exports.generateX25519PublicKey = generateX25519PublicKey;
exports.generateMlkem768PublicKey = generateMlkem768PublicKey;
exports.generateEncryptionFromDecryption = generateEncryptionFromDecryption;
const node_crypto_1 = require("node:crypto");
const ml_kem_js_1 = require("@noble/post-quantum/ml-kem.js");
var KeyType;
(function (KeyType) {
    KeyType["MLKEM768"] = "mlkem768";
    KeyType["X25519"] = "x25519";
})(KeyType || (KeyType = {}));
function detectKeyType(keyValue) {
    const buffer = Buffer.from(keyValue, 'base64');
    const length = buffer.length;
    if (length === 32) {
        return KeyType.X25519;
    }
    if (length === 64) {
        return KeyType.MLKEM768;
    }
    throw new Error(`Cannot detect key type: length ${length}. ` +
        `Expected 32 bytes for X25519 or 64 bytes for ML-KEM-768`);
}
function parseDecryption(decryption) {
    if (!decryption || typeof decryption !== 'string') {
        throw new Error('Decryption string is required');
    }
    const parts = decryption.split('.');
    const [protocol, mode, ticketLifetime, ...rest] = parts;
    if (protocol !== 'mlkem768x25519plus') {
        throw new Error(`Invalid protocol: ${protocol}. Expected 'mlkem768x25519plus'`);
    }
    const validModes = ['native', 'xorpub', 'random'];
    if (!validModes.includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Expected one of: ${validModes.join(', ')}`);
    }
    if (!ticketLifetime || ticketLifetime.length === 0) {
        throw new Error('Ticket lifetime is required (e.g., "600s", "0s", "300-600s")');
    }
    const paddingParts = [];
    const keyParts = [];
    let foundFirstKey = false;
    for (const part of rest) {
        if (!part || part.trim().length === 0) {
            if (!foundFirstKey) {
                paddingParts.push(part);
            }
            continue;
        }
        try {
            const buffer = Buffer.from(part, 'base64');
            const length = buffer.length;
            if (length === 32 || length === 64) {
                foundFirstKey = true;
                keyParts.push(part);
            }
            else if (!foundFirstKey) {
                paddingParts.push(part);
            }
            else {
                throw new Error(`Invalid key length: ${length} bytes at position after keys started`);
            }
        }
        catch (error) {
            if (!foundFirstKey) {
                paddingParts.push(part);
            }
            else {
                throw new Error(`Invalid key format: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }
    if (keyParts.length === 0) {
        throw new Error('At least one key is required');
    }
    const keys = [];
    for (const keyValue of keyParts) {
        if (!keyValue || keyValue.trim().length === 0) {
            continue;
        }
        const keyType = detectKeyType(keyValue);
        keys.push({
            type: keyType,
            value: keyValue,
        });
    }
    if (keys.length === 0) {
        throw new Error('No valid keys found in decryption string');
    }
    const padding = paddingParts.join('.') || undefined;
    return {
        protocol,
        mode,
        ticketLifetime,
        padding,
        keys,
    };
}
async function generateX25519PublicKey(privateKeyBase64) {
    try {
        const rawPrivateKey = Buffer.from(privateKeyBase64, 'base64');
        if (rawPrivateKey.length !== 32) {
            throw new Error(`Invalid X25519 private key length: ${rawPrivateKey.length}. Expected 32 bytes`);
        }
        const jwkPrivateKey = {
            kty: 'OKP',
            crv: 'X25519',
            d: rawPrivateKey.toString('base64url'),
            x: '',
        };
        const privateKeyObj = (0, node_crypto_1.createPrivateKey)({
            key: jwkPrivateKey,
            format: 'jwk',
        });
        const publicKeyObj = (0, node_crypto_1.createPublicKey)(privateKeyObj);
        const publicKeyJwk = publicKeyObj.export({ format: 'jwk' });
        if (!publicKeyJwk.x) {
            throw new Error('Failed to generate public key: missing x coordinate');
        }
        return publicKeyJwk.x;
    }
    catch (error) {
        throw new Error(`Failed to generate X25519 public key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
function generateMlkem768PublicKey(seedBase64) {
    try {
        const seedBuffer = Buffer.from(seedBase64, 'base64');
        if (seedBuffer.length !== 64) {
            throw new Error(`Invalid ML-KEM-768 seed length: ${seedBuffer.length}. Expected 64 bytes`);
        }
        const { publicKey } = ml_kem_js_1.ml_kem768.keygen(seedBuffer);
        return Buffer.from(publicKey).toString('base64url');
    }
    catch (error) {
        throw new Error(`Failed to generate ML-KEM-768 public key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function generateEncryptionFromDecryption(decryption) {
    const parsed = parseDecryption(decryption);
    const publicKeys = [];
    for (const key of parsed.keys) {
        try {
            let publicKeyValue;
            if (key.type === KeyType.X25519) {
                publicKeyValue = await generateX25519PublicKey(key.value);
            }
            else {
                publicKeyValue = generateMlkem768PublicKey(key.value);
            }
            publicKeys.push({
                type: key.type,
                value: publicKeyValue,
            });
        }
        catch (error) {
            throw new Error(`Failed to generate public key for ${key.type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    let rttMode = '1rtt';
    if (parsed.ticketLifetime === '0s') {
        rttMode = '1rtt';
    }
    else {
        rttMode = '0rtt';
    }
    const flatKeys = publicKeys.map((key) => key.value);
    const encryptionParts = [
        parsed.protocol,
        parsed.mode,
        rttMode,
    ];
    if (parsed.padding) {
        encryptionParts.push(parsed.padding);
    }
    encryptionParts.push(...flatKeys);
    const encryption = encryptionParts.join('.');
    return {
        encryption,
        publicKeys,
    };
}
//# sourceMappingURL=generate-encryption-from-decryption.js.map