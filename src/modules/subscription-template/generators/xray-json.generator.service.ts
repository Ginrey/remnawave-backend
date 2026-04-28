import type {
    TRemnawaveInjectorSelectFrom,
    TRemnawaveInjectorSelector,
} from '@libs/contracts/models';

import { Injectable, Logger } from '@nestjs/common';

import { isNonEmptyObject } from '@common/utils';
import { ISubscriptionImportSourceGroup } from '@modules/subscription-import-sources/interfaces/import-source-group.interface';

import {
    IGenerateConfigParams,
    Outbound,
    StreamSettings,
    XrayJsonConfig,
} from './interfaces/xray-json-config.interface';
import { SubscriptionTemplateService } from '../subscription-template.service';
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

type ImportedOutboundConfig = {
    outbound: Outbound;
    remarks: string;
};

type ImportSourceGroupConfigs = {
    autoConfig: XrayJsonConfig | null;
    autoImportedConfigs: ImportedOutboundConfig[];
    groupName: string;
    manualConfigs: XrayJsonConfig[];
    sourceNames: string[];
};

const RUSSIAN_IMPORT_SOURCE_REMARK_PATTERN = /(?:🇷🇺|росси[яи])/iu;
const DEFAULT_IMPORT_SOURCE_AUTO_PROBE_INTERVAL = '5m';
const DEFAULT_IMPORT_SOURCE_AUTO_MAX_RTT = '5s';

function isRussianImportSourceConfig(config: ImportedOutboundConfig): boolean {
    return RUSSIAN_IMPORT_SOURCE_REMARK_PATTERN.test(config.remarks);
}

function buildImportSourcesDescription(sourceNames: string[]): string {
    return `Import sources: ${Array.from(new Set(sourceNames)).join(', ')}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;
}

function getBalancerStrategySettings(
    balancer: Record<string, unknown> | undefined,
): Record<string, unknown> {
    const strategy = asRecord(balancer?.strategy);
    const settings = asRecord(strategy?.settings);

    return settings ?? {};
}

const PROTOCOL_BUILDERS: ProtocolBuilderMap = {
    vless: (host) => ({
        vnext: [
            {
                address: host.address,
                port: host.port,
                users: [
                    {
                        id: host.protocolOptions.id,
                        encryption: host.protocolOptions.encryption || 'none',
                        flow: host.protocolOptions.flow,
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
                password: host.protocolOptions.password,
            },
        ],
    }),
    hysteria: (host) => ({
        address: host.address,
        port: host.port,
        version: 2,
    }),

    shadowsocks: (host) => ({
        servers: [
            {
                address: host.address,
                port: host.port,
                password: host.protocolOptions.password,
                method: host.protocolOptions.method,
                uot: host.protocolOptions.uot,
                UoTVersion: host.protocolOptions.uotVersion,
            },
        ],
    }),
};

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
    }

    return settings;
}

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

    return settings;
}

function safeDecodeUriComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function decodeBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const remainder = normalized.length % 4;
    const padded =
        remainder === 0 ? normalized : normalized.padEnd(normalized.length + (4 - remainder), '=');

    return Buffer.from(padded, 'base64').toString('utf-8');
}

function normalizeTagPart(value: string): string {
    const normalized = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);

    return normalized || 'import';
}

@Injectable()
export class XrayJsonGeneratorService {
    private readonly logger = new Logger(XrayJsonGeneratorService.name);

    constructor(private readonly subscriptionTemplateService: SubscriptionTemplateService) {}

    public async generateConfig(params: IGenerateConfigParams): Promise<string> {
        const {
            hosts,
            isExtendedClient,
            overrideTemplateName,
            ignoreHostXrayJsonTemplate = false,
            extraImportSourceGroups = [],
        } = params;

        try {
            const templateContent = (await this.subscriptionTemplateService.getCachedTemplateByType(
                'XRAY_JSON',
                overrideTemplateName,
            )) as unknown as XrayJsonConfig;

            const configs: XrayJsonConfig[] = [];

            for (const host of hosts) {
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
                    if (injected) configs.push(injected);
                    continue;
                }

                const outboundConfig = this.buildOutboundConfig(host, isExtendedClient);
                if (!outboundConfig) continue;

                configs.push({
                    ...baseTemplate,
                    outbounds: [...outboundConfig.outbounds, ...baseTemplate.outbounds],
                    remarks: outboundConfig.remarks,
                    meta: outboundConfig.meta,
                });
            }

            configs.push(
                ...this.buildImportSourcePoolConfigs(templateContent, extraImportSourceGroups),
            );

            return JSON.stringify(configs, null, 0);
        } catch (error) {
            this.logger.error(`Error generating xray-json config: ${error}`);
            return '';
        }
    }

    private buildOutboundConfig(
        host: ResolvedProxyConfig,
        isExtendedClient: boolean,
        tag = 'proxy',
    ): XrayJsonConfig | null {
        try {
            const outbound = this.buildOutbound(host, tag);

            const config: XrayJsonConfig = {
                remarks: host.finalRemark,
                outbounds: [outbound],
            };

            if (isExtendedClient && host.clientOverrides.serverDescription) {
                config.meta = {
                    serverDescription: Buffer.from(
                        host.clientOverrides.serverDescription,
                        'base64',
                    ).toString(),
                };
            }

            return config;
        } catch (error) {
            this.logger.error(`Error creating config for host: ${error}`);
            return null;
        }
    }

    private buildImportSourcePoolConfigs(
        template: XrayJsonConfig,
        groups: ISubscriptionImportSourceGroup[],
    ): XrayJsonConfig[] {
        const groupedConfigs = groups
            .map((group, index) => this.buildImportSourceConfigsForGroup(template, group, index))
            .filter(Boolean) as ImportSourceGroupConfigs[];

        const universalAutoImportedConfigs = groupedConfigs.flatMap(
            (config) => config.autoImportedConfigs,
        );
        const universalAutoConfig = this.buildAutoImportSourceConfig(
            template,
            'AUTO',
            'lb_import_sources_auto',
            universalAutoImportedConfigs,
            buildImportSourcesDescription(groupedConfigs.flatMap((config) => config.sourceNames)),
        );

        return [
            ...(universalAutoConfig ? [universalAutoConfig] : []),
            ...groupedConfigs.flatMap((config) => (config.autoConfig ? [config.autoConfig] : [])),
            ...groupedConfigs.flatMap((config) => config.manualConfigs),
        ];
    }

    private buildImportSourceConfigsForGroup(
        template: XrayJsonConfig,
        group: ISubscriptionImportSourceGroup,
        groupIndex: number,
    ): ImportSourceGroupConfigs | null {
        const tagPrefix = `${normalizeTagPart(group.name)}-${groupIndex}`;
        const importedConfigs = group.rawLines
            .map((line, index) => this.parseImportSourceLine(line, tagPrefix, index))
            .filter(Boolean) as ImportedOutboundConfig[];

        if (importedConfigs.length === 0) {
            return null;
        }

        const { remnawave, ...baseTemplate } = template;
        const balancerTag = `lb_${tagPrefix}`;
        const autoImportedConfigs = importedConfigs.filter(
            (config) => !isRussianImportSourceConfig(config),
        );
        const sourceDescription = buildImportSourcesDescription(group.sourceNames);
        const autoConfig = this.buildAutoImportSourceConfig(
            template,
            `AUTO | ${group.name}`,
            balancerTag,
            autoImportedConfigs,
            sourceDescription,
        );

        const manualConfigs = importedConfigs.map((config) => ({
            ...baseTemplate,
            remarks: config.remarks,
            meta: {
                serverDescription: sourceDescription,
            },
            outbounds: [config.outbound, ...baseTemplate.outbounds],
        }));

        return {
            autoConfig,
            autoImportedConfigs,
            groupName: group.name,
            manualConfigs,
            sourceNames: group.sourceNames,
        };
    }

    private buildAutoImportSourceConfig(
        template: XrayJsonConfig,
        remarks: string,
        balancerTag: string,
        importedConfigs: ImportedOutboundConfig[],
        sourceDescription: string,
    ): XrayJsonConfig | null {
        if (importedConfigs.length === 0) {
            return null;
        }

        const { remnawave, ...baseTemplate } = template;
        const importedOutbounds = importedConfigs.map((config) => config.outbound);
        const subjectSelector = importedOutbounds.map((outbound) => outbound.tag);
        const existingRules = Array.isArray(baseTemplate.routing?.rules)
            ? baseTemplate.routing.rules
            : [];
        const templateBalancers = Array.isArray(baseTemplate.routing?.balancers)
            ? baseTemplate.routing.balancers
            : [];
        const existingBalancer = templateBalancers.find((balancer) => balancer.tag === balancerTag);
        const existingBalancers = templateBalancers.filter(
            (balancer) => balancer.tag !== balancerTag,
        );
        const existingBalancerSettings = getBalancerStrategySettings(existingBalancer);
        const maxRTT =
            typeof existingBalancerSettings.maxRTT === 'string'
                ? existingBalancerSettings.maxRTT
                : DEFAULT_IMPORT_SOURCE_AUTO_MAX_RTT;
        const existingSelector = Array.isArray(baseTemplate.observatory?.subjectSelector)
            ? baseTemplate.observatory.subjectSelector
            : [];

        return {
            ...baseTemplate,
            remarks,
            meta: {
                serverDescription: sourceDescription,
            },
            outbounds: [...importedOutbounds, ...baseTemplate.outbounds],
            observatory: {
                enableConcurrency: true,
                probeInterval: DEFAULT_IMPORT_SOURCE_AUTO_PROBE_INTERVAL,
                probeUrl: 'http://www.gstatic.com/generate_204',
                ...(baseTemplate.observatory ?? {}),
                subjectSelector: [...existingSelector, ...subjectSelector],
            },
            routing: {
                ...(baseTemplate.routing ?? {}),
                balancers: [
                    ...existingBalancers,
                    {
                        tag: balancerTag,
                        selector: subjectSelector,
                        strategy: {
                            type: 'leastLoad',
                            settings: {
                                costs: subjectSelector.map((tag) => ({
                                    match: tag,
                                    regexp: false,
                                    value: 0,
                                })),
                                expected: 1,
                                maxRTT,
                            },
                        },
                        fallbackTag: 'direct',
                    },
                ],
                rules: [
                    ...existingRules,
                    {
                        type: 'field',
                        balancerTag,
                        inboundTag: ['socks', 'http'],
                        network: 'tcp,udp',
                    },
                ],
            },
        };
    }

    private buildOutbound(host: ResolvedProxyConfig, tag: string): Outbound {
        const outbound: Outbound = {
            tag,
            protocol: host.protocol,
            settings: this.buildProtocolSettings(host),
            streamSettings: this.buildStreamSettings(host),
        };

        if (isNonEmptyObject(host.mux)) {
            outbound.mux = host.mux;
        }

        return outbound;
    }

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
        {
            tagPrefix,
            useHostRemarkAsTag,
            useHostTagAsTag,
        }: { tagPrefix?: string; useHostRemarkAsTag?: boolean; useHostTagAsTag?: boolean },
    ): Outbound[] {
        if (useHostRemarkAsTag) {
            return hosts.map((h) => this.buildOutbound(h, h.finalRemark));
        }

        if (useHostTagAsTag) {
            return hosts.map((h) => this.buildOutbound(h, h.metadata.tag || h.finalRemark));
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
        host: ResolvedProxyConfig,
        allHosts: ResolvedProxyConfig[],
    ): ResolvedProxyConfig[] {
        const source = selectFrom ?? 'HIDDEN';
        let candidates: ResolvedProxyConfig[] = [];
        switch (source) {
            case 'ALL':
                candidates = allHosts;
                break;
            case 'HIDDEN':
                candidates = allHosts.filter((h) => h.metadata.isHidden);
                break;
            case 'NOT_HIDDEN':
                candidates = allHosts.filter((h) => !h.metadata.isHidden);
                break;
        }

        switch (selector.type) {
            case 'uuids':
                return selector.values
                    .map((uuid) => candidates.find((h) => h.metadata.uuid === uuid))
                    .filter(Boolean) as ResolvedProxyConfig[];

            case 'remarkRegex': {
                const regex = this.parseRegex(selector.pattern);
                if (!regex) return [];
                return candidates.filter((h) => regex.test(h.finalRemark));
            }

            case 'sameTagAsRecipient':
                return candidates.filter(
                    (h) =>
                        h.metadata.tag && host.metadata.tag && h.metadata.tag === host.metadata.tag,
                );

            case 'tagRegex': {
                const regex = this.parseRegex(selector.pattern);
                if (!regex) return [];
                return candidates.filter((h) => h.metadata.tag && regex.test(h.metadata.tag));
            }
        }
    }

    private applyRemnawaveInjector(
        baseTemplate: XrayJsonConfig,
        host: ResolvedProxyConfig,
        allHosts: ResolvedProxyConfig[],
        isExtendedClient: boolean,
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
            remarks: host.finalRemark,
        };

        if (isExtendedClient && host.clientOverrides.serverDescription) {
            config.meta = {
                serverDescription: Buffer.from(
                    host.clientOverrides.serverDescription,
                    'base64',
                ).toString(),
            };
        }

        return config;
    }

    private parseImportSourceLine(
        line: string,
        tagPrefix: string,
        index: number,
        fallbackRemarks?: string,
    ): ImportedOutboundConfig | null {
        const schemeSeparatorIndex = line.indexOf('://');
        if (schemeSeparatorIndex === -1) {
            return null;
        }

        const scheme = line.slice(0, schemeSeparatorIndex).toLowerCase();
        const tag = `${tagPrefix}-${index}`;
        const remarks = fallbackRemarks ?? `${tagPrefix}-${index + 1}`;

        switch (scheme) {
            case 'vless':
                return this.parseVlessOrTrojanImportLine(line, 'vless', tag, remarks);
            case 'vmess':
                return this.parseVmessImportLine(line, tag, remarks);
            case 'trojan':
                return this.parseVlessOrTrojanImportLine(line, 'trojan', tag, remarks);
            case 'ss':
            case 'shadowsocks':
                return this.parseShadowsocksImportLine(line, tag, remarks);
            default:
                return null;
        }
    }

    private parseVmessImportLine(
        line: string,
        tag: string,
        fallbackRemarks: string,
    ): ImportedOutboundConfig | null {
        try {
            const encoded = line.slice(line.indexOf('://') + 3);
            const payload = JSON.parse(decodeBase64Url(encoded)) as Record<string, string>;
            const address = payload.add;
            const port = Number(payload.port);

            if (!address || !port || !payload.id) {
                return null;
            }

            const network = (payload.net ?? 'tcp').toLowerCase();
            const tlsMode = (payload.tls ?? '').toLowerCase();

            return {
                remarks: safeDecodeUriComponent(payload.ps ?? '') || fallbackRemarks,
                outbound: {
                    tag,
                    protocol: 'vmess',
                    settings: {
                        vnext: [
                            {
                                address,
                                port,
                                users: [
                                    {
                                        id: payload.id,
                                        alterId: Number(payload.aid ?? '0'),
                                        security: payload.scy ?? 'auto',
                                    },
                                ],
                            },
                        ],
                    },
                    streamSettings: {
                        network,
                        ...this.buildImportTransportSettings(
                            network,
                            new URLSearchParams({
                                host: payload.host ?? '',
                                path: payload.path ?? '',
                                serviceName: payload.path ?? '',
                                sni: payload.sni ?? payload.host ?? '',
                                fp: payload.fp ?? '',
                                alpn: payload.alpn ?? '',
                            }),
                        ),
                        ...this.buildImportSecuritySettings(
                            tlsMode === 'tls' ? 'tls' : 'none',
                            new URLSearchParams({
                                sni: payload.sni ?? payload.host ?? '',
                                fp: payload.fp ?? '',
                                alpn: payload.alpn ?? '',
                            }),
                        ),
                    },
                },
            };
        } catch {
            return null;
        }
    }

    private parseVlessOrTrojanImportLine(
        line: string,
        protocol: 'vless' | 'trojan',
        tag: string,
        fallbackRemarks: string,
    ): ImportedOutboundConfig | null {
        try {
            const url = new URL(line);
            const address = url.hostname;
            const port = Number(url.port);

            if (!address || !port) {
                return null;
            }

            const params = url.searchParams;
            const network = (params.get('type') ?? 'tcp').toLowerCase();
            const security = (
                params.get('security') ?? (protocol === 'trojan' ? 'tls' : 'none')
            ).toLowerCase();
            const remarks = safeDecodeUriComponent(url.hash.slice(1)) || fallbackRemarks;

            return {
                remarks,
                outbound: {
                    tag,
                    protocol,
                    settings:
                        protocol === 'vless'
                            ? {
                                  vnext: [
                                      {
                                          address,
                                          port,
                                          users: [
                                              {
                                                  id: safeDecodeUriComponent(url.username),
                                                  encryption: params.get('encryption') ?? 'none',
                                                  flow: params.get('flow') ?? undefined,
                                              },
                                          ],
                                      },
                                  ],
                              }
                            : {
                                  servers: [
                                      {
                                          address,
                                          port,
                                          password: safeDecodeUriComponent(url.username),
                                      },
                                  ],
                              },
                    streamSettings: {
                        network,
                        ...this.buildImportTransportSettings(network, params),
                        ...this.buildImportSecuritySettings(security, params),
                    },
                },
            };
        } catch {
            return null;
        }
    }

    private parseShadowsocksImportLine(
        line: string,
        tag: string,
        fallbackRemarks: string,
    ): ImportedOutboundConfig | null {
        try {
            const hashless = line.split('#', 1)[0];
            const queryless = hashless.split('?', 1)[0];
            const payload = queryless.slice(queryless.indexOf('://') + 3);
            const remarks =
                safeDecodeUriComponent(line.split('#').slice(1).join('#')) || fallbackRemarks;

            let decoded = payload;
            if (!payload.includes('@')) {
                decoded = decodeBase64Url(payload);
            }

            const atIndex = decoded.lastIndexOf('@');
            if (atIndex === -1) {
                return null;
            }

            let credentials = decoded.slice(0, atIndex);
            const serverPart = decoded.slice(atIndex + 1);

            if (!credentials.includes(':')) {
                credentials = decodeBase64Url(credentials);
            }

            const separatorIndex = credentials.indexOf(':');
            if (separatorIndex === -1) {
                return null;
            }

            const method = credentials.slice(0, separatorIndex);
            const password = credentials.slice(separatorIndex + 1);
            const serverUrl = new URL(`http://${serverPart}`);
            const address = serverUrl.hostname;
            const port = Number(serverUrl.port);

            if (!address || !port) {
                return null;
            }

            return {
                remarks,
                outbound: {
                    tag,
                    protocol: 'shadowsocks',
                    settings: {
                        servers: [
                            {
                                address,
                                port,
                                method,
                                password,
                            },
                        ],
                    },
                },
            };
        } catch {
            return null;
        }
    }

    private buildImportTransportSettings(
        network: string,
        params: URLSearchParams,
    ): Partial<StreamSettings> {
        switch (network) {
            case 'ws':
                return {
                    wsSettings: {
                        path: params.get('path') ?? '/',
                        headers: {
                            ...(params.get('host') ? { Host: params.get('host') } : {}),
                        },
                    },
                };
            case 'grpc':
                return {
                    grpcSettings: {
                        serviceName: params.get('serviceName'),
                        authority: params.get('authority') ?? params.get('host'),
                        mode: params.get('mode') === 'multi',
                    },
                };
            case 'httpupgrade':
                return {
                    httpupgradeSettings: {
                        path: params.get('path') ?? '/',
                        host: params.get('host'),
                        headers: {
                            ...(params.get('host') ? { Host: params.get('host') } : {}),
                        },
                    },
                };
            case 'xhttp':
                return {
                    xhttpSettings: {
                        mode: params.get('mode'),
                        host: params.get('host'),
                        path: params.get('path'),
                    },
                };
            case 'tcp':
            default:
                return {
                    tcpSettings: {},
                };
        }
    }

    private buildImportSecuritySettings(
        security: string,
        params: URLSearchParams,
    ): Partial<StreamSettings> {
        switch (security) {
            case 'tls':
                return {
                    security: 'tls',
                    tlsSettings: {
                        serverName: params.get('sni') ?? '',
                        ...(params.get('fp') ? { fingerprint: params.get('fp') } : {}),
                        ...(params.get('alpn')
                            ? { alpn: params.get('alpn')?.split(',').filter(Boolean) }
                            : {}),
                        ...(params.get('allowInsecure') === '1' ||
                        params.get('allowInsecure') === 'true'
                            ? { allowInsecure: true }
                            : {}),
                    },
                };
            case 'reality':
                return {
                    security: 'reality',
                    realitySettings: {
                        serverName: params.get('sni') ?? '',
                        ...(params.get('pbk') || params.get('publicKey')
                            ? { publicKey: params.get('pbk') ?? params.get('publicKey') }
                            : {}),
                        ...(params.get('sid') || params.get('shortId')
                            ? { shortId: params.get('sid') ?? params.get('shortId') }
                            : {}),
                        ...(params.get('spx') || params.get('spiderX')
                            ? { spiderX: params.get('spx') ?? params.get('spiderX') }
                            : {}),
                        ...(params.get('fp') ? { fingerprint: params.get('fp') } : {}),
                    },
                };
            case 'none':
            default:
                return {
                    security: 'none',
                };
        }
    }
}
