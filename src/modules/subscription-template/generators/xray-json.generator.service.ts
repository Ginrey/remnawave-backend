import type {
    TRemnawaveInjectorSelectFrom,
    TRemnawaveInjectorSelector,
} from '@libs/contracts/models';

import { Injectable, Logger } from '@nestjs/common';

<<<<<<< HEAD
import {
    IGenerateConfigParams,
    Outbound,
    OutboundSettings,
=======
import { isNonEmptyObject } from '@common/utils';

import {
    IGenerateConfigParams,
    Outbound,
>>>>>>> upstream/main
    StreamSettings,
    XrayJsonConfig,
} from './interfaces/xray-json-config.interface';
import { SubscriptionTemplateService } from '../subscription-template.service';
<<<<<<< HEAD
import { IFormattedHost } from './interfaces/formatted-hosts.interface';

type ProtocolBuilder = (host: IFormattedHost) => OutboundSettings;
type TransportBuilder = (host: IFormattedHost) => Record<string, unknown>;

const PROTOCOL_BUILDERS: Record<string, ProtocolBuilder> = {
=======
import { ResolvedProxyConfig } from '../resolve-proxy/interfaces';

type VlessConfig = Extract<ResolvedProxyConfig, { protocol: 'vless' }>;
type TrojanConfig = Extract<ResolvedProxyConfig, { protocol: 'trojan' }>;
type ShadowsocksConfig = Extract<ResolvedProxyConfig, { protocol: 'shadowsocks' }>;
type HysteriaConfig = Extract<ResolvedProxyConfig, { protocol: 'hysteria' }>;

type ProtocolBuilderMap = {
    vless: (host: VlessConfig) => object;
    trojan: (host: TrojanConfig) => object;
    shadowsocks: (host: ShadowsocksConfig) => object;
    hysteria: (host: HysteriaConfig) => object;
};

type WsConfig = Extract<ResolvedProxyConfig, { transport: 'ws' }>;
type HttpUpgradeConfig = Extract<ResolvedProxyConfig, { transport: 'httpupgrade' }>;
type TcpConfig = Extract<ResolvedProxyConfig, { transport: 'tcp' }>;
type XHttpConfig = Extract<ResolvedProxyConfig, { transport: 'xhttp' }>;
type GrpcConfig = Extract<ResolvedProxyConfig, { transport: 'grpc' }>;
type KcpConfig = Extract<ResolvedProxyConfig, { transport: 'kcp' }>;
type HysteriaTransportConfig = Extract<ResolvedProxyConfig, { transport: 'hysteria' }>;

type TransportBuilderMap = {
    hysteria: (host: HysteriaTransportConfig) => Record<string, unknown>;
    ws: (host: WsConfig) => Record<string, unknown>;
    httpupgrade: (host: HttpUpgradeConfig) => Record<string, unknown>;
    tcp: (host: TcpConfig) => Record<string, unknown>;
    xhttp: (host: XHttpConfig) => Record<string, unknown>;
    grpc: (host: GrpcConfig) => Record<string, unknown>;
    kcp: (host: KcpConfig) => Record<string, unknown>;
};
const PROTOCOL_BUILDERS: ProtocolBuilderMap = {
>>>>>>> upstream/main
    vless: (host) => ({
        vnext: [
            {
                address: host.address,
                port: host.port,
                users: [
                    {
<<<<<<< HEAD
                        id: host.password.vlessPassword,
                        encryption: host.encryption || 'none',
                        flow: host.flow,
=======
                        id: host.protocolOptions.id,
                        encryption: host.protocolOptions.encryption || 'none',
                        flow: host.protocolOptions.flow,
>>>>>>> upstream/main
                    },
                ],
            },
        ],
    }),

    trojan: (host) => ({
        servers: [
            {
                address: host.address,
                port: host.port,
<<<<<<< HEAD
                password: host.password.trojanPassword,
            },
        ],
    }),
=======
                password: host.protocolOptions.password,
            },
        ],
    }),
    hysteria: (host) => ({
        address: host.address,
        port: host.port,
        version: 2,
    }),
>>>>>>> upstream/main

    shadowsocks: (host) => ({
        servers: [
            {
                address: host.address,
                port: host.port,
<<<<<<< HEAD
                password: host.password.ssPassword,
                method: 'chacha20-ietf-poly1305',
                uot: false,
                ivCheck: false,
=======
                password: host.protocolOptions.password,
                method: host.protocolOptions.method,
                uot: host.protocolOptions.uot,
                UoTVersion: host.protocolOptions.uotVersion,
>>>>>>> upstream/main
            },
        ],
    }),
};

<<<<<<< HEAD
const TRANSPORT_KEY_MAP: Record<string, keyof StreamSettings> = {
    ws: 'wsSettings',
    httpupgrade: 'httpupgradeSettings',
    tcp: 'tcpSettings',
    raw: 'tcpSettings',
    xhttp: 'xhttpSettings',
    grpc: 'grpcSettings',
};

const TRANSPORT_BUILDERS: Record<string, TransportBuilder> = {
    ws: (host) => ({
        path: host.path,
        headers: { Host: host.host },
        ...(host.additionalParams?.heartbeatPeriod != null && {
            heartbeatPeriod: host.additionalParams.heartbeatPeriod,
        }),
    }),

    httpupgrade: (host) => ({
        path: host.path,
        host: host.host,
    }),

    tcp: buildTcpSettings,
    raw: buildTcpSettings,

    xhttp: (host) => {
        const settings: Record<string, unknown> = {
            mode: host.additionalParams?.mode || 'auto',
            host: host.host,
        };

        if (host.path !== '') {
            settings.path = host.path;
        }

        if (isNonEmptyObject(host.xHttpExtraParams)) {
            settings.extra = host.xHttpExtraParams;
        }

        return settings;
    },

    grpc: (host) => ({
        serviceName: host.path,
        authority: host.host,
        mode: !!host.additionalParams?.grpcMultiMode,
    }),
};

function buildTcpSettings(host: IFormattedHost): Record<string, unknown> {
    if (host.rawSettings?.headerType !== 'http') {
        return {};
    }

    const baseRequest = host.rawSettings.request
        ? (structuredClone(host.rawSettings.request) as Record<string, any>)
        : {
              version: '1.1',
              method: 'GET',
              headers: {
                  'Accept-Encoding': ['gzip', 'deflate'],
                  Connection: ['keep-alive'],
                  Pragma: 'no-cache',
              },
          };

    if (host.path) {
        baseRequest.path = [host.path];
    }

    baseRequest.headers = baseRequest.headers || {};
    baseRequest.headers.Host = [host.host];

    return {
        header: {
            type: 'http',
            request: baseRequest,
        },
    };
}

function isNonEmptyObject(value: unknown): value is Record<string, unknown> {
    return value != null && typeof value === 'object' && Object.keys(value).length > 0;
}

function buildTlsSettings(host: IFormattedHost): Record<string, unknown> {
    const settings: Record<string, unknown> = {
        serverName: host.sni || '',
        allowInsecure: host.allowInsecure || false,
        show: false,
    };

    if (host.fingerprint !== '') {
        settings.fingerprint = host.fingerprint;
    }

    if (host.alpn) {
        settings.alpn = host.alpn.split(',');
=======
const TRANSPORT_BUILDERS: TransportBuilderMap = {
    ws: (host) => ({
        path: host.transportOptions.path,
        headers: { Host: host.transportOptions.host, ...host.transportOptions.headers },
        ...(host.transportOptions.heartbeatPeriod != null && {
            heartbeatPeriod: host.transportOptions.heartbeatPeriod,
        }),
    }),
    httpupgrade: (host) => ({
        path: host.transportOptions.path,
        host: host.transportOptions.host,
        headers: { Host: host.transportOptions.host, ...host.transportOptions.headers },
    }),
    tcp: buildTcpSettings,
    xhttp: (host) => ({
        mode: host.transportOptions.mode,
        host: host.transportOptions.host,
        ...(host.transportOptions.path && { path: host.transportOptions.path }),
        ...(host.transportOptions.extra && { extra: host.transportOptions.extra }),
    }),
    grpc: (host) => ({
        serviceName: host.transportOptions.serviceName,
        authority: host.transportOptions.authority,
        mode: !!host.transportOptions.multiMode,
    }),
    kcp: (host) => ({
        mtu: host.transportOptions.clientMtu,
        tti: host.transportOptions.tti,
        congestion: host.transportOptions.congestion,
    }),
    hysteria: (host) => ({
        version: 2,
        auth: host.transportOptions.auth,
    }),
};

function buildTcpSettings(host: ResolvedProxyConfig): Record<string, unknown> {
    if (host.transport !== 'tcp' || !host.transportOptions.header) return {};

    return {
        header: host.transportOptions.header,
    };
}

function buildTlsSettings(host: ResolvedProxyConfig): Record<string, unknown> {
    if (host.security !== 'tls') return {};
    const settings: Record<string, unknown> = {
        serverName: host.securityOptions.serverName || '',
    };

    if (host.securityOptions.fingerprint !== '') {
        settings.fingerprint = host.securityOptions.fingerprint;
    }

    if (host.securityOptions.alpn) {
        settings.alpn = host.securityOptions.alpn.split(',');
    }

    if (host.securityOptions.allowInsecure) {
        settings.allowInsecure = true;
>>>>>>> upstream/main
    }

    return settings;
}

<<<<<<< HEAD
function buildRealitySettings(host: IFormattedHost): Record<string, unknown> {
    const settings: Record<string, unknown> = {
        serverName: host.sni,
        show: false,
    };

    if (host.publicKey) settings.publicKey = host.publicKey;
    if (host.mldsa65Verify) settings.mldsa65Verify = host.mldsa65Verify;
    if (host.shortId) settings.shortId = host.shortId;
    if (host.spiderX) settings.spiderX = host.spiderX;
    if (host.fingerprint !== '') settings.fingerprint = host.fingerprint;
=======
function buildRealitySettings(host: ResolvedProxyConfig): Record<string, unknown> {
    if (host.security !== 'reality') return {};
    const settings: Record<string, unknown> = {
        serverName: host.securityOptions.serverName,
    };

    if (host.securityOptions.publicKey) settings.publicKey = host.securityOptions.publicKey;
    if (host.securityOptions.mldsa65Verify)
        settings.mldsa65Verify = host.securityOptions.mldsa65Verify;
    if (host.securityOptions.shortId) settings.shortId = host.securityOptions.shortId;
    if (host.securityOptions.spiderX) settings.spiderX = host.securityOptions.spiderX;
    if (host.securityOptions.fingerprint !== '')
        settings.fingerprint = host.securityOptions.fingerprint;
>>>>>>> upstream/main

    return settings;
}

@Injectable()
export class XrayJsonGeneratorService {
    private readonly logger = new Logger(XrayJsonGeneratorService.name);

    constructor(private readonly subscriptionTemplateService: SubscriptionTemplateService) {}

    public async generateConfig(params: IGenerateConfigParams): Promise<string> {
<<<<<<< HEAD
        const { hosts, isHapp, overrideTemplateName, ignoreHostXrayJsonTemplate = false } = params;
=======
        const {
            hosts,
            isExtendedClient,
            overrideTemplateName,
            ignoreHostXrayJsonTemplate = false,
        } = params;
>>>>>>> upstream/main

        try {
            const templateContent = (await this.subscriptionTemplateService.getCachedTemplateByType(
                'XRAY_JSON',
                overrideTemplateName,
            )) as unknown as XrayJsonConfig;

            const configs: XrayJsonConfig[] = [];

            for (const host of hosts) {
<<<<<<< HEAD
                if (host.serviceInfo.isHidden) continue;
                if (host.serviceInfo.excludeFromSubscriptionTypes.includes('XRAY_JSON')) continue;

                const baseTemplate = ignoreHostXrayJsonTemplate
                    ? templateContent
                    : ((host.xrayJsonTemplate as XrayJsonConfig) ?? templateContent);

                if (baseTemplate.remnawave) {
                    const injected = this.applyRemnawaveInjector(baseTemplate, host, hosts, isHapp);
=======
                if (host.metadata.isHidden) continue;
                if (host.metadata.excludeFromSubscriptionTypes.includes('XRAY_JSON')) continue;

                const baseTemplate = ignoreHostXrayJsonTemplate
                    ? templateContent
                    : ((host.clientOverrides.xrayJsonTemplate as XrayJsonConfig) ??
                      templateContent);

                if (baseTemplate.remnawave) {
                    const injected = this.applyRemnawaveInjector(
                        baseTemplate,
                        host,
                        hosts,
                        isExtendedClient,
                    );
>>>>>>> upstream/main
                    if (injected) configs.push(injected);
                    continue;
                }

<<<<<<< HEAD
                const outboundConfig = this.buildOutboundConfig(host, isHapp);
=======
                const outboundConfig = this.buildOutboundConfig(host, isExtendedClient);
>>>>>>> upstream/main
                if (!outboundConfig) continue;

                configs.push({
                    ...baseTemplate,
                    outbounds: [...outboundConfig.outbounds, ...baseTemplate.outbounds],
                    remarks: outboundConfig.remarks,
                    meta: outboundConfig.meta,
                });
            }

            return JSON.stringify(configs, null, 0);
        } catch (error) {
            this.logger.error(`Error generating xray-json config: ${error}`);
            return '';
        }
    }

    private buildOutboundConfig(
<<<<<<< HEAD
        host: IFormattedHost,
        isHapp: boolean,
=======
        host: ResolvedProxyConfig,
        isExtendedClient: boolean,
>>>>>>> upstream/main
        tag = 'proxy',
    ): XrayJsonConfig | null {
        try {
            const outbound = this.buildOutbound(host, tag);

            const config: XrayJsonConfig = {
<<<<<<< HEAD
                remarks: host.remark,
                outbounds: [outbound],
            };

            if (isHapp && host.serverDescription) {
                config.meta = {
                    serverDescription: Buffer.from(host.serverDescription, 'base64').toString(),
=======
                remarks: host.finalRemark,
                outbounds: [outbound],
            };

            if (isExtendedClient && host.clientOverrides.serverDescription) {
                config.meta = {
                    serverDescription: Buffer.from(
                        host.clientOverrides.serverDescription,
                        'base64',
                    ).toString(),
>>>>>>> upstream/main
                };
            }

            return config;
        } catch (error) {
            this.logger.error(`Error creating config for host: ${error}`);
            return null;
        }
    }

<<<<<<< HEAD
    private buildOutbound(host: IFormattedHost, tag: string): Outbound {
        const protocolBuilder = PROTOCOL_BUILDERS[host.protocol];

        const outbound: Outbound = {
            tag,
            protocol: host.protocol,
            settings: protocolBuilder(host) ?? { vnext: [] },
            streamSettings: this.buildStreamSettings(host),
        };

        if (isNonEmptyObject(host.muxParams)) {
            outbound.mux = host.muxParams;
=======
    private buildOutbound(host: ResolvedProxyConfig, tag: string): Outbound {
        const outbound: Outbound = {
            tag,
            protocol: host.protocol,
            settings: this.buildProtocolSettings(host),
            streamSettings: this.buildStreamSettings(host),
        };

        if (isNonEmptyObject(host.mux)) {
            outbound.mux = host.mux;
>>>>>>> upstream/main
        }

        return outbound;
    }

<<<<<<< HEAD
    private buildStreamSettings(host: IFormattedHost): StreamSettings {
        const network = host.network || 'tcp';
        const transportKey = TRANSPORT_KEY_MAP[network];

        const streamSettings: StreamSettings = {
            network,
            ...(network in TRANSPORT_BUILDERS && transportKey
                ? { [transportKey]: TRANSPORT_BUILDERS[network](host) }
                : {}),
        };

        if (host.tls === 'tls') {
            streamSettings.security = 'tls';
            streamSettings.tlsSettings = buildTlsSettings(host);
        } else if (host.tls === 'reality') {
            streamSettings.security = 'reality';
            streamSettings.realitySettings = buildRealitySettings(host);
        }

        if (isNonEmptyObject(host.sockoptParams)) {
            streamSettings.sockopt = host.sockoptParams;
        }

        return streamSettings;
    }

    private buildTaggedOutbounds(
        hosts: IFormattedHost[],
=======
    private buildTransportEntry(host: ResolvedProxyConfig): object {
        switch (host.transport) {
            case 'ws':
                return { wsSettings: TRANSPORT_BUILDERS.ws(host) };
            case 'httpupgrade':
                return { httpupgradeSettings: TRANSPORT_BUILDERS.httpupgrade(host) };
            case 'tcp':
                return { tcpSettings: TRANSPORT_BUILDERS.tcp(host) };
            case 'xhttp':
                return { xhttpSettings: TRANSPORT_BUILDERS.xhttp(host) };
            case 'grpc':
                return { grpcSettings: TRANSPORT_BUILDERS.grpc(host) };
            case 'kcp':
                return { kcpSettings: TRANSPORT_BUILDERS.kcp(host) };
            case 'hysteria':
                return { hysteriaSettings: TRANSPORT_BUILDERS.hysteria(host) };
        }
    }

    private buildProtocolSettings(host: ResolvedProxyConfig): object {
        switch (host.protocol) {
            case 'vless':
                return PROTOCOL_BUILDERS.vless(host);
            case 'trojan':
                return PROTOCOL_BUILDERS.trojan(host);
            case 'shadowsocks':
                return PROTOCOL_BUILDERS.shadowsocks(host);
            case 'hysteria':
                return PROTOCOL_BUILDERS.hysteria(host);
        }
    }

    private buildSecurityEntry(host: ResolvedProxyConfig): object {
        switch (host.security) {
            case 'tls':
                return {
                    security: 'tls',
                    tlsSettings: buildTlsSettings(host),
                };
            case 'reality':
                return {
                    security: 'reality',
                    realitySettings: buildRealitySettings(host),
                };
            case 'none':
                return { security: 'none' };
            default:
                return {};
        }
    }

    private buildStreamSettings(host: ResolvedProxyConfig): StreamSettings {
        return {
            network: host.transport,
            ...this.buildTransportEntry(host),
            ...this.buildSecurityEntry(host),
            ...(host.streamOverrides.sockopt && { sockopt: host.streamOverrides.sockopt }),
            ...(host.streamOverrides.finalMask && { finalmask: host.streamOverrides.finalMask }),
        };
    }

    private buildTaggedOutbounds(
        hosts: ResolvedProxyConfig[],
>>>>>>> upstream/main
        {
            tagPrefix,
            useHostRemarkAsTag,
            useHostTagAsTag,
        }: { tagPrefix?: string; useHostRemarkAsTag?: boolean; useHostTagAsTag?: boolean },
    ): Outbound[] {
        if (useHostRemarkAsTag) {
<<<<<<< HEAD
            return hosts.map((h) => this.buildOutbound(h, h.remark));
        }

        if (useHostTagAsTag) {
            return hosts.map((h) => this.buildOutbound(h, h.serviceInfo.tag || h.remark));
=======
            return hosts.map((h) => this.buildOutbound(h, h.finalRemark));
        }

        if (useHostTagAsTag) {
            return hosts.map((h) => this.buildOutbound(h, h.metadata.tag || h.finalRemark));
>>>>>>> upstream/main
        }

        const proxyTag = tagPrefix ?? 'proxy';
        return hosts.map((h, i) =>
            this.buildOutbound(h, i === 0 ? proxyTag : `${proxyTag}-${i + 1}`),
        );
    }

    private parseRegex(pattern: string): RegExp | null {
        try {
            return new RegExp(pattern);
        } catch {
            this.logger.error(`Invalid regex pattern for injectHosts entry: ${pattern}`);
            return null;
        }
    }

    private resolveHosts(
        selector: TRemnawaveInjectorSelector,
        selectFrom: TRemnawaveInjectorSelectFrom,
<<<<<<< HEAD
        host: IFormattedHost,
        allHosts: IFormattedHost[],
    ): IFormattedHost[] {
        const source = selectFrom ?? 'HIDDEN';
        let candidates: IFormattedHost[] = [];
=======
        host: ResolvedProxyConfig,
        allHosts: ResolvedProxyConfig[],
    ): ResolvedProxyConfig[] {
        const source = selectFrom ?? 'HIDDEN';
        let candidates: ResolvedProxyConfig[] = [];
>>>>>>> upstream/main
        switch (source) {
            case 'ALL':
                candidates = allHosts;
                break;
            case 'HIDDEN':
<<<<<<< HEAD
                candidates = allHosts.filter((h) => h.serviceInfo.isHidden);
                break;
            case 'NOT_HIDDEN':
                candidates = allHosts.filter((h) => !h.serviceInfo.isHidden);
=======
                candidates = allHosts.filter((h) => h.metadata.isHidden);
                break;
            case 'NOT_HIDDEN':
                candidates = allHosts.filter((h) => !h.metadata.isHidden);
>>>>>>> upstream/main
                break;
        }

        switch (selector.type) {
            case 'uuids':
                return selector.values
<<<<<<< HEAD
                    .map((uuid) => candidates.find((h) => h.serviceInfo.uuid === uuid))
                    .filter(Boolean) as IFormattedHost[];
=======
                    .map((uuid) => candidates.find((h) => h.metadata.uuid === uuid))
                    .filter(Boolean) as ResolvedProxyConfig[];
>>>>>>> upstream/main

            case 'remarkRegex': {
                const regex = this.parseRegex(selector.pattern);
                if (!regex) return [];
<<<<<<< HEAD
                return candidates.filter((h) => regex.test(h.remark));
=======
                return candidates.filter((h) => regex.test(h.finalRemark));
>>>>>>> upstream/main
            }

            case 'sameTagAsRecipient':
                return candidates.filter(
                    (h) =>
<<<<<<< HEAD
                        h.serviceInfo.tag &&
                        host.serviceInfo.tag &&
                        h.serviceInfo.tag === host.serviceInfo.tag,
=======
                        h.metadata.tag && host.metadata.tag && h.metadata.tag === host.metadata.tag,
>>>>>>> upstream/main
                );

            case 'tagRegex': {
                const regex = this.parseRegex(selector.pattern);
                if (!regex) return [];
<<<<<<< HEAD
                return candidates.filter((h) => h.serviceInfo.tag && regex.test(h.serviceInfo.tag));
=======
                return candidates.filter((h) => h.metadata.tag && regex.test(h.metadata.tag));
>>>>>>> upstream/main
            }
        }
    }

    private applyRemnawaveInjector(
        baseTemplate: XrayJsonConfig,
<<<<<<< HEAD
        host: IFormattedHost,
        allHosts: IFormattedHost[],
        isHapp: boolean,
=======
        host: ResolvedProxyConfig,
        allHosts: ResolvedProxyConfig[],
        isExtendedClient: boolean,
>>>>>>> upstream/main
    ): XrayJsonConfig | null {
        const { remnawave: injector, ...template } = baseTemplate;
        if (!injector) return null;
        if (!injector.injectHosts && !injector.addVirtualHostAsOutbound) return null;

        const injectedOutbounds = [
            ...(injector.addVirtualHostAsOutbound ? [this.buildOutbound(host, 'proxy')] : []),
            ...(injector.injectHosts ?? []).flatMap((entry) => {
                return this.buildTaggedOutbounds(
                    this.resolveHosts(entry.selector, entry.selectFrom, host, allHosts),
                    {
                        tagPrefix: entry.tagPrefix,
                        useHostRemarkAsTag: entry.useHostRemarkAsTag,
                        useHostTagAsTag: entry.useHostTagAsTag,
                    },
                );
            }),
        ];

        const config: XrayJsonConfig = {
            ...template,
            outbounds: [...injectedOutbounds, ...template.outbounds],
<<<<<<< HEAD
            remarks: host.remark,
        };

        if (isHapp && host.serverDescription) {
            config.meta = {
                serverDescription: Buffer.from(host.serverDescription, 'base64').toString(),
=======
            remarks: host.finalRemark,
        };

        if (isExtendedClient && host.clientOverrides.serverDescription) {
            config.meta = {
                serverDescription: Buffer.from(
                    host.clientOverrides.serverDescription,
                    'base64',
                ).toString(),
>>>>>>> upstream/main
            };
        }

        return config;
    }
}
