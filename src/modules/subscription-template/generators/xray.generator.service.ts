import { Injectable, Logger } from '@nestjs/common';

<<<<<<< HEAD
import { StreamSettingsObject } from '@common/helpers/xray-config/interfaces/transport.config';

import { IFormattedHost } from './interfaces/formatted-hosts.interface';

interface XrayShadowsocksLink {
    address: string;
    method: string;
    password: string;
    port: number;
    remark: string;
}

const NETWORK_CONFIGS: Record<
    StreamSettingsObject['network'],
    (params: IFormattedHost) => Partial<Record<string, unknown>>
> = {
    ws: (params) => ({
        path: params.path,
        host: params.host,
    }),
    tcp: (params) => ({
        path: params.path,
        host: params.host,
    }),
    raw: (params) => ({
        path: params.path,
        host: params.host,
    }),
    xhttp: (params) => ({
        path: params.path,
        host: params.host,
    }),
    httpupgrade: (params) => ({
        path: params.path,
        host: params.host,
    }),
    grpc: (params) => ({
        authority: params.host,
        serviceName: params.path,
    }),
};
=======
import { ResolvedProxyConfig } from '../resolve-proxy/interfaces';

/**
 * Generates VLESS/Trojan/Shadowsocks share links per the standard:
 * https://github.com/XTLS/Xray-core/discussions/716
 *
 * Format: protocol://$(uuid)@remote-host:remote-port?<params>#$(descriptive-text)
 */
>>>>>>> upstream/main

@Injectable()
export class XrayGeneratorService {
    private readonly logger = new Logger(XrayGeneratorService.name);

<<<<<<< HEAD
    constructor() {}

    public async generateConfig(
        hosts: IFormattedHost[],
        isBase64: boolean,
        isHapp: boolean,
        extraRawLines: string[] = [],
    ): Promise<string> {
        try {
            const links = this.generateLinks(hosts, isHapp);

            // Append external subscription lines verbatim — credentials belong to
            // the remote server and must NOT be modified
            const allLines = [...links, ...extraRawLines];

            const linksString = allLines.join('\n');
            if (isBase64) {
                return Buffer.from(linksString).toString('base64');
            } else {
                return linksString;
            }
=======
    public async generateConfig(
        hosts: ResolvedProxyConfig[],
        isBase64: boolean,
        isHapp: boolean,
    ): Promise<string> {
        try {
            const links = this.generateLinks(hosts, isHapp);
            const joined = links.join('\n');
            return isBase64 ? Buffer.from(joined).toString('base64') : joined;
>>>>>>> upstream/main
        } catch (error) {
            this.logger.error('Error generating xray config:', error);
            return '';
        }
    }

<<<<<<< HEAD
    public generateLinks(hosts: IFormattedHost[], isHapp: boolean): string[] {
        const links: string[] = [];

        for (const host of hosts) {
            if (host.serviceInfo.excludeFromSubscriptionTypes.includes('XRAY_BASE64')) continue;

            const link = this.generateLink(host);

            if (link) {
                if (isHapp && host.serverDescription) {
                    links.push(link + `?serverDescription=${host.serverDescription}`);
                } else {
                    links.push(link);
                }
=======
    public generateLinks(hosts: ResolvedProxyConfig[], isHapp: boolean): string[] {
        const links: string[] = [];

        for (const host of hosts) {
            if (host.metadata.excludeFromSubscriptionTypes.includes('XRAY_BASE64')) continue;

            const link = this.generateLink(host);
            if (!link) continue;

            if (isHapp && host.clientOverrides.serverDescription) {
                links.push(`${link}?serverDescription=${host.clientOverrides.serverDescription}`);
            } else {
                links.push(link);
>>>>>>> upstream/main
            }
        }

        return links;
    }

<<<<<<< HEAD
    private generateLink(host: IFormattedHost): string | undefined {
        switch (host.protocol) {
            case 'trojan':
                return this.trojan(host);
            case 'vless':
                return this.vless(host);
            case 'shadowsocks':
                return this.shadowsocks({
                    remark: host.remark,
                    address: host.address,
                    port: host.port,
                    method: 'chacha20-ietf-poly1305',
                    password: host.password.ssPassword,
                });
            default:
                return undefined;
        }
    }

    private trojan(params: IFormattedHost): string {
        const payload: Record<string, unknown> = {
            security: params.tls,
            type: params.network,
            headerType: params.rawSettings?.headerType || '',
        };

        const network = params.network || 'tcp';
        if (network in NETWORK_CONFIGS) {
            Object.assign(
                payload,
                NETWORK_CONFIGS[network as StreamSettingsObject['network']](params),
            );
        }

        if (params.network === 'xhttp') {
            Object.assign(payload, {
                path: params.path,
                host: params.host,
                mode: params.additionalParams?.mode || 'auto',
            });

            if (params.xHttpExtraParams !== null && params.xHttpExtraParams !== undefined) {
                Object.assign(payload, {
                    extra: JSON.stringify(params.xHttpExtraParams),
                });
            }
        }

        if (params.network === 'ws') {
            if (params.additionalParams?.heartbeatPeriod) {
                Object.assign(payload, {
                    heartbeatPeriod: params.additionalParams?.heartbeatPeriod,
                });
            }
        }

        if (params.network === 'grpc') {
            Object.assign(payload, {
                mode: params.additionalParams?.grpcMultiMode ? 'multi' : 'gun',
            });
        }

        const tlsParams: Record<string, unknown> = {};

        if (params.tls === 'tls') {
            Object.assign(tlsParams, {
                sni: params.sni,
                fp: params.fingerprint,
                ...(params.alpn && { alpn: params.alpn }),
            });
            if (params.allowInsecure) {
                tlsParams.allowInsecure = 1;
            }
        } else if (params.tls === 'reality') {
            Object.assign(tlsParams, {
                sni: params.sni,
                fp: params.fingerprint,
                pbk: params.publicKey,
                sid: params.shortId,
                pqv: params.mldsa65Verify,
                ...(params.spiderX && { spx: params.spiderX }),
            });
        }

        Object.assign(payload, tlsParams);

        const stringPayload = this.convertPayloadToString(payload);
        return `trojan://${encodeURIComponent(params.password.trojanPassword)}@${params.address}:${params.port}?${new URLSearchParams(stringPayload).toString()}#${encodeURIComponent(params.remark)}`;
    }

    private vless(params: IFormattedHost): string {
        const payload: Record<string, unknown> = {
            security: params.tls,
            type: params.network,
            headerType: params.rawSettings?.headerType || '',
        };

        const network = params.network;
        if (network in NETWORK_CONFIGS) {
            Object.assign(
                payload,
                NETWORK_CONFIGS[network as StreamSettingsObject['network']](params),
            );
        }

        if (params.flow !== undefined) {
            Object.assign(payload, {
                flow: params.flow,
            });
        }

        if (params.network === 'xhttp') {
            Object.assign(payload, {
                path: params.path,
                host: params.host,
                mode: params.additionalParams?.mode || 'auto',
            });

            if (params.xHttpExtraParams !== null && params.xHttpExtraParams !== undefined) {
                Object.assign(payload, {
                    extra: JSON.stringify(params.xHttpExtraParams),
                });
            }
        }

        if (params.network === 'ws') {
            if (params.additionalParams?.heartbeatPeriod) {
                Object.assign(payload, {
                    heartbeatPeriod: params.additionalParams?.heartbeatPeriod,
                });
            }
        }

        if (params.network === 'grpc') {
            Object.assign(payload, {
                mode: params.additionalParams?.grpcMultiMode ? 'multi' : 'gun',
            });
        }

        const tlsParams: Record<string, unknown> = {};

        if (params.tls === 'tls') {
            Object.assign(tlsParams, {
                sni: params.sni,
                fp: params.fingerprint,
                ...(params.alpn && { alpn: params.alpn }),
            });
            if (params.allowInsecure) {
                tlsParams.allowInsecure = 1;
            }
        } else if (params.tls === 'reality') {
            Object.assign(tlsParams, {
                sni: params.sni,
                fp: params.fingerprint,
                pbk: params.publicKey,
                sid: params.shortId,
                pqv: params.mldsa65Verify,
                ...(params.spiderX && { spx: params.spiderX }),
            });
        }

        Object.assign(payload, tlsParams);

        if (params.encryption) {
            Object.assign(payload, {
                encryption: params.encryption,
            });
        }

        const stringPayload = this.convertPayloadToString(payload);
        return `vless://${params.password.vlessPassword}@${params.address}:${params.port}?${new URLSearchParams(stringPayload).toString()}#${encodeURIComponent(params.remark)}`;
    }

    private shadowsocks(params: XrayShadowsocksLink): string {
        const base64Credentials = Buffer.from(`${params.method}:${params.password}`).toString(
            'base64',
        );

        const encodedRemark = encodeURIComponent(params.remark);

        return `ss://${base64Credentials}@${params.address}:${params.port}#${encodedRemark}`;
    }

    private convertPayloadToString(payload: Record<string, unknown>): Record<string, string> {
        return Object.fromEntries(
            Object.entries(payload)
                /* eslint-disable @typescript-eslint/no-unused-vars */
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, String(v)]),
        );
=======
    private generateLink(host: ResolvedProxyConfig): string | null {
        switch (host.protocol) {
            case 'vless':
                return this.buildVlessLink(host);
            case 'trojan':
                return this.buildTrojanLink(host);
            case 'shadowsocks':
                return this.buildShadowsocksLink(host);
            default:
                return null;
        }
    }

    // ── VLESS ────────────────────────────────────────
    // vless://$(uuid)@host:port?params#remark

    private buildVlessLink(host: Extract<ResolvedProxyConfig, { protocol: 'vless' }>): string {
        const params: Record<string, unknown> = {};

        // Protocol fields (4.2)
        if (host.protocolOptions.encryption) {
            params.encryption = host.protocolOptions.encryption;
        }
        if (host.protocolOptions.flow) {
            params.flow = host.protocolOptions.flow;
        }

        // Transport (4.2.1 + 4.3)
        this.applyTransportParams(params, host);

        // Security (4.3.1 + 4.4)
        this.applySecurityParams(params, host);

        // Remnawave: finalmask for kcp
        if (host.streamOverrides.finalMask) {
            params.fm = JSON.stringify(host.streamOverrides.finalMask);
        }

        const query = this.buildQueryString(params);
        const remark = encodeURIComponent(host.finalRemark);

        return `vless://${host.protocolOptions.id}@${host.address}:${host.port}?${query}#${remark}`;
    }

    // ── Trojan ───────────────────────────────────────
    // trojan://$(password)@host:port?params#remark

    private buildTrojanLink(host: Extract<ResolvedProxyConfig, { protocol: 'trojan' }>): string {
        const params: Record<string, unknown> = {};

        // Transport (4.2.1 + 4.3)
        this.applyTransportParams(params, host);

        // Security (4.3.1 + 4.4)
        this.applySecurityParams(params, host);

        const query = this.buildQueryString(params);
        const remark = encodeURIComponent(host.finalRemark);
        const password = encodeURIComponent(host.protocolOptions.password);

        return `trojan://${password}@${host.address}:${host.port}?${query}#${remark}`;
    }

    // ── Shadowsocks ──────────────────────────────────
    // ss://base64(method:password)@host:port#remark

    private buildShadowsocksLink(
        host: Extract<ResolvedProxyConfig, { protocol: 'shadowsocks' }>,
    ): string {
        const credentials = Buffer.from(
            `${host.protocolOptions.method}:${host.protocolOptions.password}`,
        ).toString('base64');

        const remark = encodeURIComponent(host.finalRemark);

        return `ss://${credentials}@${host.address}:${host.port}#${remark}`;
    }

    // ── Transport Params ─────────────────────────────

    private applyTransportParams(params: Record<string, unknown>, host: ResolvedProxyConfig): void {
        // 4.2.1: type (transport)
        params.type = host.transport;

        switch (host.transport) {
            case 'tcp':
                this.applyTcpParams(params, host);
                break;
            case 'ws':
                this.applyWsParams(params, host);
                break;
            case 'httpupgrade':
                this.applyHttpUpgradeParams(params, host);
                break;
            case 'grpc':
                this.applyGrpcParams(params, host);
                break;
            case 'xhttp':
                this.applyXhttpParams(params, host);
                break;
            case 'kcp':
                // 4.3.6: headerType — not available in current interface
                break;
        }
    }

    // 4.3 TCP: headerType
    private applyTcpParams(
        params: Record<string, unknown>,
        host: Extract<ResolvedProxyConfig, { transport: 'tcp' }>,
    ): void {
        const header = host.transportOptions.header;
        if (header) {
            params.headerType = header.type;
        }
    }

    // 4.3.4-5 WebSocket: path, host
    private applyWsParams(
        params: Record<string, unknown>,
        host: Extract<ResolvedProxyConfig, { transport: 'ws' }>,
    ): void {
        if (host.transportOptions.path) {
            params.path = host.transportOptions.path;
        }
        if (host.transportOptions.host) {
            params.host = host.transportOptions.host;
        }
        // Remnawave extension: heartbeatPeriod
        if (host.transportOptions.heartbeatPeriod) {
            params.heartbeatPeriod = host.transportOptions.heartbeatPeriod;
        }
    }

    // 4.3.14-15 HTTPUpgrade: path, host
    private applyHttpUpgradeParams(
        params: Record<string, unknown>,
        host: Extract<ResolvedProxyConfig, { transport: 'httpupgrade' }>,
    ): void {
        if (host.transportOptions.path) {
            params.path = host.transportOptions.path;
        }
        if (host.transportOptions.host) {
            params.host = host.transportOptions.host;
        }
    }

    // 4.3.11-13 gRPC: serviceName, mode, authority
    private applyGrpcParams(
        params: Record<string, unknown>,
        host: Extract<ResolvedProxyConfig, { transport: 'grpc' }>,
    ): void {
        if (host.transportOptions.serviceName) {
            params.serviceName = host.transportOptions.serviceName;
        }
        // 4.3.12: mode — gun (default) or multi
        params.mode = host.transportOptions.multiMode ? 'multi' : 'gun';

        if (host.transportOptions.authority) {
            params.authority = host.transportOptions.authority;
        }
    }

    // 4.3.16-19 XHTTP: path, host, mode, extra
    private applyXhttpParams(
        params: Record<string, unknown>,
        host: Extract<ResolvedProxyConfig, { transport: 'xhttp' }>,
    ): void {
        if (host.transportOptions.path) {
            params.path = host.transportOptions.path;
        }
        if (host.transportOptions.host) {
            params.host = host.transportOptions.host;
        }
        if (host.transportOptions.mode) {
            params.mode = host.transportOptions.mode;
        }
        // 4.3.19: extra — JSON
        if (host.transportOptions.extra) {
            params.extra = JSON.stringify(host.transportOptions.extra);
        }
    }

    // ── Security Params ──────────────────────────────

    private applySecurityParams(params: Record<string, unknown>, host: ResolvedProxyConfig): void {
        // 4.3.1: security
        params.security = host.security;

        switch (host.security) {
            case 'tls':
                this.applyTlsParams(params, host);
                break;
            case 'reality':
                this.applyRealityParams(params, host);
                break;
            case 'none':
                break;
        }
    }

    // 4.4 TLS: sni, fp, alpn, allowInsecure
    private applyTlsParams(
        params: Record<string, unknown>,
        host: Extract<ResolvedProxyConfig, { security: 'tls' }>,
    ): void {
        const opts = host.securityOptions;

        // 4.4.1: sni
        if (opts.serverName !== null) {
            params.sni = opts.serverName;
        }

        // 4.4.0: fp (default chrome per spec)
        if (opts.fingerprint) {
            params.fp = opts.fingerprint;
        }

        // 4.4.2: alpn
        if (opts.alpn) {
            params.alpn = opts.alpn;
        }

        if (opts.allowInsecure) {
            params.allowInsecure = 1;
        }
    }

    // 4.4 REALITY: sni, fp, pbk, sid, pqv, spx
    private applyRealityParams(
        params: Record<string, unknown>,
        host: Extract<ResolvedProxyConfig, { security: 'reality' }>,
    ): void {
        const opts = host.securityOptions;

        // 4.4.1: sni
        if (opts.serverName !== null) {
            params.sni = opts.serverName;
        }

        // 4.4.0: fp
        params.fp = opts.fingerprint || 'chrome';

        // 4.4.5: pbk (required for REALITY)
        if (opts.publicKey) {
            params.pbk = opts.publicKey;
        }

        // 4.4.6: sid
        if (opts.shortId) {
            params.sid = opts.shortId;
        }

        // 4.4.7: pqv (mldsa65Verify)
        if (opts.mldsa65Verify) {
            params.pqv = opts.mldsa65Verify;
        }

        // 4.4.8: spx (spiderX)
        if (opts.spiderX) {
            params.spx = opts.spiderX;
        }
    }

    // ── Query String Builder ─────────────────────────

    private buildQueryString(params: Record<string, unknown>): string {
        const stringParams: Record<string, string> = {};

        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null) continue;
            stringParams[key] = String(value);
        }

        return new URLSearchParams(stringParams).toString();
>>>>>>> upstream/main
    }
}
