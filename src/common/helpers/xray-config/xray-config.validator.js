"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRayConfig = void 0;
const node_crypto_1 = require("node:crypto");
const node_object_hash_1 = require("node-object-hash");
const node_fs_1 = require("node:fs");
const hashed_set_1 = require("@remnawave/hashed-set");
const get_vless_flow_1 = require("@common/utils/flow/get-vless-flow");
class XRayConfig {
    config;
    inbounds = [];
    inboundsByProtocol = {};
    inboundsByTag = {};
    CONFIG_KEY_ORDER = [
        'log',
        'api',
        'dns',
        'inbounds',
        'outbounds',
        'routing',
        'policy',
        'transport',
        'stats',
        'reverse',
        'fakedns',
        'metrics',
        'observatory',
        'burstObservatory',
    ];
    constructor(configInput) {
        this.config = this.prevValidateConfig(configInput);
        this.validate();
        this.resolveInbounds();
    }
    prevValidateConfig(configInput) {
        let config;
        if (typeof configInput === 'string') {
            try {
                config = JSON.parse(configInput);
            }
            catch (error) {
                throw new Error(`Invalid JSON input or file path: ${error}`);
            }
        }
        else if (typeof configInput === 'object') {
            config = configInput;
        }
        else {
            throw new Error('Invalid configuration format.');
        }
        return config;
    }
    validate() {
        if (!this.config.inbounds || this.config.inbounds.length === 0) {
            throw new Error("Config doesn't have inbounds.");
        }
        const seenTags = new Set();
        for (const inbound of this.config.inbounds) {
            const network = inbound.streamSettings?.network;
            if (network &&
                !['grpc', 'httpupgrade', 'raw', 'tcp', 'ws', 'xhttp'].includes(network)) {
                throw new Error(`Invalid network type "${network}" in inbound "${inbound.tag}". Allowed values are: raw (or tcp), ws, httpupgrade, xhttp and grpc`);
            }
            if (![
                'dokodemo-door',
                'http',
                'mixed',
                'shadowsocks',
                'trojan',
                'vless',
                'wireguard',
            ].includes(inbound.protocol)) {
                throw new Error(`Invalid protocol in inbound "${inbound.tag}". Allowed values are: shadowsocks, trojan, vless, dokodemo-door, http, mixed, wireguard`);
            }
            if (!inbound.tag) {
                throw new Error('All inbounds must have a unique tag.');
            }
            if (inbound.tag.includes(',')) {
                throw new Error("Character ',' is not allowed in inbound tag.");
            }
            if (seenTags.has(inbound.tag)) {
                throw new Error(`Duplicate inbound tag "${inbound.tag}" found. All inbound tags must be unique.`);
            }
            seenTags.add(inbound.tag);
        }
    }
    resolveInbounds() {
        for (const inbound of this.config.inbounds) {
            const settings = {
                ...inbound,
                tag: inbound.tag,
                protocol: inbound.protocol,
            };
            this.inbounds.push(settings);
            this.inboundsByTag[inbound.tag] = settings;
            if (!this.inboundsByProtocol[settings.protocol]) {
                this.inboundsByProtocol[settings.protocol] = [];
            }
            this.inboundsByProtocol[settings.protocol].push(settings);
        }
    }
    static getXrayConfigInstance(config) {
        return new XRayConfig(config);
    }
    getInbound(tag) {
        return this.config.inbounds.find((inbound) => inbound.tag === tag);
    }
    excludeInbounds(tags) {
        this.config.inbounds = this.config.inbounds.filter((inbound) => !tags.includes(inbound.tag));
    }
    leaveInbounds(tags) {
        this.config.inbounds = this.config.inbounds.filter((inbound) => tags.has(inbound.tag) || !this.isInboundWithUsers(inbound.protocol));
    }
    getInbounds() {
        return this.inbounds;
    }
    getConfig() {
        return this.config;
    }
    getInboundByProtocol(protocol) {
        return this.inboundsByProtocol[protocol] || [];
    }
    toJSON() {
        return JSON.stringify(this.config, null, 2);
    }
    sortObjectByKeys(obj) {
        const sortedObj = {};
        for (const key of this.CONFIG_KEY_ORDER) {
            if (key in obj) {
                sortedObj[key] = obj[key];
            }
        }
        for (const key in obj) {
            if (!(key in sortedObj)) {
                sortedObj[key] = obj[key];
            }
        }
        return sortedObj;
    }
    processCertificates() {
        const config = this.config;
        for (const inbound of config.inbounds) {
            const tlsSettings = inbound?.streamSettings?.tlsSettings;
            if (!tlsSettings?.certificates)
                continue;
            tlsSettings.certificates = tlsSettings.certificates.map((cert) => {
                try {
                    const newCert = { ...cert };
                    if (newCert.certificateFile) {
                        const certContent = (0, node_fs_1.readFileSync)(newCert.certificateFile, 'utf-8')
                            .replace(/\r\n/g, '\n')
                            .split('\n')
                            .filter((line) => line);
                        newCert.certificate = certContent;
                        delete newCert.certificateFile;
                    }
                    if (newCert.keyFile) {
                        const keyContent = (0, node_fs_1.readFileSync)(newCert.keyFile, 'utf-8')
                            .replace(/\r\n/g, '\n')
                            .split('\n')
                            .filter((line) => line);
                        newCert.key = keyContent;
                        delete newCert.keyFile;
                    }
                    return newCert;
                }
                catch {
                    return cert;
                }
            });
        }
        return config;
    }
    getConfigHash() {
        const hash = (0, node_object_hash_1.hasher)({
            trim: true,
            sort: false,
        }).hash;
        return hash(this.getSortedConfig());
    }
    getAllInbounds() {
        return this.inbounds
            .filter((inbound) => this.isInboundWithUsers(inbound.protocol))
            .map((inbound) => ({
            tag: inbound.tag,
            rawInbound: inbound,
            type: inbound.protocol,
            network: inbound.streamSettings?.network ?? null,
            security: inbound.streamSettings?.security ?? null,
            port: this.getPort(inbound.port),
        }));
    }
    cleanClients() {
        for (const inbound of this.config.inbounds) {
            switch (inbound.protocol) {
                case 'trojan':
                    inbound.settings.clients = [];
                    break;
                case 'vless':
                    inbound.settings.clients = [];
                    break;
                case 'shadowsocks':
                    inbound.settings.clients = [];
                    break;
                default:
                    break;
            }
        }
    }
    fixIncorrectServerNames() {
        for (const inbound of this.config.inbounds) {
            const realitySettings = inbound.protocol === 'vless' ? inbound.streamSettings?.realitySettings : null;
            if (!realitySettings?.serverNames?.length) {
                continue;
            }
            realitySettings.serverNames = [
                ...new Set(realitySettings.serverNames.flatMap((name) => name.split(',').map((part) => part.trim()))),
            ];
        }
    }
    getSortedConfig() {
        return this.sortObjectByKeys(this.config);
    }
    getPort(port) {
        if (!port) {
            return null;
        }
        if (typeof port === 'string') {
            if (port.includes(',')) {
                return Number(port.split(',')[0]);
            }
            return Number(port);
        }
        return port;
    }
    cleanInboundClients() {
        for (const inbound of this.config.inbounds) {
            switch (inbound.protocol) {
                case 'trojan':
                    inbound.settings.clients = [];
                    break;
                case 'vless':
                    inbound.settings.clients = [];
                    inbound.settings.flow = (0, get_vless_flow_1.getVlessFlow)(inbound) || '';
                    break;
                case 'shadowsocks':
                    inbound.settings.clients = [];
                    break;
                default:
                    break;
            }
        }
    }
    addUsersToInbound(inbound, users) {
        switch (inbound.protocol) {
            case 'trojan':
                inbound.settings.clients ??= [];
                for (const user of users) {
                    inbound.settings.clients.push({
                        password: user.trojanPassword,
                        email: user.tId.toString(),
                        id: user.vlessUuid,
                    });
                }
                break;
            case 'vless':
                inbound.settings.clients ??= [];
                for (const user of users) {
                    inbound.settings.clients.push({
                        id: user.vlessUuid,
                        email: user.tId.toString(),
                    });
                }
                break;
            case 'shadowsocks':
                inbound.settings.clients ??= [];
                for (const user of users) {
                    inbound.settings.clients.push({
                        password: user.ssPassword,
                        method: 'chacha20-ietf-poly1305',
                        email: user.tId.toString(),
                        id: user.vlessUuid,
                    });
                }
                break;
            default:
                throw new Error(`Protocol ${inbound.protocol} is not supported.`);
        }
    }
    includeUserBatch(users, inboundsUserSets) {
        const usersByTag = new Map();
        for (const user of users) {
            for (const tag of user.tags) {
                if (!usersByTag.has(tag)) {
                    usersByTag.set(tag, []);
                }
                usersByTag.get(tag).push(user);
                if (!inboundsUserSets.has(tag)) {
                    inboundsUserSets.set(tag, new hashed_set_1.HashedSet());
                }
                inboundsUserSets.get(tag).add(user.vlessUuid);
            }
        }
        const inboundMap = new Map(this.config.inbounds
            .filter((inbound) => this.isInboundWithUsers(inbound.protocol))
            .map((inbound) => [inbound.tag, inbound]));
        for (const [tag, tagUsers] of usersByTag) {
            const inbound = inboundMap.get(tag);
            if (!inbound)
                continue;
            inbound.settings ??= {};
            this.addUsersToInbound(inbound, tagUsers);
        }
        usersByTag.clear();
        return this.config;
    }
    async resolveInboundAndPublicKey() {
        const publicKeyMap = new Map();
        for (const inbound of this.config.inbounds) {
            if (['dokodemo-door', 'http', 'mixed', 'wireguard'].includes(inbound.protocol)) {
                continue;
            }
            if (inbound.streamSettings?.realitySettings) {
                if (inbound.streamSettings.realitySettings.privateKey) {
                    try {
                        const { publicKey: jwkPublicKey } = await this.createX25519KeyPairFromBase64(inbound.streamSettings.realitySettings.privateKey);
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
        }
        return publicKeyMap;
    }
    async createX25519KeyPairFromBase64(base64PrivateKey) {
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
    isInboundWithUsers(protocol) {
        return !['dokodemo-door', 'http', 'mixed', 'wireguard'].includes(protocol);
    }
    replaceSnippets(snippets) {
        if (this.config.outbounds) {
            this.replaceSnippetsInArray(this.config.outbounds, snippets);
        }
        if (this.config.routing) {
            if (typeof this.config.routing === 'object' && 'rules' in this.config.routing) {
                this.replaceSnippetsInArray(this.config.routing.rules, snippets);
            }
            if (typeof this.config.routing === 'object' && 'balancers' in this.config.routing) {
                this.replaceSnippetsInArray(this.config.routing.balancers, snippets);
            }
        }
    }
    replaceSnippetsInArray = (array, snippetsMap) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const item = array[i];
            if (item.snippet) {
                const snippet = snippetsMap.get(item.snippet);
                if (snippet) {
                    if (Array.isArray(snippet)) {
                        array.splice(i, 1, ...snippet);
                    }
                    else {
                        array[i] = snippet;
                    }
                }
                else {
                    array.splice(i, 1);
                }
            }
        }
    };
}
exports.XRayConfig = XRayConfig;
//# sourceMappingURL=xray-config.validator.js.map