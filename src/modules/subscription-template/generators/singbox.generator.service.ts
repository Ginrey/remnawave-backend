import { Injectable } from '@nestjs/common';

import { SubscriptionTemplateService } from '@modules/subscription-template/subscription-template.service';

<<<<<<< HEAD
import { IFormattedHost } from './interfaces';
=======
import { ResolvedProxyConfig } from '../resolve-proxy/interfaces';
>>>>>>> upstream/main

interface OutboundConfig {
    flow?: string;
    method?: string;
<<<<<<< HEAD
    multiplex?: any;
=======
    multiplex?: unknown;
>>>>>>> upstream/main
    network?: string;
    outbounds?: string[];
    password?: string;
    server: string;
    server_port: number;
    tag: string;
<<<<<<< HEAD
    tls?: any;
    transport?: any;
    type: string;
    uuid?: string;
    headers?: Record<string, unknown>;
    path?: string;
    max_early_data?: number;
    early_data_header_name?: string;
=======
    tls?: TlsConfig;
    transport?: TransportConfig;
    type: string;
    uuid?: string;
    udp_over_tcp?: {
        enabled: boolean;
        version: number;
    };
>>>>>>> upstream/main
}

interface TlsConfig {
    alpn?: string[];
    enabled?: boolean;
    insecure?: boolean;
    reality?: {
        enabled: boolean;
        public_key?: string;
        short_id?: string;
    };
    server_name?: string;
    utls?: {
        enabled: boolean;
        fingerprint: string;
    };
}

interface TransportConfig {
    early_data_header_name?: string;
<<<<<<< HEAD
    headers?: Record<string, any>;
    host?: string | string[];
=======
    headers?: Record<string, unknown>;
>>>>>>> upstream/main
    max_early_data?: number;
    path?: string;
    service_name?: string;
    type: string;
}

<<<<<<< HEAD
=======
const UNSUPPORTED_TRANSPORTS = new Set(['hysteria', 'kcp', 'xhttp']);
const PROXY_PROTOCOL_TYPES = new Set(['hysteria', 'shadowsocks', 'trojan', 'vless']);
const SELECTOR_TYPES = new Set(['shadowsocks', 'trojan', 'urltest', 'vless']);

>>>>>>> upstream/main
@Injectable()
export class SingBoxGeneratorService {
    constructor(private readonly subscriptionTemplateService: SubscriptionTemplateService) {}

    public async generateConfig(
<<<<<<< HEAD
        hosts: IFormattedHost[],
=======
        hosts: ResolvedProxyConfig[],
>>>>>>> upstream/main
        overrideTemplateName?: string,
    ): Promise<string> {
        try {
            const config = await this.subscriptionTemplateService.getCachedTemplateByType(
                'SINGBOX',
                overrideTemplateName,
            );

<<<<<<< HEAD
            const proxy_remarks: string[] = [];

            for (const host of hosts) {
                if (host.serviceInfo.excludeFromSubscriptionTypes.includes('SINGBOX')) continue;

                this.addHost(host, config, proxy_remarks);
            }

            return this.renderConfig(config);
=======
            for (const host of hosts) {
                if (host.metadata.excludeFromSubscriptionTypes.includes('SINGBOX')) continue;
                if (UNSUPPORTED_TRANSPORTS.has(host.transport)) continue;

                const outbound = this.buildOutbound(host);
                if (!outbound) continue;

                (config as Record<string, unknown[]>).outbounds.push(outbound);
            }

            return this.renderConfig(config as Record<string, unknown>);
>>>>>>> upstream/main
        } catch {
            return '';
        }
    }

<<<<<<< HEAD
    private addOutbound(config: Record<string, any>, outbound_data: OutboundConfig): void {
        config.outbounds.push(outbound_data);
    }

    private renderConfig(config: Record<string, any>): string {
        const urltest_types = ['vless', 'trojan', 'shadowsocks'];
        const urltest_tags = config.outbounds
            .filter((outbound: OutboundConfig) => urltest_types.includes(outbound.type))
            .map((outbound: OutboundConfig) => outbound.tag);

        const selector_types = [...urltest_types, 'urltest'];
        const selector_tags = config.outbounds
            .filter((outbound: OutboundConfig) => selector_types.includes(outbound.type))
            .map((outbound: OutboundConfig) => outbound.tag);

        config.outbounds.forEach((outbound: OutboundConfig) => {
            if (outbound.type === 'urltest') {
                outbound.outbounds = urltest_tags;
            }
            if (outbound.type === 'selector') {
                outbound.outbounds = selector_tags;
            }
        });

        return JSON.stringify(config, null, 4);
    }

    private tlsConfig(
        sni?: string,
        fp?: string,
        tls?: string,
        pbk?: string,
        sid?: string,
        alpn?: string | string[],
        allowInsecure?: boolean,
    ): TlsConfig {
        const config: TlsConfig = {};

        if (tls === 'tls' || tls === 'reality') {
            config.enabled = true;
        }

        if (sni) {
            config.server_name = sni;
        }

        if (tls === 'reality') {
            config.reality = { enabled: true };
            if (pbk) {
                config.reality.public_key = pbk;
            }
            if (sid) {
                config.reality.short_id = sid;
            }
        }

        if (fp) {
            config.utls = {
                enabled: Boolean(fp),
                fingerprint: fp,
            };
        }

        if (allowInsecure) {
            config.insecure = allowInsecure;
        }

        if (!fp && tls === 'reality') {
            config.utls = {
                enabled: true,
                fingerprint: 'chrome',
            };
        }

        if (alpn) {
            if (typeof alpn === 'string' && alpn.includes(',')) {
                config.alpn = alpn.split(',').map((a) => a.trim());
            } else {
                config.alpn = Array.isArray(alpn) ? alpn : [alpn];
            }
        }

        return config;
    }

    private wsConfig(
        settings: Record<string, any> | undefined,
        host: string = '',
        path: string = '',
        max_early_data?: number,
        early_data_header_name?: string,
    ): TransportConfig {
        const config = structuredClone(settings?.wsSettings || { headers: {} });

        if (!config.headers) {
            config.headers = {};
        }

        if (path) {
            config.path = path;
        }
        if (host) {
            config.headers.Host = host;
        }

        if (max_early_data !== undefined) {
            config.max_early_data = max_early_data;
        }
        if (early_data_header_name) {
            config.early_data_header_name = early_data_header_name;
        }

        return config;
    }

    private httpUpgradeConfig(
        settings: Record<string, any> | undefined,
        host: string = '',
        path: string = '',
    ): TransportConfig {
        const config = structuredClone(settings?.httpupgradeSettings || { headers: {} });

        if (!config.headers) {
            config.headers = {};
        }

        if (path) {
            config.path = path;
        }
        if (host) {
            config.headers.Host = host;
        }

        return config;
    }

    private transportConfig(
        settings: Record<string, any> | undefined,
        transport_type: string = '',
        host: string = '',
        path: string = '',
        max_early_data?: number,
        early_data_header_name?: string,
    ): TransportConfig {
        let transport_config: TransportConfig = { type: transport_type };

        if (transport_type) {
            switch (transport_type) {
                case 'ws':
                    transport_config = this.wsConfig(
                        settings,
                        host,
                        path,
                        max_early_data,
                        early_data_header_name,
                    );
                    break;
                case 'httpupgrade':
                    transport_config = this.httpUpgradeConfig(settings, host, path);
                    break;
            }
        }

        transport_config.type = transport_type;
        return transport_config;
    }

    private makeOutbound(params: IFormattedHost, settings?: Record<string, any>): OutboundConfig {
        const config: OutboundConfig = {
            type: params.protocol,
            tag: params.remark,
            server: params.address,
            server_port: params.port,
        };

        if (params.flow === 'xtls-rprx-vision') {
            config.flow = params.flow;
        }

        if (params.protocol === 'shadowsocks') {
            config.network = 'tcp';
        }

        if (['httpupgrade', 'ws'].includes(params.network)) {
            let max_early_data: number | undefined;
            let early_data_header_name: string | undefined;

            if (params.path.includes('?ed=')) {
                const [pathPart, edPart] = params.path.split('?ed=');
                params.path = pathPart;
                [max_early_data] = edPart.split('/').map(Number);
                early_data_header_name = 'Sec-WebSocket-Protocol';
            }

            config.transport = this.transportConfig(
                settings,
                params.network,
                params.host,
                params.path,
                max_early_data,
                early_data_header_name,
            );
        }

        if (['reality', 'tls'].includes(params.tls)) {
            config.tls = this.tlsConfig(
                params.sni,
                params.fingerprint,
                params.tls,
                params.publicKey,
                params.shortId,
                params.alpn,
                params.allowInsecure,
            );
        }
        return config;
    }

    private addHost(
        host: IFormattedHost,
        config: Record<string, any>,
        proxy_remarks: string[],
    ): void {
        try {
            if (host.network === 'xhttp') {
                return;
            }

            const remark = host.remark;
            proxy_remarks.push(remark);

            const outbound = this.makeOutbound(host);

            switch (host.protocol) {
                case 'vless':
                    outbound.uuid = host.password.vlessPassword;
                    break;
                case 'trojan':
                    outbound.password = host.password.trojanPassword;
                    break;
                case 'shadowsocks':
                    outbound.password = host.password.ssPassword;
                    outbound.method = 'chacha20-ietf-poly1305';
                    break;
            }

            this.addOutbound(config, outbound);
        } catch {
            // silence error
        }
    }
=======
    private buildOutbound(host: ResolvedProxyConfig): OutboundConfig | null {
        try {
            const config: OutboundConfig = {
                type: host.protocol,
                tag: host.finalRemark,
                server: host.address,
                server_port: host.port,
            };

            if (!this.applyProtocolFields(config, host)) {
                return null;
            }

            this.applyTransport(config, host);
            this.applySecurity(config, host);

            return config;
        } catch {
            return null;
        }
    }

    private applyProtocolFields(config: OutboundConfig, host: ResolvedProxyConfig): boolean {
        switch (host.protocol) {
            case 'vless':
                config.uuid = host.protocolOptions.id;

                if (host.protocolOptions.flow === 'xtls-rprx-vision') {
                    config.flow = host.protocolOptions.flow;
                }
                return true;

            case 'trojan':
                config.password = host.protocolOptions.password;
                return true;

            case 'shadowsocks':
                config.password = host.protocolOptions.password;
                config.method = host.protocolOptions.method;
                config.network = 'tcp';
                config.udp_over_tcp = {
                    enabled: host.protocolOptions.uot,
                    version: host.protocolOptions.uotVersion,
                };
                return true;

            default:
                return false;
        }
    }

    private applyTransport(config: OutboundConfig, host: ResolvedProxyConfig): void {
        switch (host.transport) {
            case 'ws':
                config.transport = this.buildWsTransport(
                    host.transportOptions.path,
                    host.transportOptions.host,
                );
                break;

            case 'httpupgrade':
                config.transport = this.buildHttpUpgradeTransport(
                    host.transportOptions.path,
                    host.transportOptions.host,
                );
                break;

            case 'grpc':
                config.transport = this.buildGrpcTransport(host.transportOptions.serviceName);
                break;

            default:
                break;
        }
    }

    private buildWsTransport(rawPath: string | null, host: string | null): TransportConfig {
        const config: TransportConfig = {
            type: 'ws',
            headers: {},
        };

        let path = rawPath ?? '';

        if (path.includes('?ed=')) {
            const [pathPart, edPart] = path.split('?ed=');
            path = pathPart;
            const parsed = Number(edPart.split('/')[0]);
            if (!isNaN(parsed)) {
                config.max_early_data = parsed;
            }
            config.early_data_header_name = 'Sec-WebSocket-Protocol';
        }

        if (path) {
            config.path = path;
        }

        if (host) {
            config.headers = { Host: host };
        }

        return config;
    }

    private buildHttpUpgradeTransport(
        rawPath: string | null,
        host: string | null,
    ): TransportConfig {
        const config: TransportConfig = {
            type: 'httpupgrade',
            headers: {},
        };

        const path = rawPath ?? '';

        if (path) {
            config.path = path;
        }

        if (host) {
            config.headers = { Host: host };
        }

        return config;
    }

    private buildGrpcTransport(serviceName: string | null): TransportConfig {
        return {
            type: 'grpc',
            service_name: serviceName ?? '',
        };
    }

    private applySecurity(config: OutboundConfig, host: ResolvedProxyConfig): void {
        switch (host.security) {
            case 'tls':
                config.tls = this.buildTlsConfig(host);
                break;
            case 'reality':
                config.tls = this.buildRealityConfig(host);
                break;
            case 'none':
                break;
        }
    }

    private buildTlsConfig(host: Extract<ResolvedProxyConfig, { security: 'tls' }>): TlsConfig {
        const opts = host.securityOptions;
        const config: TlsConfig = {
            enabled: true,
        };

        if (opts.serverName) {
            config.server_name = opts.serverName;
        }

        if (opts.fingerprint) {
            config.utls = {
                enabled: true,
                fingerprint: opts.fingerprint,
            };
        }

        if (opts.allowInsecure) {
            config.insecure = true;
        }

        if (opts.alpn) {
            config.alpn = opts.alpn.split(',').map((a) => a.trim());
        }

        return config;
    }

    private buildRealityConfig(
        host: Extract<ResolvedProxyConfig, { security: 'reality' }>,
    ): TlsConfig {
        const opts = host.securityOptions;
        const config: TlsConfig = {
            enabled: true,
            reality: { enabled: true },
        };

        if (opts.serverName) {
            config.server_name = opts.serverName;
        }

        if (opts.publicKey) {
            config.reality!.public_key = opts.publicKey;
        }

        if (opts.shortId) {
            config.reality!.short_id = opts.shortId;
        }

        config.utls = {
            enabled: true,
            fingerprint: opts.fingerprint || 'chrome',
        };

        return config;
    }

    private renderConfig(config: Record<string, unknown>): string {
        const outbounds = config.outbounds as OutboundConfig[];

        const urltestTags = outbounds
            .filter((o) => PROXY_PROTOCOL_TYPES.has(o.type))
            .map((o) => o.tag);

        const selectorTags = outbounds.filter((o) => SELECTOR_TYPES.has(o.type)).map((o) => o.tag);

        for (const outbound of outbounds) {
            if (outbound.type === 'urltest') {
                outbound.outbounds = urltestTags;
            }
            if (outbound.type === 'selector') {
                outbound.outbounds = selectorTags;
            }
        }

        return JSON.stringify(config, null, 4);
    }
>>>>>>> upstream/main
}
