<<<<<<< HEAD
import { createPublicKey, createPrivateKey, KeyObject } from 'node:crypto';
=======
import {
    BalancingRule,
    InboundConfig,
    RoutingRule,
    ShadowsocksInboundConfig,
    sortXrayConfig,
    TLSCertConfig,
    TrojanInboundConfig,
    VLessInboundConfig,
    XrayConfig,
} from 'xray-typed';
>>>>>>> upstream/main
import { hasher } from 'node-object-hash';
import { readFileSync } from 'node:fs';

import { HashedSet } from '@remnawave/hashed-set';

import { getVlessFlow } from '@common/utils/flow/get-vless-flow';

import { UserForConfigEntity } from '@modules/users/entities/users-for-config';

<<<<<<< HEAD
import {
    CertificateObject as Certificate,
    InboundObject as Inbound,
    InboundSettings,
    IXrayConfig,
    ShadowsocksSettings,
    TCtrXRayConfig,
    TrojanSettings,
    VLessSettings,
} from './interfaces';
=======
import { getSsPassword, isSS2022MethodFromMethod, SHADOWSOCKS_METHODS } from './ss-cipher';

const MANAGED_CLIENT_PROTOCOLS = new Set(['hysteria', 'shadowsocks', 'trojan', 'vless']);
type ManagedInboundSettings = VLessInboundConfig | TrojanInboundConfig | ShadowsocksInboundConfig;

const ALLOWED_PROTOCOLS = new Set([
    'dokodemo-door',
    'http',
    'hysteria',
    'mixed',
    'shadowsocks',
    'trojan',
    'tunnel',
    'vless',
    'wireguard',
]);

const ALLOWED_NETWORKS = new Set([
    'grpc',
    'httpupgrade',
    'hysteria',
    'kcp',
    'raw',
    'tcp',
    'ws',
    'xhttp',
]);
>>>>>>> upstream/main

interface InboundsWithTagsAndType {
    tag: string;
    type: string;
    network: string | null;
    security: string | null;
    port: number | null;
    rawInbound: object | null;
}

<<<<<<< HEAD
export class XRayConfig {
    private config: IXrayConfig;
    private inbounds: Inbound[] = [];
    private inboundsByProtocol: Record<string, Inbound[]> = {};
    private inboundsByTag: Record<string, Inbound> = {};
    private readonly CONFIG_KEY_ORDER = [
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

    constructor(configInput: TCtrXRayConfig) {
        this.config = this.prevValidateConfig(configInput);
        this.validate();
        this.resolveInbounds();
    }

    private prevValidateConfig(configInput: TCtrXRayConfig): IXrayConfig {
        let config: IXrayConfig | undefined;

        if (typeof configInput === 'string') {
            try {
                config = JSON.parse(configInput) as IXrayConfig;
            } catch (error) {
                throw new Error(`Invalid JSON input or file path: ${error}`);
            }
        } else if (typeof configInput === 'object') {
            config = configInput as IXrayConfig;
        } else {
            throw new Error('Invalid configuration format.');
        }

        return config;
=======
type TCtrXRayConfig = object | Record<string, unknown> | string;

export class XRayConfig {
    private config: XrayConfig;
    private inbounds: InboundConfig[] = [];
    private inboundsByTag: Record<string, InboundConfig> = {};

    constructor(configInput: TCtrXRayConfig) {
        this.config = this.parseConfig(configInput);
        this.validate();
        this.indexInbounds();
    }

    public getConfig(): XrayConfig {
        return this.config;
    }

    public getSortedConfig(): XrayConfig {
        return sortXrayConfig(this.config);
    }

    public getConfigHash(): string {
        const hash = hasher({ trim: true, sort: false }).hash;
        return hash(this.getSortedConfig());
    }

    public getInbound(tag: string): InboundConfig | undefined {
        return this.inboundsByTag[tag];
    }

    public getAllInbounds(): InboundsWithTagsAndType[] {
        return this.inbounds
            .filter((inbound) => this.hasManagedClients(inbound))
            .map((inbound) => ({
                tag: inbound.tag!,
                rawInbound: inbound as unknown as object,
                type: inbound.protocol,
                network: inbound.streamSettings?.network ?? null,
                security: inbound.streamSettings?.security ?? null,
                port: this.parsePort(inbound.port),
            }));
    }

    public excludeInbounds(tags: string[]): void {
        const tagSet = new Set(tags);
        this.config.inbounds = this.config.inbounds!.filter((inbound) => !tagSet.has(inbound.tag!));
    }

    public leaveInbounds(tags: Set<string>): void {
        this.config.inbounds = this.config.inbounds!.filter(
            (inbound) => tags.has(inbound.tag!) || !this.hasManagedClients(inbound),
        );
    }

    public processCertificates(): XrayConfig {
        if (!this.config.inbounds) return this.config;

        for (const inbound of this.config.inbounds) {
            const certs = inbound.streamSettings?.tlsSettings?.certificates;
            if (!certs) continue;

            inbound.streamSettings!.tlsSettings!.certificates = certs.map((cert) =>
                this.resolveCertificate(cert),
            );
        }

        return this.config;
    }

    private resolveCertificate(cert: TLSCertConfig): TLSCertConfig {
        try {
            const resolved = { ...cert };

            if (resolved.certificateFile) {
                resolved.certificate = this.readPemLines(resolved.certificateFile);
                delete resolved.certificateFile;
            }

            if (resolved.keyFile) {
                resolved.key = this.readPemLines(resolved.keyFile);
                delete resolved.keyFile;
            }

            return resolved;
        } catch {
            return cert;
        }
    }

    private readPemLines(filePath: string): string[] {
        return readFileSync(filePath, 'utf-8')
            .replace(/\r\n/g, '\n')
            .split('\n')
            .filter((line) => line);
    }

    private hasManagedClients(inbound: InboundConfig): inbound is {
        settings: ManagedInboundSettings;
    } & InboundConfig {
        return MANAGED_CLIENT_PROTOCOLS.has(inbound.protocol);
    }

    public cleanInboundClients(injectFlow: boolean): void {
        if (!this.config.inbounds) return;

        for (const inbound of this.config.inbounds) {
            if (!this.hasManagedClients(inbound)) continue;

            this.ensureSettings(inbound);
            inbound.settings!.clients = [];

            if (injectFlow && inbound.protocol === 'vless') {
                inbound.settings!.flow = getVlessFlow(inbound);
            }
        }
    }

    public includeUserBatch(
        users: UserForConfigEntity[],
        inboundsUserSets: Map<string, HashedSet>,
    ): XrayConfig {
        if (!this.config.inbounds) return this.config;

        const usersByTag = this.groupUsersByTag(users, inboundsUserSets);

        const inboundMap = new Map(
            this.config.inbounds
                .filter((inbound) => this.hasManagedClients(inbound))
                .map((inbound) => [inbound.tag, inbound]),
        );

        for (const [tag, tagUsers] of usersByTag) {
            const inbound = inboundMap.get(tag);
            if (!inbound) continue;

            this.ensureSettings(inbound);
            this.addUsersToInbound(inbound, tagUsers);
        }

        return this.config;
    }

    private groupUsersByTag(
        users: UserForConfigEntity[],
        inboundsUserSets: Map<string, HashedSet>,
    ): Map<string, UserForConfigEntity[]> {
        const usersByTag = new Map<string, UserForConfigEntity[]>();

        for (const user of users) {
            for (const tag of user.tags) {
                let tagUsers = usersByTag.get(tag);
                if (!tagUsers) {
                    tagUsers = [];
                    usersByTag.set(tag, tagUsers);
                }
                tagUsers.push(user);

                if (!inboundsUserSets.has(tag)) {
                    inboundsUserSets.set(tag, new HashedSet());
                }
                inboundsUserSets.get(tag)!.add(user.vlessUuid);
            }
        }

        return usersByTag;
    }

    private addUsersToInbound(inbound: InboundConfig, users: UserForConfigEntity[]): void {
        switch (inbound.protocol) {
            case 'trojan':
                if (!inbound.settings) {
                    inbound.settings = {};
                }
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
                if (!inbound.settings) {
                    inbound.settings = {};
                }
                inbound.settings.clients ??= [];

                for (const user of users) {
                    inbound.settings.clients.push({
                        id: user.vlessUuid,
                        email: user.tId.toString(),
                    });
                }
                break;

            case 'hysteria':
                if (!inbound.settings) {
                    inbound.settings = {};
                }
                inbound.settings.clients ??= [];

                for (const user of users) {
                    inbound.settings.clients.push({
                        id: user.vlessUuid,
                        auth: user.vlessUuid,
                        email: user.tId.toString(),
                    });
                }
                break;

            case 'shadowsocks': {
                if (!inbound.settings) {
                    inbound.settings = {};
                }
                inbound.settings.clients ??= [];

                const method = inbound.settings.method;
                const isSS2022 = isSS2022MethodFromMethod(method);

                for (const user of users) {
                    inbound.settings.clients.push({
                        password: getSsPassword(user.ssPassword, isSS2022),
                        ...(!isSS2022 && { method: method || 'chacha20-ietf-poly1305' }),
                        email: user.tId.toString(),
                        id: user.vlessUuid,
                    });
                }
                break;
            }

            default:
                throw new Error(`Protocol ${inbound.protocol} is not supported.`);
        }
    }

    private ensureSettings(inbound: InboundConfig): void {
        inbound.settings ??= {};
    }

    public fixIncorrectServerNames(): void {
        if (!this.config.inbounds) return;

        for (const inbound of this.config.inbounds) {
            if (inbound.protocol !== 'vless') continue;

            const serverNames = inbound.streamSettings?.realitySettings?.serverNames;
            if (!serverNames || serverNames.length === 0) continue;

            inbound.streamSettings!.realitySettings!.serverNames = [
                ...new Set(
                    serverNames.flatMap((name) => name.split(',').map((part) => part.trim())),
                ),
            ];
        }
    }

    public replaceSnippets(snippets: Map<string, unknown>): void {
        if (this.config.outbounds) {
            this.replaceSnippetsInArray(this.config.outbounds, snippets);
        }

        if (!this.config.routing) return;

        if (this.config.routing.rules) {
            if (this.config.routing.rules) {
                this.replaceSnippetsInArray(this.config.routing.rules, snippets);
            }
            if (this.config.routing.balancers) {
                this.replaceSnippetsInArray(this.config.routing.balancers, snippets);
            }
        }
    }

    private replaceSnippetsInArray(
        array: RoutingRule[] | BalancingRule[] | undefined,
        snippetsMap: Map<string, unknown>,
    ): void {
        if (!array) return;

        for (let i = array.length - 1; i >= 0; i--) {
            const item = array[i];
            if (!item.snippet) continue;

            const snippet = snippetsMap.get(item.snippet as string);

            if (snippet) {
                if (Array.isArray(snippet)) {
                    array.splice(i, 1, ...snippet);
                } else {
                    array[i] = snippet as Record<string, unknown>;
                }
            } else {
                array.splice(i, 1);
            }
        }
    }

    private parseConfig(configInput: TCtrXRayConfig): XrayConfig {
        if (typeof configInput === 'string') {
            try {
                return JSON.parse(configInput) as XrayConfig;
            } catch (error) {
                throw new Error(`Invalid JSON input: ${error}`);
            }
        }

        if (typeof configInput === 'object') {
            return configInput as XrayConfig;
        }

        throw new Error('Invalid configuration format.');
>>>>>>> upstream/main
    }

    private validate(): void {
        if (!this.config.inbounds || this.config.inbounds.length === 0) {
            throw new Error("Config doesn't have inbounds.");
        }

        const seenTags = new Set<string>();
<<<<<<< HEAD
        for (const inbound of this.config.inbounds) {
            const network = inbound.streamSettings?.network;

            if (
                network &&
                !['grpc', 'httpupgrade', 'raw', 'tcp', 'ws', 'xhttp'].includes(network)
            ) {
                throw new Error(
                    `Invalid network type "${network}" in inbound "${inbound.tag}". Allowed values are: raw (or tcp), ws, httpupgrade, xhttp and grpc`,
                );
            }

            if (
                ![
                    'dokodemo-door',
                    'http',
                    'mixed',
                    'shadowsocks',
                    'trojan',
                    'vless',
                    'wireguard',
                ].includes(inbound.protocol)
            ) {
                throw new Error(
                    `Invalid protocol in inbound "${inbound.tag}". Allowed values are: shadowsocks, trojan, vless, dokodemo-door, http, mixed, wireguard`,
                );
            }

            // console.log(`Inbound ${inbound.tag} network: ${network || 'not set'}`);

            if (!inbound.tag) {
                throw new Error('All inbounds must have a unique tag.');
            }
            if (inbound.tag.includes(',')) {
                throw new Error("Character ',' is not allowed in inbound tag.");
            }
            if (seenTags.has(inbound.tag)) {
                throw new Error(
                    `Duplicate inbound tag "${inbound.tag}" found. All inbound tags must be unique.`,
                );
            }
            seenTags.add(inbound.tag);
        }
    }

    private resolveInbounds(): void {
        for (const inbound of this.config.inbounds) {
            const settings: Inbound = {
                ...inbound,
                tag: inbound.tag,
                protocol: inbound.protocol,
            };

            this.inbounds.push(settings);
            this.inboundsByTag[inbound.tag] = settings;
            if (!this.inboundsByProtocol[settings.protocol]) {
                this.inboundsByProtocol[settings.protocol] = [];
            }
            this.inboundsByProtocol[settings.protocol!].push(settings);
        }
    }

    public static getXrayConfigInstance(config: TCtrXRayConfig): XRayConfig {
        return new XRayConfig(config);
    }

    public getInbound(tag: string): Inbound | undefined {
        return this.config.inbounds.find((inbound) => inbound.tag === tag);
    }

    public excludeInbounds(tags: string[]): void {
        this.config.inbounds = this.config.inbounds.filter(
            (inbound) => !tags.includes(inbound.tag),
        );
    }

    public leaveInbounds(tags: Set<string>): void {
        this.config.inbounds = this.config.inbounds.filter(
            (inbound) => tags.has(inbound.tag) || !this.isInboundWithUsers(inbound.protocol),
        );
    }

    private getInbounds(): Inbound[] {
        return this.inbounds;
    }

    public getConfig(): IXrayConfig {
        return this.config;
    }

    private getInboundByProtocol(protocol: string): Inbound[] {
        return this.inboundsByProtocol[protocol] || [];
    }

    private toJSON(): string {
        return JSON.stringify(this.config, null, 2);
    }

    private sortObjectByKeys<T extends IXrayConfig>(obj: T): T {
        const sortedObj = {} as Record<string, unknown>;

        for (const key of this.CONFIG_KEY_ORDER) {
            if (key in obj) {
                sortedObj[key] = obj[key as keyof T];
            }
        }

        for (const key in obj) {
            if (!(key in sortedObj)) {
                sortedObj[key] = obj[key];
            }
        }

        return sortedObj as T;
    }

    public processCertificates(): IXrayConfig {
        const config = this.config;

        for (const inbound of config.inbounds) {
            const tlsSettings = inbound?.streamSettings?.tlsSettings;
            if (!tlsSettings?.certificates) continue;

            tlsSettings.certificates = tlsSettings.certificates.map((cert: Certificate) => {
                try {
                    const newCert = { ...cert };

                    if (newCert.certificateFile) {
                        const certContent = readFileSync(newCert.certificateFile, 'utf-8')
                            .replace(/\r\n/g, '\n')
                            .split('\n')
                            .filter((line) => line);
                        newCert.certificate = certContent;
                        delete newCert.certificateFile;
                    }

                    if (newCert.keyFile) {
                        const keyContent = readFileSync(newCert.keyFile, 'utf-8')
                            .replace(/\r\n/g, '\n')
                            .split('\n')
                            .filter((line) => line);
                        newCert.key = keyContent;
                        delete newCert.keyFile;
                    }

                    return newCert;
                } catch {
                    // console.error(
                    //     `Failed to read certificate files for inbound ${inbound.tag}:`,
                    //     error,
                    // );
                    return cert;
                }
            });
        }

        return config;
    }

    public getConfigHash(): string {
        const hash = hasher({
            trim: true,
            sort: false,
            // sort: {
            //     array: true,
            //     object: true,
            // },
        }).hash;

        return hash(this.getSortedConfig());
    }

    public getAllInbounds(): InboundsWithTagsAndType[] {
        return this.inbounds
            .filter((inbound) => this.isInboundWithUsers(inbound.protocol))
            .map((inbound) => ({
                tag: inbound.tag,
                rawInbound: inbound as unknown as object,
                type: inbound.protocol,
                network: inbound.streamSettings?.network ?? null,
                security: inbound.streamSettings?.security ?? null,
                port: this.getPort(inbound.port),
            }));
    }

    public cleanClients(): void {
        for (const inbound of this.config.inbounds) {
            switch (inbound.protocol) {
                case 'trojan':
                    (inbound.settings as TrojanSettings).clients = [];
                    break;
                case 'vless':
                    (inbound.settings as VLessSettings).clients = [];
                    break;
                case 'shadowsocks':
                    (inbound.settings as ShadowsocksSettings).clients = [];
                    break;
                default:
                    break;
            }
        }
    }

    public fixIncorrectServerNames(): void {
        for (const inbound of this.config.inbounds) {
            const realitySettings =
                inbound.protocol === 'vless' ? inbound.streamSettings?.realitySettings : null;

            if (!realitySettings?.serverNames?.length) {
                continue;
            }

            realitySettings.serverNames = [
                ...new Set(
                    realitySettings.serverNames.flatMap((name) =>
                        name.split(',').map((part) => part.trim()),
                    ),
                ),
            ];
        }
    }

    public getSortedConfig(): IXrayConfig {
        return this.sortObjectByKeys<IXrayConfig>(this.config);
    }

    private getPort(port: number | string | undefined): number | null {
        if (!port) {
            return null;
        }
        if (typeof port === 'string') {
            if (port.includes(',')) {
                return Number(port.split(',')[0]);
            }
            return Number(port);
=======

        for (const inbound of this.config.inbounds) {
            this.validateNetwork(inbound);
            this.validateProtocol(inbound);
            this.validateTag(inbound, seenTags);
            this.validateShadowsocks(inbound);
        }
    }

    private validateNetwork(inbound: InboundConfig): void {
        const network = inbound.streamSettings?.network;
        if (network && !ALLOWED_NETWORKS.has(network)) {
            throw new Error(
                `Invalid network type "${network}" in inbound "${inbound.tag}". ` +
                    `Allowed values are: ${[...ALLOWED_NETWORKS].join(', ')}.`,
            );
        }
    }

    private validateProtocol(inbound: InboundConfig): void {
        if (inbound.protocol && !ALLOWED_PROTOCOLS.has(inbound.protocol)) {
            throw new Error(
                `Invalid protocol in inbound "${inbound.tag}". ` +
                    `Allowed values are: ${[...ALLOWED_PROTOCOLS].join(', ')}.`,
            );
        }
    }

    private validateTag(inbound: InboundConfig, seenTags: Set<string>): void {
        if (!inbound.tag) {
            throw new Error('All inbounds must have a unique tag.');
        }
        if (inbound.tag.includes(',')) {
            throw new Error("Character ',' is not allowed in inbound tag.");
        }
        if (seenTags.has(inbound.tag)) {
            throw new Error(
                `Duplicate inbound tag "${inbound.tag}" found. All inbound tags must be unique.`,
            );
        }
        seenTags.add(inbound.tag);
    }

    private validateShadowsocks(inbound: InboundConfig): void {
        if (inbound.protocol !== 'shadowsocks') return;

        const settings = inbound.settings;

        if (!settings) {
            throw new Error('Shadowsocks settings are required.');
        }

        const method = settings.method;
        if (!method) return;

        if (!SHADOWSOCKS_METHODS.some((m) => m === method)) {
            throw new Error(
                `Unsupported Shadowsocks method "${method}". ` +
                    `Allowed methods are: ${SHADOWSOCKS_METHODS.join(', ')}.`,
            );
        }

        if (isSS2022MethodFromMethod(method)) {
            if (!settings.password) {
                throw new Error(
                    'Shadowsocks password is required for 2022-blake3-* methods. ' +
                        '(inbound → settings → password – generate with: openssl rand -base64 32)',
                );
            }
            if (settings.password.length < 32) {
                throw new Error(
                    'Shadowsocks password must be at least 32 characters long for 2022-blake3-* methods. ' +
                        '(inbound → settings → password – generate with: openssl rand -base64 32)',
                );
            }
        }
    }

    private indexInbounds(): void {
        for (const inbound of this.config.inbounds!) {
            this.inbounds.push(inbound);
            this.inboundsByTag[inbound.tag!] = inbound;
        }
    }

    private parsePort(port: number | string | undefined): number | null {
        if (!port) return null;

        if (typeof port === 'string') {
            const first = port.includes(',') ? port.split(',')[0] : port;
            return Number(first);
>>>>>>> upstream/main
        }

        return port;
    }
<<<<<<< HEAD

    public cleanInboundClients(): void {
        for (const inbound of this.config.inbounds) {
            switch (inbound.protocol) {
                case 'trojan':
                    (inbound.settings as TrojanSettings).clients = [];
                    break;
                case 'vless':
                    (inbound.settings as VLessSettings).clients = [];
                    (inbound.settings as VLessSettings).flow = getVlessFlow(inbound) || '';
                    break;
                case 'shadowsocks':
                    (inbound.settings as ShadowsocksSettings).clients = [];
                    break;
                default:
                    break;
            }
        }
    }

    private addUsersToInbound(inbound: Inbound, users: UserForConfigEntity[]): void {
        switch (inbound.protocol) {
            case 'trojan':
                (inbound.settings as TrojanSettings).clients ??= [];
                for (const user of users) {
                    (inbound.settings as TrojanSettings).clients.push({
                        password: user.trojanPassword,
                        email: user.tId.toString(),
                        id: user.vlessUuid,
                    });
                }
                break;
            case 'vless':
                (inbound.settings as VLessSettings).clients ??= [];
                for (const user of users) {
                    (inbound.settings as VLessSettings).clients.push({
                        id: user.vlessUuid,
                        email: user.tId.toString(),
                    });
                }
                break;
            case 'shadowsocks':
                (inbound.settings as ShadowsocksSettings).clients ??= [];
                for (const user of users) {
                    (inbound.settings as ShadowsocksSettings).clients.push({
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

    public includeUserBatch(
        users: UserForConfigEntity[],
        inboundsUserSets: Map<string, HashedSet>,
    ): IXrayConfig {
        const usersByTag = new Map<string, UserForConfigEntity[]>();
        for (const user of users) {
            for (const tag of user.tags) {
                if (!usersByTag.has(tag)) {
                    usersByTag.set(tag, []);
                }
                usersByTag.get(tag)!.push(user);

                if (!inboundsUserSets.has(tag)) {
                    inboundsUserSets.set(tag, new HashedSet());
                }

                inboundsUserSets.get(tag)!.add(user.vlessUuid);
            }
        }

        const inboundMap = new Map(
            this.config.inbounds
                .filter((inbound) => this.isInboundWithUsers(inbound.protocol))
                .map((inbound) => [inbound.tag, inbound]),
        );

        for (const [tag, tagUsers] of usersByTag) {
            const inbound = inboundMap.get(tag);
            if (!inbound) continue;

            inbound.settings ??= {} as InboundSettings;

            this.addUsersToInbound(inbound, tagUsers);
        }

        usersByTag.clear();

        return this.config;
    }

    public async resolveInboundAndPublicKey(): Promise<Map<string, string>> {
        const publicKeyMap = new Map<string, string>();

        for (const inbound of this.config.inbounds) {
            if (['dokodemo-door', 'http', 'mixed', 'wireguard'].includes(inbound.protocol)) {
                continue;
            }

            if (inbound.streamSettings?.realitySettings) {
                if (inbound.streamSettings.realitySettings.privateKey) {
                    try {
                        const { publicKey: jwkPublicKey } =
                            await this.createX25519KeyPairFromBase64(
                                inbound.streamSettings.realitySettings.privateKey,
                            );

                        const publicKeyJwk = jwkPublicKey.export({ format: 'jwk' });

                        if (!publicKeyJwk) {
                            continue;
                        }

                        const pubKeyRaw = publicKeyJwk.x;

                        if (!pubKeyRaw) {
                            continue;
                        }

                        publicKeyMap.set(inbound.tag, pubKeyRaw);
                    } catch {
                        continue;
                    }
                }
            }
        }

        return publicKeyMap;
    }

    private async createX25519KeyPairFromBase64(base64PrivateKey: string): Promise<{
        publicKey: KeyObject;
        privateKey: KeyObject;
    }> {
        return new Promise((resolve, reject) => {
            try {
                const rawPrivateKey = Buffer.from(base64PrivateKey, 'base64');

                const jwkPrivateKey = {
                    kty: 'OKP',
                    crv: 'X25519',
                    d: Buffer.from(rawPrivateKey).toString('base64url'),
                    x: '',
                };

                const privateKey = createPrivateKey({
                    key: jwkPrivateKey,
                    format: 'jwk',
                });

                const publicKey = createPublicKey(privateKey);

                resolve({ publicKey, privateKey });
            } catch (error) {
                reject(error);
            }
        });
    }

    private isInboundWithUsers(protocol: string): boolean {
        return !['dokodemo-door', 'http', 'mixed', 'wireguard'].includes(protocol);
    }

    public replaceSnippets(snippets: Map<string, unknown>): void {
        if (this.config.outbounds) {
            this.replaceSnippetsInArray(this.config.outbounds as any[], snippets);
        }
        if (this.config.routing) {
            if (typeof this.config.routing === 'object' && 'rules' in this.config.routing) {
                this.replaceSnippetsInArray(this.config.routing.rules as any[], snippets);
            }
            if (typeof this.config.routing === 'object' && 'balancers' in this.config.routing) {
                this.replaceSnippetsInArray(this.config.routing.balancers as any[], snippets);
            }
        }
    }

    private replaceSnippetsInArray = (array: any[], snippetsMap: Map<string, unknown>): void => {
        for (let i = array.length - 1; i >= 0; i--) {
            const item = array[i];

            if (item.snippet) {
                const snippet = snippetsMap.get(item.snippet);

                if (snippet) {
                    if (Array.isArray(snippet)) {
                        array.splice(i, 1, ...snippet);
                    } else {
                        array[i] = snippet;
                    }
                } else {
                    array.splice(i, 1);
                }
            }
        }
    };
=======
>>>>>>> upstream/main
}
