import yaml from 'yaml';
import _ from 'lodash';

import { Injectable, Logger } from '@nestjs/common';

import { SubscriptionTemplateService } from '@modules/subscription-template/subscription-template.service';

<<<<<<< HEAD
import { IFormattedHost } from './interfaces/formatted-hosts.interface';

export interface NetworkConfig {
=======
import { ResolvedProxyConfig } from '../resolve-proxy/interfaces';

interface NetworkConfig {
>>>>>>> upstream/main
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
}

<<<<<<< HEAD
export interface ProxyNode {
    [key: string]: any;
=======
interface ProxyNode {
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
    sni?: string;
    tls?: boolean;
    type: string;
    udp: boolean;
    uuid?: string;
}

<<<<<<< HEAD
export interface ClashData {
=======
interface ClashData {
>>>>>>> upstream/main
    proxies: ProxyNode[];
    rules: string[];
}

<<<<<<< HEAD
=======
const UNSUPPORTED_TRANSPORTS = new Set(['hysteria', 'kcp', 'xhttp']);
const UNSUPPORTED_PROTOCOLS = new Set(['hysteria', 'vless']);
>>>>>>> upstream/main
@Injectable()
export class ClashGeneratorService {
    private readonly logger = new Logger(ClashGeneratorService.name);

    constructor(private readonly subscriptionTemplateService: SubscriptionTemplateService) {}

    public async generateConfig(
<<<<<<< HEAD
        hosts: IFormattedHost[],
        overrideTemplateName?: string,
    ): Promise<string> {
        try {
            const data: ClashData = {
                proxies: [],
                rules: [],
            };

            const proxyRemarks: string[] = [];

            for (const host of hosts) {
                if (host.serviceInfo.excludeFromSubscriptionTypes.includes('CLASH')) continue;
                this.addProxy(host, data, proxyRemarks);
=======
        hosts: ResolvedProxyConfig[],
        overrideTemplateName?: string,
    ): Promise<string> {
        try {
            const data: ClashData = { proxies: [], rules: [] };
            const proxyRemarks: string[] = [];

            for (const host of hosts) {
                if (host.metadata.excludeFromSubscriptionTypes.includes('CLASH')) continue;
                if (UNSUPPORTED_TRANSPORTS.has(host.transport)) continue;
                if (UNSUPPORTED_PROTOCOLS.has(host.protocol)) continue;

                const node = this.buildProxyNode(host);
                if (!node) continue;

                data.proxies.push(node);
                proxyRemarks.push(host.finalRemark);
>>>>>>> upstream/main
            }

            return await this.renderConfig(data, proxyRemarks, overrideTemplateName);
        } catch (error) {
            this.logger.error('Error generating clash config:', error);
            return '';
        }
    }

<<<<<<< HEAD
=======
    private buildProxyNode(host: ResolvedProxyConfig): ProxyNode | null {
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

        const netOpts = this.buildNetworkOpts(host);
        if (Object.keys(netOpts).length > 0) {
            node[`${node.network}-opts`] = netOpts;
        }

        node['client-fingerprint'] = this.resolveFingerprint(host);

        return node;
    }

    private resolveClashType(protocol: string): string {
        return protocol === 'shadowsocks' ? 'ss' : protocol;
    }

    private applyProtocolFields(node: ProxyNode, host: ResolvedProxyConfig): boolean {
        switch (host.protocol) {
            case 'trojan':
                node.password = host.protocolOptions.password;
                return true;

            case 'shadowsocks':
                node.password = host.protocolOptions.password;
                node.cipher = host.protocolOptions.method;
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

                if (opts.allowInsecure) {
                    node['skip-cert-verify'] = true;
                }
                break;
            }
            case 'none':
                break;
            default:
                break;
        }
    }

    private resolveFingerprint(host: ResolvedProxyConfig): string {
        switch (host.security) {
            case 'tls':
                return host.securityOptions.fingerprint ?? 'chrome';
            default:
                return 'chrome';
        }
    }

    private resolveClashNetwork(host: ResolvedProxyConfig): string {
        const transport = host.transport;

        if (transport === 'tcp' && host.transportOptions.header?.type === 'http') {
            return 'http';
        }

        if (transport === 'httpupgrade') {
            return 'ws';
        }

        return transport;
    }

    private buildNetworkOpts(host: ResolvedProxyConfig): NetworkConfig {
        switch (host.transport) {
            case 'ws':
                return this.buildWsOpts(host.transportOptions.path, host.transportOptions.host);

            case 'httpupgrade':
                return this.buildWsOpts(
                    host.transportOptions.path,
                    host.transportOptions.host,
                    true,
                );

            case 'tcp':
                return this.buildTcpOpts(host);

            case 'grpc':
                return this.buildGrpcOpts(host.transportOptions.serviceName);

            default:
                return {};
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

        // Parse ?ed= from path
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

    private buildTcpOpts(host: Extract<ResolvedProxyConfig, { transport: 'tcp' }>): NetworkConfig {
        // TCP with no header or 'none' header — no opts needed
        if (!host.transportOptions.header || host.transportOptions.header.type === 'none') {
            return {};
        }

        // HTTP camouflage is handled by clash network = 'http', no extra opts typically needed
        return {};
    }

    private buildGrpcOpts(serviceName: string | null): NetworkConfig {
        return {
            'grpc-service-name': serviceName ?? '',
        };
    }

    // ── Template Rendering ───────────────────────────

>>>>>>> upstream/main
    private async renderConfig(
        data: ClashData,
        proxyRemarks: string[],
        overrideTemplateName?: string,
    ): Promise<string> {
<<<<<<< HEAD
        const yamlConfigDb = await this.subscriptionTemplateService.getCachedTemplateByType(
            'CLASH',
            overrideTemplateName,
        );

        const yamlConfig = yamlConfigDb as unknown as any;
=======
        const yamlConfig = (await this.subscriptionTemplateService.getCachedTemplateByType(
            'CLASH',
            overrideTemplateName,
        )) as Record<string, unknown>;
>>>>>>> upstream/main

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
=======
            (yamlConfig.proxies as ProxyNode[]).push(...data.proxies);

            for (const group of yamlConfig['proxy-groups'] as Record<string, unknown>[]) {
                if (!Array.isArray(group.proxies)) {
                    group.proxies = [];
                }

                const remarks = this.resolveGroupRemarks(group, proxyRemarks);

                (group.proxies as string[]).push(...remarks);
>>>>>>> upstream/main
            }

            return yaml.stringify(yamlConfig);
        } catch (error) {
            this.logger.error('Error rendering yaml config:', error);
            return '';
        }
    }

<<<<<<< HEAD
    private addProxy(host: IFormattedHost, data: ClashData, proxyRemarks: string[]): void {
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
            tls: host.tls === 'tls',
            sni: host.sni || '',
            host: host.host,
            path: host.path || '',
            headers: '',
            udp: true,
            alpn: host.alpn,
            clientFingerprint: host.fingerprint,
            allowInsecure: host.allowInsecure,
        });

        switch (host.protocol) {
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
        clientFingerprint?: string;
        allowInsecure?: boolean;
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
            clientFingerprint,
            allowInsecure,
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
            const parsedEd = parseInt(edPart.split('/')[0]);
            maxEarlyData = isNaN(parsedEd) ? undefined : parsedEd;
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
            if (allowInsecure) {
                node['skip-cert-verify'] = allowInsecure;
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
        }

        if (remnawaveCustom?.['include-proxies'] === false) {
            return [];
        }

        if (remnawaveCustom?.['select-random-proxy'] === true) {
            const random = proxyRemarks[Math.floor(Math.random() * proxyRemarks.length)];
            return random ? [random] : [];
        }

        if (remnawaveCustom?.['shuffle-proxies-order'] === true) {
            return _.shuffle(proxyRemarks);
        }

        return [...proxyRemarks];
>>>>>>> upstream/main
    }
}
