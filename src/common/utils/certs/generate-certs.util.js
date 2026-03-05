"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMasterCerts = generateMasterCerts;
exports.generateNodeCert = generateNodeCert;
exports.generateJwtKeypair = generateJwtKeypair;
const x509_1 = require("@peculiar/x509");
const node_crypto_1 = require("node:crypto");
const webcrypto_1 = require("@peculiar/webcrypto");
const nanoid_1 = require("nanoid");
const node_util_1 = require("node:util");
const generateKeyPairAsync = (0, node_util_1.promisify)(node_crypto_1.generateKeyPair);
async function generateMasterCerts() {
    const crypto = new webcrypto_1.Crypto();
    const cn = genRandomString();
    x509_1.cryptoProvider.set(crypto);
    const caAlgorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
    };
    const caKeys = await crypto.subtle.generateKey(caAlgorithm, true, ['sign', 'verify']);
    const caCert = await x509_1.X509CertificateGenerator.createSelfSigned({
        serialNumber: '01',
        name: `CN=${cn}`,
        notBefore: new Date(),
        notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        keys: caKeys,
        signingAlgorithm: caAlgorithm,
        extensions: [
            new x509_1.BasicConstraintsExtension(true, undefined, true),
            new x509_1.KeyUsagesExtension(x509_1.KeyUsageFlags.keyCertSign | x509_1.KeyUsageFlags.digitalSignature, true),
        ],
    });
    const caPem = {
        cert: caCert.toString('pem'),
        key: arrayBufferToPem(new Uint8Array(await crypto.subtle.exportKey('pkcs8', caKeys.privateKey)), 'PRIVATE KEY'),
    };
    const clientAlgorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
    };
    const clientKeys = await crypto.subtle.generateKey(clientAlgorithm, true, ['sign', 'verify']);
    const clientCert = await x509_1.X509CertificateGenerator.create({
        serialNumber: '02',
        subject: `CN=${genRandomString()}`,
        notBefore: new Date(),
        notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        issuer: caCert.subjectName,
        publicKey: clientKeys.publicKey,
        signingKey: caKeys.privateKey,
        extensions: [
            new x509_1.BasicConstraintsExtension(false, undefined, true),
            new x509_1.KeyUsagesExtension(x509_1.KeyUsageFlags.digitalSignature, true),
            new x509_1.ExtendedKeyUsageExtension(['1.3.6.1.5.5.7.3.2'], true),
        ],
    });
    const clientPem = {
        cert: clientCert.toString('pem'),
        key: arrayBufferToPem(new Uint8Array(await crypto.subtle.exportKey('pkcs8', clientKeys.privateKey)), 'PRIVATE KEY'),
    };
    return {
        caCertPem: caPem.cert,
        caKeyPem: caPem.key,
        clientCertPem: clientPem.cert,
        clientKeyPem: clientPem.key,
    };
}
async function generateNodeCert(caCertPem, caKeyPem) {
    const crypto = new webcrypto_1.Crypto();
    x509_1.cryptoProvider.set(crypto);
    const caCert = new x509_1.X509Certificate(caCertPem);
    const caPrivateKey = await crypto.subtle.importKey('pkcs8', pemToArrayBuffer(caKeyPem), {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
    }, false, ['sign']);
    const nodeKeys = await crypto.subtle.generateKey({
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
    }, true, ['sign', 'verify']);
    const nodeCert = await x509_1.X509CertificateGenerator.create({
        serialNumber: Date.now().toString(),
        subject: `CN=${genRandomString()}`,
        issuer: caCert.subjectName,
        notBefore: new Date(),
        notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
        publicKey: nodeKeys.publicKey,
        signingKey: caPrivateKey,
        extensions: [
            new x509_1.BasicConstraintsExtension(false, undefined, true),
            new x509_1.KeyUsagesExtension(x509_1.KeyUsageFlags.digitalSignature | x509_1.KeyUsageFlags.keyEncipherment, true),
            new x509_1.ExtendedKeyUsageExtension(['1.3.6.1.5.5.7.3.1'], true),
        ],
    });
    const nodeCertPem = nodeCert.toString('pem');
    const nodeKeyPem = arrayBufferToPem(new Uint8Array(await crypto.subtle.exportKey('pkcs8', nodeKeys.privateKey)), 'PRIVATE KEY');
    return {
        nodeCertPem,
        nodeKeyPem,
        caCertPem,
    };
}
async function generateJwtKeypair() {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return {
        publicKey,
        privateKey,
    };
}
function arrayBufferToPem(buffer, label) {
    const b64 = Buffer.from(buffer).toString('base64');
    const formatted = b64.match(/.{1,64}/g)?.join('\n') ?? b64;
    return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
}
function pemToArrayBuffer(pem) {
    const b64 = pem
        .replace(/-----BEGIN .* KEY-----/, '')
        .replace(/-----END .* KEY-----/, '')
        .replace(/\s+/g, '');
    return new Uint8Array(Buffer.from(b64, 'base64'));
}
function genRandomString() {
    const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghjkmnopqrstuvwxyz-';
    const length = Math.floor(Math.random() * 27) + 20;
    const nanoid = (0, nanoid_1.customAlphabet)(alphabet, length);
    return nanoid();
}
//# sourceMappingURL=generate-certs.util.js.map