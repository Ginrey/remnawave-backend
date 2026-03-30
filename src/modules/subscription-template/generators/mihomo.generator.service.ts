import yaml from 'yaml';
import _ from 'lodash';

import { Injectable, Logger } from '@nestjs/common';

import { SubscriptionTemplateService } from '@modules/subscription-template/subscription-template.service';

<<<<<<< HEAD
import { IFormattedHost } from './interfaces/formatted-hosts.interface';

export interface ClashData {
=======
import { ResolvedProxyConfig } from '../resolve-proxy/interfaces';

export interface MihomoData {
>>>>>>> upstream/main
    proxies: ProxyNode[];
    rules: string[];
}

interface NetworkConfig {
    'early-data-header-name'?: string;
    'grpc-service-name'?: string;
    headers?: Record<string, string>;
    Host?: string;
    host?: string[];
    'max-early-data'?: number;
    path?: string | string[];
<<<<<<< HEAD
    smux?: {
        [key: string]: any;
        enabled: boolean;
    };
=======
    smux?: { [key: string]: unknown; enabled: boolean };
>>>>>>> upstream/main
    'v2ray-http-upgrade'?: boolean;
    'v2ray-http-upgrade-fast-open'?: boolean;
    'public-key'?: string;
    'short-id'?: string;
}

interface ProxyNode {
<<<<<<< HEAD
    [key: string]: any;
=======
    [key: string]: unknown;
>>>>>>> upstream/main
    alpn?: string[];
    alterId?: number;
    cipher?: string;
    name: string;
    network: string;
    password?: string;
    port: number;
    server: string;
    servername?: string;
    'skip-cert-verify'?: boolean;
    'packet-encoding'?: string;
    sni?: string;
    tls?: boolean;
    type: string;
    udp: boolean;
    uuid?: string;
    serverDescription?: string;
}

<<<<<<< HEAD
=======
const UNSUPPORTED_TRANSPORTS = new Set(['hysteria', 'kcp', 'xhttp']);
const UNSUPPORTED_PROTOCOLS = new Set(['hysteria']);

>>>>>>> upstream/main
@Injectable()
export class MihomoGeneratorService {
    private readonly logger = new Logger(MihomoGeneratorService.name);

    constructor(private readonly subscriptionTemplateService: SubscriptionTemplateService) {}

<<<<<<< HEAD
    async generateConfig(
        hosts: IFormattedHost[],
        isStash: boolean = false,
        isFlClashX = false,
=======
    public async generateConfig(
        hosts: ResolvedProxyConfig[],
        isStash = false,
        isExtendedClient = false,
>>>>>>> upstream/main
        overrideTemplateName?: string,
    ): Promise<string> {
        try {
            const yamlConfigDb = await this.subscriptionTemplateService.getCachedTemplateByType(
                isStash ? 'STASH' : 'MIHOMO',
                overrideTemplateName,
            );

<<<<<<< HEAD
            const yamlConfig = yamlConfigDb as unknown as any;

            const { remnawave, ...cleanConfig } = yamlConfig ?? {};
            const includeHidden = remnawave?.includeHiddenHosts ?? false;

            const data: ClashData = {
                proxies: [],
                rules: [],
            };
            const proxyRemarks: string[] = [];

            for (const host of hosts) {
                if (!includeHidden && host.serviceInfo.isHidden) continue;
                if (host.serviceInfo.excludeFromSubscriptionTypes.includes('MIHOMO') && !isStash)
                    continue;
                if (host.serviceInfo.excludeFromSubscriptionTypes.includes('STASH') && isStash)
                    continue;

                this.addProxy(host, data, proxyRemarks, isFlClashX);
=======
            const yamlConfig = yamlConfigDb as Record<string, unknown>;

            const { remnawave, ...cleanConfig } = yamlConfig ?? {};
            const remnawaveConfig = remnawave as Record<string, unknown> | undefined;
            const includeHidden = remnawaveConfig?.includeHiddenHosts ?? false;

            const data: MihomoData = { proxies: [], rules: [] };
            const proxyRemarks: string[] = [];

            for (const host of hosts) {
                if (!includeHidden && host.metadata.isHidden) continue;

                const subType = isStash ? 'STASH' : 'MIHOMO';
                if (host.metadata.excludeFromSubscriptionTypes.includes(subType)) continue;

                if (UNSUPPORTED_TRANSPORTS.has(host.transport)) continue;
                if (UNSUPPORTED_PROTOCOLS.has(host.protocol)) continue;

                const node = this.buildProxyNode(host, isExtendedClient);
                if (!node) continue;

                data.proxies.push(node);
                proxyRemarks.push(host.finalRemark);
>>>>>>> upstream/main
            }

            return await this.renderConfig(data, proxyRemarks, cleanConfig);
        } catch (error) {
            this.logger.error('Error generating clash config:', error);
            return '';
        }
    }

<<<<<<< HEAD
    private async renderConfig(
        data: ClashData,
        proxyRemarks: string[],
        yamlConfig: any,
=======
    private buildProxyNode(host: ResolvedProxyConfig, isExtendedClient: boolean): ProxyNode | null {
        const node: ProxyNode = {
            name: host.finalRemark,
            type: this.resolveClashType(host.protocol),
            server: host.address,
            port: host.port,
            network: this.resolveClashNetwork(host),
            udp: true,
        };

        if (!this.applyProtocolFields(node, host)) {
            return null;
        }

        this.applySecurityFields(node, host);
        this.applyTransportOpts(node, host);

        node['client-fingerprint'] = this.resolveFingerprint(host);

        if (isExtendedClient && host.clientOverrides.serverDescription) {
            node.serverDescription = Buffer.from(
                host.clientOverrides.serverDescription,
                'base64',
            ).toString();
        }

        return node;
    }

    private resolveClashType(protocol: string): string {
        return protocol === 'shadowsocks' ? 'ss' : protocol;
    }

    private applyProtocolFields(node: ProxyNode, host: ResolvedProxyConfig): boolean {
        switch (host.protocol) {
            case 'vless':
                node.uuid = host.protocolOptions.id;
                node['packet-encoding'] = 'xudp';

                if (host.protocolOptions.flow === 'xtls-rprx-vision') {
                    node.flow = host.protocolOptions.flow;
                }

                if (host.protocolOptions.encryption && host.protocolOptions.encryption !== 'none') {
                    node.encryption = host.protocolOptions.encryption;
                }
                return true;

            case 'trojan':
                node.password = host.protocolOptions.password;
                return true;

            case 'shadowsocks':
                node.password = host.protocolOptions.password;
                node.cipher = host.protocolOptions.method;
                node['udp-over-tcp'] = host.protocolOptions.uot;
                node['udp-over-tcp-version'] = host.protocolOptions.uotVersion;
                return true;

            default:
                return false;
        }
    }

    private applySecurityFields(node: ProxyNode, host: ResolvedProxyConfig): void {
        switch (host.security) {
            case 'tls': {
                const opts = host.securityOptions;
                node.tls = true;

                if (node.type === 'trojan') {
                    node.sni = opts.serverName ?? '';
                } else {
                    node.servername = opts.serverName ?? '';
                }

                if (opts.alpn) {
                    node.alpn = opts.alpn.split(',');
                }

                if (opts.allowInsecure && node.type !== 'ss') {
                    node['skip-cert-verify'] = true;
                }
                break;
            }
            case 'reality': {
                const opts = host.securityOptions;
                node.tls = true;

                if (node.type === 'trojan') {
                    node.sni = opts.serverName;
                } else {
                    node.servername = opts.serverName;
                }

                if (opts.publicKey) {
                    const realityOpts: Record<string, unknown> = {
                        'public-key': opts.publicKey,
                        'short-id': opts.shortId,
                    };

                    if (host.clientOverrides.mihomoX25519) {
                        realityOpts['support-x25519mlkem768'] = true;
                    }

                    node['reality-opts'] = realityOpts;
                }
                break;
            }
            case 'none':
                break;
        }
    }

    private resolveFingerprint(host: ResolvedProxyConfig): string {
        switch (host.security) {
            case 'tls':
                return host.securityOptions.fingerprint ?? 'chrome';
            case 'reality':
                return host.securityOptions.fingerprint ?? 'chrome';
            case 'none':
                return 'chrome';
        }
    }

    private resolveClashNetwork(host: ResolvedProxyConfig): string {
        if (host.transport === 'tcp' && host.transportOptions.header?.type === 'http') {
            return 'http';
        }

        if (host.transport === 'httpupgrade') {
            return 'ws';
        }
        return host.transport;
    }

    private applyTransportOpts(node: ProxyNode, host: ResolvedProxyConfig): void {
        let netOpts: NetworkConfig = {};

        switch (host.transport) {
            case 'ws':
                netOpts = this.buildWsOpts(host.transportOptions.path, host.transportOptions.host);
                break;

            case 'httpupgrade':
                netOpts = this.buildWsOpts(
                    host.transportOptions.path,
                    host.transportOptions.host,
                    true,
                );
                break;

            case 'tcp':
                netOpts = this.buildTcpOpts();
                break;

            case 'grpc':
                netOpts = this.buildGrpcOpts(host.transportOptions.serviceName);
                break;

            default:
                return;
        }

        if (Object.keys(netOpts).length > 0) {
            node[`${node.network}-opts`] = netOpts;
        }
    }

    private buildWsOpts(
        rawPath: string | null,
        host: string | null,
        isHttpUpgrade = false,
    ): NetworkConfig {
        const config: NetworkConfig = {};

        let path = rawPath ?? '';
        let maxEarlyData: number | undefined;
        let earlyDataHeaderName = '';

        if (path.includes('?ed=')) {
            const [pathPart, edPart] = path.split('?ed=');
            path = pathPart;
            const parsed = parseInt(edPart.split('/')[0]);
            maxEarlyData = isNaN(parsed) ? undefined : parsed;
            earlyDataHeaderName = 'Sec-WebSocket-Protocol';
        }

        if (path) {
            config.path = path;
        }

        config.headers = host ? { Host: host } : {};

        if (maxEarlyData !== undefined) {
            config['max-early-data'] = maxEarlyData;
        }

        if (earlyDataHeaderName) {
            config['early-data-header-name'] = earlyDataHeaderName;
        }

        if (isHttpUpgrade) {
            config['v2ray-http-upgrade'] = true;
            config['v2ray-http-upgrade-fast-open'] = true;
        }

        return config;
    }

    private buildTcpOpts(): NetworkConfig {
        return {};
    }

    private buildGrpcOpts(serviceName: string | null): NetworkConfig {
        return {
            'grpc-service-name': serviceName ?? '',
        };
    }

    private async renderConfig(
        data: MihomoData,
        proxyRemarks: string[],
        yamlConfig: Record<string, unknown>,
>>>>>>> upstream/main
    ): Promise<string> {
        try {
            if (!Array.isArray(yamlConfig.proxies)) {
                yamlConfig.proxies = [];
            }

            if (!Array.isArray(yamlConfig['proxy-groups'])) {
                yamlConfig['proxy-groups'] = [];
            }

<<<<<<< HEAD
            for (const group of yamlConfig['proxy-groups']) {
                if (!Array.isArray(group.proxies)) {
                    group.proxies = [];
                }
            }

            for (const proxy of data.proxies) {
                yamlConfig.proxies.push(proxy);
            }

            for (const group of yamlConfig['proxy-groups']) {
                let remnawaveCustom = undefined;

                if (group?.remnawave) {
                    remnawaveCustom = group.remnawave;

                    delete group.remnawave;
                }

                if (remnawaveCustom && remnawaveCustom['include-proxies'] === false) {
                    continue;
                }

                if (remnawaveCustom && remnawaveCustom['select-random-proxy'] === true) {
                    const randomProxy =
                        proxyRemarks[Math.floor(Math.random() * proxyRemarks.length)];

                    if (randomProxy) {
                        group.proxies.push(randomProxy);
                    }

                    continue;
                }

                if (remnawaveCustom && remnawaveCustom['shuffle-proxies-order'] === true) {
                    const shuffledProxies = _.shuffle(proxyRemarks);

                    for (const proxyRemark of shuffledProxies) {
                        group.proxies.push(proxyRemark);
                    }

                    continue;
                }

                if (Array.isArray(group.proxies)) {
                    for (const proxyRemark of proxyRemarks) {
                        group.proxies.push(proxyRemark);
                    }
                }
            }

            if (yamlConfig['proxy-providers']) {
                // dialer-proxy support
                for (const providerKey in yamlConfig['proxy-providers']) {
                    const provider = yamlConfig['proxy-providers'][providerKey];

                    let remnawaveCustom = undefined;

                    if (provider?.remnawave) {
                        remnawaveCustom = provider.remnawave;

                        delete provider.remnawave;
                    } else {
                        continue;
                    }

                    if (remnawaveCustom && remnawaveCustom['include-proxies'] === true) {
                        provider.payload = [];

                        for (const proxy of data.proxies) {
                            provider.payload.push(proxy);
                        }
                    }
                }
            }
=======
            (yamlConfig.proxies as ProxyNode[]).push(...data.proxies);

            for (const group of yamlConfig['proxy-groups'] as Record<string, unknown>[]) {
                if (!Array.isArray(group.proxies)) {
                    group.proxies = [];
                }

                const remarks = this.resolveGroupRemarks(group, proxyRemarks);
                (group.proxies as string[]).push(...remarks);
            }

            this.applyProxyProviders(yamlConfig, data);
>>>>>>> upstream/main

            return yaml.stringify(yamlConfig);
        } catch (error) {
            this.logger.error(`Error rendering yaml config: ${error}`);
            return '';
        }
    }

<<<<<<< HEAD
    private addProxy(
        host: IFormattedHost,
        data: ClashData,
        proxyRemarks: string[],
        isFlClashX: boolean,
    ): void {
        if (host.network === 'xhttp') {
            return;
        }

        const proxyRemark = host.remark;

        const node = this.makeNode({
            name: host.remark,
            remark: proxyRemark,
            type: host.protocol,
            server: host.address,
            port: Number(host.port),
            network: host.network || 'tcp',
            tls: ['reality', 'tls'].includes(host.tls),
            sni: host.sni || '',
            host: host.host,
            path: host.path || '',
            headers: '',
            udp: true,
            alpn: host.alpn,
            publicKey: host.publicKey,
            shortId: host.shortId,
            clientFingerprint: host.fingerprint,
            allowInsecure: host.allowInsecure,
            mihomoX25519: host.mihomoX25519,
        });

        switch (host.protocol) {
            case 'vless':
                node.uuid = host.password.vlessPassword;
                node['packet-encoding'] = 'xudp';

                if (host.flow === 'xtls-rprx-vision') {
                    node.flow = host.flow;
                }

                if (host.encryption && host.encryption !== 'none') {
                    node.encryption = host.encryption;
                }

                break;
            case 'trojan':
                node.password = host.password.trojanPassword;
                break;
            case 'shadowsocks':
                node.password = host.password.ssPassword;
                node.cipher = 'chacha20-ietf-poly1305';
                break;
            default:
                return;
        }

        if (host.serverDescription && isFlClashX) {
            // supported in FlClashX, custom field
            node.serverDescription = Buffer.from(host.serverDescription, 'base64').toString();
        }

        data.proxies.push(node);
        proxyRemarks.push(proxyRemark);
    }

    private makeNode(params: {
        name: string;
        remark: string;
        type: string;
        server: string;
        port: number;
        network: string;
        tls: boolean;
        sni: string;
        host: string;
        path: string;
        headers: string;
        udp: boolean;
        alpn?: string;
        publicKey?: string;
        shortId?: string;
        clientFingerprint?: string;
        allowInsecure?: boolean;
        mihomoX25519?: boolean;
    }): ProxyNode {
        const {
            server,
            port,
            remark,
            tls,
            sni,
            alpn,
            udp,
            host,
            path,
            headers,
            publicKey,
            shortId,
            clientFingerprint,
            allowInsecure,
            mihomoX25519,
        } = params;
        let { type, network } = params;

        if (type === 'shadowsocks') {
            type = 'ss';
        }
        if ((network === 'tcp' || network === 'raw') && headers === 'http') {
            network = 'http';
        }

        let isHttpupgrade = false;
        if (network === 'httpupgrade') {
            network = 'ws';
            isHttpupgrade = true;
        }

        const node: ProxyNode = {
            name: remark,
            type,
            server,
            port,
            network,
            udp,
        };

        let maxEarlyData: number | undefined;
        let earlyDataHeaderName = '';

        let pathValue = path;

        if (path.includes('?ed=')) {
            const [pathPart, edPart] = path.split('?ed=');
            pathValue = pathPart;
            maxEarlyData = parseInt(edPart.split('/')[0]);
            earlyDataHeaderName = 'Sec-WebSocket-Protocol';
        }

        if (tls) {
            node.tls = true;
            if (type === 'trojan') {
                node.sni = sni;
            } else {
                node.servername = sni;
            }
            if (alpn) {
                node.alpn = alpn.split(',');
            }
        }

        let netOpts: NetworkConfig = {};

        switch (network) {
            case 'ws':
                netOpts = this.wsConfig(
                    pathValue,
                    host,
                    maxEarlyData,
                    earlyDataHeaderName,
                    isHttpupgrade,
                );
                break;
            case 'tcp':
            case 'raw':
                netOpts = this.tcpConfig(pathValue, host);
                break;
            case 'grpc':
                netOpts = this.grpcConfig(pathValue);
                break;
        }

        if (Object.keys(netOpts).length > 0) {
            node[`${network}-opts`] = netOpts;
        }

        if (publicKey) {
            node['reality-opts'] = {
                'public-key': publicKey,
                'short-id': shortId,
            };

            if (mihomoX25519) {
                node['reality-opts']['support-x25519mlkem768'] = true;
            }
        }

        if (allowInsecure && type !== 'ss') {
            node['skip-cert-verify'] = allowInsecure;
        }

        node['client-fingerprint'] = clientFingerprint || 'chrome';

        return node;
    }

    private wsConfig(
        path = '',
        host = '',
        maxEarlyData?: number,
        earlyDataHeaderName = '',
        isHttpupgrade = false,
    ): NetworkConfig {
        const config: NetworkConfig = {};

        if (path) {
            config.path = path;
        }

        if (host) {
            config.headers = { Host: host };
        } else {
            config.headers = {};
        }

        if (maxEarlyData !== undefined) {
            config['max-early-data'] = maxEarlyData;
        }

        if (earlyDataHeaderName) {
            config['early-data-header-name'] = earlyDataHeaderName;
        }

        if (isHttpupgrade) {
            config['v2ray-http-upgrade'] = true;
            config['v2ray-http-upgrade-fast-open'] = true;
        }

        return config;
    }

    private tcpConfig(path = '', host = ''): NetworkConfig {
        const config: NetworkConfig = {};

        if (!path && !host) {
            return config;
        }

        return config;
    }

    private grpcConfig(path = ''): NetworkConfig {
        const config: NetworkConfig = {};

        config['grpc-service-name'] = path;

        return config;
=======
    private resolveGroupRemarks(group: Record<string, unknown>, proxyRemarks: string[]): string[] {
        const remnawaveCustom = group.remnawave as Record<string, unknown> | undefined;

        if (remnawaveCustom) {
            delete group.remnawave;
        } else {
            return [...proxyRemarks];
        }

        if (remnawaveCustom['include-proxies'] === false) {
            return [];
        }

        if (remnawaveCustom['select-random-proxy'] === true) {
            const random = proxyRemarks[Math.floor(Math.random() * proxyRemarks.length)];
            return random ? [random] : [];
        }

        if (remnawaveCustom['shuffle-proxies-order'] === true) {
            return _.shuffle(proxyRemarks);
        }

        return [...proxyRemarks];
    }

    private applyProxyProviders(yamlConfig: Record<string, unknown>, data: MihomoData): void {
        const providers = yamlConfig['proxy-providers'] as
            | Record<string, Record<string, unknown>>
            | undefined;
        if (!providers) return;

        for (const providerKey in providers) {
            const provider = providers[providerKey];

            const remnawaveCustom = provider.remnawave as Record<string, unknown> | undefined;
            if (!remnawaveCustom) continue;

            delete provider.remnawave;

            if (remnawaveCustom['include-proxies'] === true) {
                provider.payload = [...data.proxies];
            }
        }
>>>>>>> upstream/main
    }
}
