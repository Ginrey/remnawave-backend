import { createHash } from 'node:crypto';

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
    OutboundSettings,
    StreamSettings,
    XrayJsonConfig,
} from './interfaces/xray-json-config.interface';
import { ImportSourceGeoIpClassifierService } from '../services/import-source-geoip-classifier.service';
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
    geoIpCountryCode?: string;
    outbound: Outbound;
    remarks: string;
    supportingOutbounds?: Outbound[];
    sourceGroupName?: string;
    sourceNames?: string[];
};

type XrayJsonImportPayload = {
    outbound: Outbound;
    remarks: string;
    supportingOutbounds?: Outbound[];
};

type KnownImportSourceManualGroupKey =
    | 'germany'
    | 'netherlands'
    | 'sweden'
    | 'france'
    | 'usa'
    | 'switzerland'
    | 'poland'
    | 'singapore'
    | 'kazakhstan'
    | 'thailand'
    | 'russia'
    | 'lte'
    | 'other';

type CountryImportSourceManualGroupKey = `country:${string}:${string}`;
type ImportSourceManualGroupKey =
    | KnownImportSourceManualGroupKey
    | CountryImportSourceManualGroupKey;

type ImportSourceManualGroup = {
    configs: ImportedOutboundConfig[];
    groupKey: ImportSourceManualGroupKey;
    remarks: string;
    tagPart: string;
};

type ImportSourceGroupConfigs = {
    autoImportedConfigs: ImportedOutboundConfig[];
    importedConfigs: ImportedOutboundConfig[];
    sourceNames: string[];
};

type ImportSourceBalancerStrategy = 'leastLoad' | 'leastPing' | 'random';
type ImportSourceXrayJsonRuntimeSettings = {
    autoExcludedCountryCodes: string[];
    autoExcludedHostPatterns: string[];
    autoFallbackPolicy: 'first' | 'stableHash';
    autoIncludeLte: boolean;
    autoProbeInterval: string;
    autoProbeUrl: string;
    autoSortEnabled: boolean;
    blockBitTorrent: boolean;
    clientPreset: 'advanced' | 'happSafe';
    directPrivateNetworks: boolean;
    observatoryEnableConcurrency: boolean;
    routingDomainStrategy: 'AsIs' | 'IPIfNonMatch' | 'IPOnDemand' | null;
};

const RUSSIAN_IMPORT_SOURCE_REMARK_PATTERN = /(?:🇷🇺|росси[яи])/iu;
const DEFAULT_IMPORT_SOURCE_AUTO_PROBE_INTERVAL = '2m';
const DEFAULT_IMPORT_SOURCE_OBSERVATORY_URL = 'https://connectivitycheck.gstatic.com/generate_204';
const DEFAULT_IMPORT_SOURCE_XRAY_JSON_RUNTIME_SETTINGS: ImportSourceXrayJsonRuntimeSettings = {
    autoExcludedCountryCodes: ['RU'],
    autoExcludedHostPatterns: ['rus', 'russia', '.ru', 'росси'],
    autoFallbackPolicy: 'first',
    autoIncludeLte: true,
    autoProbeInterval: DEFAULT_IMPORT_SOURCE_AUTO_PROBE_INTERVAL,
    autoProbeUrl: DEFAULT_IMPORT_SOURCE_OBSERVATORY_URL,
    autoSortEnabled: true,
    blockBitTorrent: false,
    clientPreset: 'happSafe',
    directPrivateNetworks: false,
    observatoryEnableConcurrency: true,
    routingDomainStrategy: null,
};
const PLACEHOLDER_IMPORT_SOURCE_ADDRESSES = new Set(['::', '::0', '0.0.0.0']);
const ZERO_UUID = '00000000-0000-0000-0000-000000000000';
const XRAY_JSON_IMPORT_PROTOCOL = 'xray-json://';
const REGIONAL_INDICATOR_SYMBOL_LETTER_A = 0x1f1e6;
const ASCII_LOWERCASE_A = 97;
const COUNTRY_DISPLAY_NAMES = new Intl.DisplayNames(['ru'], { type: 'region' });
const IMPORT_SOURCE_COUNTRY_CODE_ALIASES: Record<string, string> = {
    uk: 'gb',
};
const IMPORT_SOURCE_COUNTRY_LABEL_ALIASES: Record<string, string> = {
    ae: 'ОАЭ',
    gb: 'Великобритания',
    hk: 'Гонконг',
    kg: 'Кыргызстан',
    kr: 'Южная Корея',
    mk: 'Македония',
    sa: 'Саудовская Аравия',
    us: 'США',
};
const IMPORT_SOURCE_MANUAL_GROUP_ORDER: KnownImportSourceManualGroupKey[] = [
    'lte',
    'germany',
    'netherlands',
    'sweden',
    'france',
    'usa',
    'switzerland',
    'poland',
    'singapore',
    'kazakhstan',
    'thailand',
    'russia',
    'other',
];

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;
}

function mergeStringLists(...lists: unknown[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const list of lists) {
        if (!Array.isArray(list)) continue;

        for (const item of list) {
            if (!isNonEmptyString(item) || seen.has(item)) continue;

            seen.add(item);
            result.push(item);
        }
    }

    return result;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function getNonEmptyParam(params: URLSearchParams, key: string): string | undefined {
    const value = params.get(key);

    return isNonEmptyString(value) ? value : undefined;
}

function getCountryCodeFromFlag(flag: string): string | null {
    const codePoints = Array.from(flag);
    if (codePoints.length !== 2) return null;

    const letters = codePoints.map((symbol) => {
        const codePoint = symbol.codePointAt(0);
        if (
            codePoint === undefined ||
            codePoint < REGIONAL_INDICATOR_SYMBOL_LETTER_A ||
            codePoint > REGIONAL_INDICATOR_SYMBOL_LETTER_A + 25
        ) {
            return null;
        }

        return String.fromCharCode(
            ASCII_LOWERCASE_A + codePoint - REGIONAL_INDICATOR_SYMBOL_LETTER_A,
        );
    });

    return letters.every(isNonEmptyString) ? letters.join('') : null;
}

function getFlagFromCountryCode(countryCode: string): string {
    return Array.from(countryCode.toUpperCase())
        .map((letter) =>
            String.fromCodePoint(REGIONAL_INDICATOR_SYMBOL_LETTER_A + letter.charCodeAt(0) - 65),
        )
        .join('');
}

function buildCountryManualGroupKey(
    countryCode: string,
    flag?: string,
): CountryImportSourceManualGroupKey | null {
    const aliasedCountryCode = IMPORT_SOURCE_COUNTRY_CODE_ALIASES[countryCode.toLowerCase()];
    const normalizedCountryCode = (aliasedCountryCode ?? countryCode).toUpperCase();
    if (!/^[A-Z]{2}$/.test(normalizedCountryCode) || normalizedCountryCode === 'EU') {
        return null;
    }

    const normalizedCountryCodeLower = normalizedCountryCode.toLowerCase();
    const displayName =
        IMPORT_SOURCE_COUNTRY_LABEL_ALIASES[normalizedCountryCodeLower] ||
        COUNTRY_DISPLAY_NAMES.of(normalizedCountryCode);
    if (!displayName || displayName === normalizedCountryCode) {
        return null;
    }

    const normalizedFlag = flag ?? getFlagFromCountryCode(normalizedCountryCode);

    return `country:${normalizedCountryCodeLower}:${normalizedFlag} ${displayName}`;
}

function getCountryManualGroupKeyFromFlagText(
    text: string,
): CountryImportSourceManualGroupKey | null {
    const flagMatch = text.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u);
    if (!flagMatch) return null;

    const countryCode = getCountryCodeFromFlag(flagMatch[0]);
    if (!countryCode) return null;

    return buildCountryManualGroupKey(countryCode, flagMatch[0]);
}

function getCountryManualGroupKeyFromEndpointText(
    endpointText: string,
): CountryImportSourceManualGroupKey | null {
    for (const match of endpointText.matchAll(/(?:^|[.\-_])([a-z]{2})(?=[.\-_]|$)/giu)) {
        const groupKey = buildCountryManualGroupKey(match[1]);
        if (groupKey) return groupKey;
    }

    return null;
}

function isValidPort(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value > 1 && value <= 65_535;
}

function isValidServerAddress(value: unknown): value is string {
    return isNonEmptyString(value) && !PLACEHOLDER_IMPORT_SOURCE_ADDRESSES.has(value);
}

function isValidUserId(value: unknown): value is string {
    return isNonEmptyString(value) && value !== ZERO_UUID;
}

function hasValidVnextServer(settings: OutboundSettings): boolean {
    return (
        settings.vnext?.some((server) => {
            return (
                isValidServerAddress(server.address) &&
                isValidPort(server.port) &&
                server.users.some((user) => isValidUserId(user.id))
            );
        }) ?? false
    );
}

function hasValidServerEntry(settings: OutboundSettings, protocol: string): boolean {
    return (
        settings.servers?.some((server) => {
            const hasEndpoint = isValidServerAddress(server.address) && isValidPort(server.port);
            if (!hasEndpoint) return false;

            if (protocol === 'trojan') {
                return isNonEmptyString(server.password);
            }

            if (protocol === 'shadowsocks') {
                return isNonEmptyString(server.method) && isNonEmptyString(server.password);
            }

            return true;
        }) ?? false
    );
}

function hasServerData(config: ImportedOutboundConfig): boolean {
    switch (config.outbound.protocol) {
        case 'vless':
        case 'vmess':
            return hasValidVnextServer(config.outbound.settings);
        case 'trojan':
        case 'shadowsocks':
            return hasValidServerEntry(config.outbound.settings, config.outbound.protocol);
        default:
            return true;
    }
}

function getImportSourceEndpointText(config: ImportedOutboundConfig): string {
    return getImportSourceEndpointIdentifiers(config).join(' ').toLowerCase();
}

function getImportSourceEndpointAddresses(config: ImportedOutboundConfig): string[] {
    const outbound = config.outbound;
    const vnext = outbound.settings.vnext?.[0];
    const server = outbound.settings.servers?.[0];

    return [vnext?.address, server?.address].filter(isNonEmptyString);
}

function getImportSourceEndpointIdentifiers(config: ImportedOutboundConfig): string[] {
    const outbound = config.outbound;
    const streamSettings = asRecord(outbound.streamSettings);
    const tlsSettings = asRecord(streamSettings?.tlsSettings);
    const realitySettings = asRecord(streamSettings?.realitySettings);

    return [
        ...getImportSourceEndpointAddresses(config),
        tlsSettings?.serverName,
        realitySettings?.serverName,
        outbound.tag,
    ].filter(isNonEmptyString);
}

function getImportSourceClassificationText(config: ImportedOutboundConfig): string {
    return [config.remarks, getImportSourceEndpointText(config)]
        .filter(isNonEmptyString)
        .join(' ')
        .toLowerCase()
        .replace(/\s+/g, ' ');
}

function getImportSourceContextText(config: ImportedOutboundConfig): string {
    return [
        config.remarks,
        config.sourceGroupName,
        ...(config.sourceNames ?? []),
        getImportSourceEndpointText(config),
    ]
        .filter(isNonEmptyString)
        .join(' ')
        .toLowerCase()
        .replace(/\s+/g, ' ');
}

function isLteImportSourceText(text: string): boolean {
    return /\blte\b|лте|бел(?:ые|ый|ых|ого)?\s+списк/iu.test(text);
}

function isRussianImportSourceConfig(config: ImportedOutboundConfig): boolean {
    const classificationText = getImportSourceClassificationText(config);
    const endpointText = getImportSourceEndpointText(config);

    return (
        RUSSIAN_IMPORT_SOURCE_REMARK_PATTERN.test(classificationText) ||
        /(?:^|\s|\.)ru(?:\s|$|\.|-)|\[ru\]|\bru-\d|\byandex\b|\bvk(?:proxy)?\b|userapi\.com|max\.ru|x5\.ru|cdp\.x5\.ru/iu.test(
            endpointText,
        )
    );
}

function getImportSourceFingerprint(config: ImportedOutboundConfig): string {
    const outbound = config.outbound;
    const streamSettings: Partial<StreamSettings> = outbound.streamSettings ?? {};
    const vnext = outbound.settings.vnext?.[0];
    const user = vnext?.users?.[0];
    const server = outbound.settings.servers?.[0];

    return JSON.stringify({
        protocol: outbound.protocol,
        address: vnext?.address ?? server?.address ?? '',
        port: vnext?.port ?? server?.port ?? '',
        userId: user?.id ?? '',
        userSecurity: user?.security ?? '',
        encryption: user?.encryption ?? '',
        flow: user?.flow ?? '',
        password: server?.password ?? '',
        method: server?.method ?? '',
        network: streamSettings.network ?? '',
        security: streamSettings.security ?? '',
        tlsSettings: streamSettings.tlsSettings ?? null,
        realitySettings: streamSettings.realitySettings ?? null,
        wsSettings: streamSettings.wsSettings ?? null,
        grpcSettings: streamSettings.grpcSettings ?? null,
        httpupgradeSettings: streamSettings.httpupgradeSettings ?? null,
        xhttpSettings: streamSettings.xhttpSettings ?? null,
    });
}

function getStableHashPart(value: string): string {
    return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

function getStableImportSourceTag(tagPrefix: string, config: ImportedOutboundConfig): string {
    return `${normalizeTagPart(tagPrefix)}-${getStableHashPart(getImportSourceFingerprint(config))}-proxy`;
}

function getStableSupportingOutboundTag(
    primaryTag: string,
    supportingOutbound: Outbound,
    supportIndex: number,
): string {
    const fingerprintOutbound = cloneOutbound(supportingOutbound) as Partial<Outbound>;
    delete fingerprintOutbound.tag;

    return `support-${primaryTag}-${getStableHashPart(
        JSON.stringify(fingerprintOutbound),
    )}-${supportIndex}`;
}

function dedupeImportedConfigs(configs: ImportedOutboundConfig[]): ImportedOutboundConfig[] {
    const seen = new Set<string>();
    const deduped: ImportedOutboundConfig[] = [];

    for (const config of configs) {
        const fingerprint = getImportSourceFingerprint(config);
        if (seen.has(fingerprint)) continue;

        seen.add(fingerprint);
        deduped.push(config);
    }

    return deduped;
}

function getImportSourceManualGroupKey(config: ImportedOutboundConfig): ImportSourceManualGroupKey {
    const text = getImportSourceClassificationText(config);
    const endpointText = getImportSourceEndpointText(config);

    if (isRussianImportSourceConfig(config)) return 'russia';
    if (isLteImportSourceText(text)) return 'lte';
    if (/🇩🇪|герман|\bde\b|\[de\]|(?:^|\.)de(?:\.|-|$)|\bger(?:many)?\b/iu.test(text)) {
        return 'germany';
    }
    if (/🇳🇱|нидерланд|\bnl\b|\[nl\]|(?:^|\.)nl(?:\.|-|$)/iu.test(text)) {
        return 'netherlands';
    }
    if (/🇸🇪|швец|\bsweden\b|\bse\b|\[se\]|(?:^|\.)se(?:\.|-|$)/iu.test(text)) {
        return 'sweden';
    }
    if (/🇫🇷|франц|\bfr-|^\[fr\]|\bfr\b|\[fr\]|(?:^|\.)fr(?:\.|-|$)/iu.test(text)) {
        return 'france';
    }
    if (/🇺🇸|сша|\busa\b|\bus\b|\[us\]|(?:^|\.)us(?:\.|-|$)|united/iu.test(text)) {
        return 'usa';
    }
    if (/🇨🇭|швейцар|\bch\b|\[ch\]|\bsw\.|(?:^|\.)ch(?:\.|-|$)/iu.test(text)) {
        return 'switzerland';
    }
    if (/🇵🇱|польш|\bpl\b|\[pl\]|(?:^|\.)pl(?:\.|-|$)/iu.test(text)) return 'poland';
    if (/🇸🇬|сингапур|\bsg\b|\[sg\]|(?:^|\.)sg(?:\.|-|$)/iu.test(text)) return 'singapore';
    if (/казах|\bkz-|^\[kz\]|\bkz\b|\[kz\]|(?:^|\.)kz(?:\.|-|$)/iu.test(text)) {
        return 'kazakhstan';
    }
    if (/🇹🇭|таиланд|\bth-|\bth\b|\[th\]|(?:^|\.)th(?:\.|-|$)|\bthai(?:land)?\b/iu.test(text)) {
        return 'thailand';
    }

    const countryGroupKeyFromFlag = getCountryManualGroupKeyFromFlagText(config.remarks);
    if (countryGroupKeyFromFlag) return countryGroupKeyFromFlag;

    if (/(?:^|\.)de(?:\.|-|$)/iu.test(endpointText)) return 'germany';
    if (/(?:^|\.)nl(?:\.|-|$)/iu.test(endpointText)) return 'netherlands';
    if (/(?:^|\.)se(?:\.|-|$)/iu.test(endpointText)) return 'sweden';
    if (/(?:^|\.)fr(?:\.|-|$)/iu.test(endpointText)) return 'france';
    if (/(?:^|\.)us(?:\.|-|$)/iu.test(endpointText)) return 'usa';
    if (/(?:^|\.)ch(?:\.|-|$)/iu.test(endpointText)) return 'switzerland';
    if (/(?:^|\.)pl(?:\.|-|$)/iu.test(endpointText)) return 'poland';
    if (/(?:^|\.)sg(?:\.|-|$)/iu.test(endpointText)) return 'singapore';
    if (/(?:^|\.)kz(?:\.|-|$)/iu.test(endpointText)) return 'kazakhstan';
    if (/(?:^|\.)th(?:\.|-|$)/iu.test(endpointText)) return 'thailand';

    const countryGroupKeyFromEndpoint = getCountryManualGroupKeyFromEndpointText(endpointText);
    if (countryGroupKeyFromEndpoint) return countryGroupKeyFromEndpoint;

    if (config.geoIpCountryCode) {
        const geoIpGroupKey = buildCountryManualGroupKey(
            config.geoIpCountryCode,
            getFlagFromCountryCode(config.geoIpCountryCode),
        );

        if (geoIpGroupKey) return geoIpGroupKey;
    }

    return 'other';
}

function buildImportSourceManualGroupRemarks(groupKey: ImportSourceManualGroupKey): string {
    if (groupKey.startsWith('country:')) {
        return groupKey.split(':').slice(2).join(':');
    }

    switch (groupKey) {
        case 'germany':
            return '🇩🇪 Германия';
        case 'netherlands':
            return '🇳🇱 Нидерланды';
        case 'sweden':
            return '🇸🇪 Швеция';
        case 'france':
            return '🇫🇷 Франция';
        case 'usa':
            return '🇺🇸 США';
        case 'switzerland':
            return '🇨🇭 Швейцария';
        case 'poland':
            return '🇵🇱 Польша';
        case 'singapore':
            return '🇸🇬 Сингапур';
        case 'kazakhstan':
            return '🇰🇿 Казахстан';
        case 'thailand':
            return '🇹🇭 Таиланд';
        case 'russia':
            return '🇷🇺 Россия';
        case 'lte':
            return '🇪🇺 LTE (Белые списки)';
        default:
            return '🌍 Прочие';
    }
}

function getImportSourceManualGroupSortIndex(groupKey: ImportSourceManualGroupKey): number {
    if (groupKey.startsWith('country:')) {
        return IMPORT_SOURCE_MANUAL_GROUP_ORDER.indexOf('russia');
    }

    const index = IMPORT_SOURCE_MANUAL_GROUP_ORDER.indexOf(
        groupKey as KnownImportSourceManualGroupKey,
    );
    return index === -1 ? IMPORT_SOURCE_MANUAL_GROUP_ORDER.length : index;
}

function groupImportedConfigsForManualOutput(
    configs: ImportedOutboundConfig[],
): ImportSourceManualGroup[] {
    const groups = new Map<ImportSourceManualGroupKey, ImportedOutboundConfig[]>();

    for (const config of configs) {
        const groupKey = getImportSourceManualGroupKey(config);
        const group = groups.get(groupKey) ?? [];
        group.push(config);
        groups.set(groupKey, group);
    }

    return Array.from(groups.entries())
        .sort(([left], [right]) => {
            const leftIndex = getImportSourceManualGroupSortIndex(left);
            const rightIndex = getImportSourceManualGroupSortIndex(right);

            return leftIndex - rightIndex || left.localeCompare(right);
        })
        .map(([groupKey, groupConfigs]) => ({
            configs: groupConfigs,
            groupKey,
            remarks: buildImportSourceManualGroupRemarks(groupKey),
            tagPart: normalizeTagPart(groupKey),
        }));
}

function getImportSourceAutoSortIndex(config: ImportedOutboundConfig): number {
    const classificationText = getImportSourceClassificationText(config);
    const groupKey = getImportSourceManualGroupKey(config);

    if (!isLteImportSourceText(classificationText) && groupKey !== 'other') return 0;
    if (groupKey !== 'other') return 1;
    if (!isLteImportSourceText(classificationText)) return 2;

    return 3;
}

function sortImportedConfigsForAutoOutput(
    configs: ImportedOutboundConfig[],
): ImportedOutboundConfig[] {
    return [...configs].sort((left, right) => {
        return (
            getImportSourceAutoSortIndex(left) - getImportSourceAutoSortIndex(right) ||
            left.outbound.tag.localeCompare(right.outbound.tag)
        );
    });
}

function getImportSourceCountryCode(config: ImportedOutboundConfig): string | null {
    if (config.geoIpCountryCode) return config.geoIpCountryCode.toUpperCase();

    const groupKey = getImportSourceManualGroupKey(config);

    if (groupKey.startsWith('country:')) {
        return groupKey.split(':')[1]?.toUpperCase() ?? null;
    }

    if (groupKey === 'usa') return 'US';
    if (groupKey === 'russia') return 'RU';

    const regionNames: Record<string, string> = {
        france: 'FR',
        germany: 'DE',
        kazakhstan: 'KZ',
        netherlands: 'NL',
        poland: 'PL',
        singapore: 'SG',
        sweden: 'SE',
        switzerland: 'CH',
        thailand: 'TH',
    };

    return regionNames[groupKey] ?? null;
}

function matchesAutoExcludedHostPattern(text: string, pattern: string): boolean {
    const normalizedPattern = pattern.trim().toLowerCase();
    if (!normalizedPattern) return false;

    if (normalizedPattern.startsWith('.')) {
        return text.includes(normalizedPattern);
    }

    return text
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean)
        .some((token) => token.startsWith(normalizedPattern));
}

function isExcludedFromAuto(
    config: ImportedOutboundConfig,
    settings: ImportSourceXrayJsonRuntimeSettings,
): boolean {
    const excludedCountries = new Set(
        settings.autoExcludedCountryCodes.map((countryCode) => countryCode.toUpperCase()),
    );
    const countryCode = getImportSourceCountryCode(config);
    const classificationText = getImportSourceClassificationText(config);

    if (countryCode && excludedCountries.has(countryCode)) return true;
    if (
        settings.autoExcludedHostPatterns.some((pattern) =>
            matchesAutoExcludedHostPattern(classificationText, pattern),
        )
    ) {
        return true;
    }
    if (!settings.autoIncludeLte && isLteImportSourceText(classificationText)) return true;

    return false;
}

function getStableFallbackTag(outbounds: Outbound[], seed: string): string | null {
    if (outbounds.length === 0) return null;

    return (
        outbounds.reduce(
            (selected, outbound) => {
                if (!selected) return outbound;

                const selectedScore = createHash('sha256')
                    .update(`${seed}:${selected.tag}`)
                    .digest('hex')
                    .slice(0, 16);
                const outboundScore = createHash('sha256')
                    .update(`${seed}:${outbound.tag}`)
                    .digest('hex')
                    .slice(0, 16);

                if (outboundScore > selectedScore) return outbound;
                if (outboundScore < selectedScore) return selected;

                return outbound.tag.localeCompare(selected.tag) < 0 ? outbound : selected;
            },
            null as Outbound | null,
        )?.tag ?? null
    );
}

function ensureOutbound(outbounds: Outbound[], outbound: Outbound): Outbound[] {
    if (outbounds.some((existing) => existing.tag === outbound.tag)) return outbounds;

    return [...outbounds, outbound];
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

function isXrayJsonImportPayload(value: unknown): value is XrayJsonImportPayload {
    const payload = asRecord(value);
    const outbound = asRecord(payload?.outbound);

    return Boolean(
        payload &&
        outbound &&
        typeof payload.remarks === 'string' &&
        typeof outbound.protocol === 'string' &&
        asRecord(outbound.settings),
    );
}

function cloneOutbound(outbound: Outbound): Outbound {
    return JSON.parse(JSON.stringify(outbound)) as Outbound;
}

function rewriteDialerProxyTag(
    outbound: Outbound,
    tagByOriginalTag: Map<string, string>,
): Outbound {
    const cloned = cloneOutbound(outbound);
    const streamSettings = asRecord(cloned.streamSettings);
    const sockopt = asRecord(streamSettings?.sockopt);
    const dialerProxy = sockopt?.dialerProxy;

    if (typeof dialerProxy === 'string') {
        const rewrittenTag = tagByOriginalTag.get(dialerProxy);
        if (rewrittenTag) {
            sockopt!.dialerProxy = rewrittenTag;
        }
    }

    return cloned;
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

    constructor(
        private readonly subscriptionTemplateService: SubscriptionTemplateService,
        private readonly importSourceGeoIpClassifier: ImportSourceGeoIpClassifierService,
    ) {}

    public async generateConfig(params: IGenerateConfigParams): Promise<string> {
        const {
            hosts,
            isExtendedClient,
            overrideTemplateName,
            ignoreHostXrayJsonTemplate = false,
            extraImportSourceGroups = [],
            fullImportSourceList = false,
            importSourceAutoStrategy = 'random',
            importSourceManualStrategy = 'random',
            importSourceXrayJsonSettings,
            importSourceFallbackSeed = '',
        } = params;
        const runtimeImportSourceSettings: ImportSourceXrayJsonRuntimeSettings = {
            ...DEFAULT_IMPORT_SOURCE_XRAY_JSON_RUNTIME_SETTINGS,
            ...importSourceXrayJsonSettings,
        };

        try {
            const templateContent = (await this.subscriptionTemplateService.getCachedTemplateByType(
                'XRAY_JSON',
                overrideTemplateName,
            )) as unknown as XrayJsonConfig;

            const configs: XrayJsonConfig[] = [];
            const panelHostImportConfigs: ImportedOutboundConfig[] = [];

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

                if (!host.clientOverrides.xrayJsonTemplate || ignoreHostXrayJsonTemplate) {
                    const panelHostImportConfig = this.buildPanelHostImportSourceConfig(host);
                    if (panelHostImportConfig) panelHostImportConfigs.push(panelHostImportConfig);
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
                ...this.buildImportSourcePoolConfigs(
                    templateContent,
                    extraImportSourceGroups,
                    fullImportSourceList,
                    importSourceAutoStrategy,
                    importSourceManualStrategy,
                    runtimeImportSourceSettings,
                    importSourceFallbackSeed,
                    panelHostImportConfigs,
                ),
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

    private buildPanelHostImportSourceConfig(
        host: ResolvedProxyConfig,
    ): ImportedOutboundConfig | null {
        try {
            const initialConfig: ImportedOutboundConfig = {
                remarks: host.finalRemark,
                outbound: this.buildOutbound(host, 'panel-host-proxy'),
                sourceGroupName: 'panel',
                sourceNames: ['Panel Hosts'],
            };
            const stableTag = getStableImportSourceTag('panel', initialConfig);
            const outbound = {
                ...initialConfig.outbound,
                tag: stableTag,
            };
            const config: ImportedOutboundConfig = {
                ...initialConfig,
                outbound,
            };

            return {
                ...config,
                geoIpCountryCode: this.getImportSourceGeoIpCountryCode(config),
            };
        } catch (error) {
            this.logger.error(`Error creating import-source config for panel host: ${error}`);
            return null;
        }
    }

    private buildImportSourcePoolConfigs(
        template: XrayJsonConfig,
        groups: ISubscriptionImportSourceGroup[],
        fullImportSourceList: boolean,
        importSourceAutoStrategy: ImportSourceBalancerStrategy,
        importSourceManualStrategy: ImportSourceBalancerStrategy,
        importSourceSettings: ImportSourceXrayJsonRuntimeSettings,
        importSourceFallbackSeed: string,
        panelHostImportConfigs: ImportedOutboundConfig[] = [],
    ): XrayJsonConfig[] {
        const importSourceGroupedConfigs = groups
            .map((group) => this.buildImportSourceConfigsForGroup(group))
            .filter(Boolean) as ImportSourceGroupConfigs[];
        const panelGroupedConfigs: ImportSourceGroupConfigs[] =
            panelHostImportConfigs.length > 0
                ? [
                      {
                          autoImportedConfigs: panelHostImportConfigs,
                          importedConfigs: panelHostImportConfigs,
                          sourceNames: ['Panel Hosts'],
                      },
                  ]
                : [];
        const groupedConfigs = [...panelGroupedConfigs, ...importSourceGroupedConfigs];

        const allImportedConfigs = dedupeImportedConfigs(
            groupedConfigs.flatMap((config) => config.importedConfigs),
        );
        const universalAutoImportedConfigs = dedupeImportedConfigs(
            groupedConfigs
                .flatMap((config) => config.autoImportedConfigs)
                .filter((config) => !isExcludedFromAuto(config, importSourceSettings)),
        );
        const universalAutoConfig = this.buildAutoImportSourceConfig(
            template,
            'AUTO',
            'lb_import_sources_auto',
            importSourceSettings.autoSortEnabled
                ? sortImportedConfigsForAutoOutput(universalAutoImportedConfigs)
                : universalAutoImportedConfigs,
            importSourceAutoStrategy,
            importSourceSettings,
            importSourceFallbackSeed,
        );

        if (fullImportSourceList) {
            const indexedManualConfigs = this.buildIndexedFullImportSourceConfigs(
                template,
                groupedConfigs,
                importSourceManualStrategy,
                importSourceSettings,
            );

            return [...(universalAutoConfig ? [universalAutoConfig] : []), ...indexedManualConfigs];
        }

        const manualGroups = groupImportedConfigsForManualOutput(allImportedConfigs);
        const manualConfigs = manualGroups
            .map((manualGroup, groupIndex) =>
                this.buildManualImportSourceGroupConfig(
                    template,
                    manualGroup,
                    groupIndex,
                    importSourceManualStrategy,
                    importSourceSettings,
                ),
            )
            .filter(Boolean) as XrayJsonConfig[];

        return [...(universalAutoConfig ? [universalAutoConfig] : []), ...manualConfigs];
    }

    private buildIndexedFullImportSourceConfigs(
        template: XrayJsonConfig,
        groupedConfigs: ImportSourceGroupConfigs[],
        importSourceManualStrategy: ImportSourceBalancerStrategy,
        importSourceSettings: ImportSourceXrayJsonRuntimeSettings,
    ): XrayJsonConfig[] {
        // Dedupe across all groups first — the same server may appear in multiple import source groups.
        const allConfigs = dedupeImportedConfigs(
            groupedConfigs.flatMap((groupConfig) => groupConfig.importedConfigs),
        );

        // Group servers by country key so each country block is numbered independently.
        const byGroupKey = new Map<ImportSourceManualGroupKey, ImportedOutboundConfig[]>();
        for (const config of allConfigs) {
            const key = getImportSourceManualGroupKey(config);
            if (!byGroupKey.has(key)) {
                byGroupKey.set(key, []);
            }
            byGroupKey.get(key)!.push(config);
        }

        // Sort country groups by their display order.
        const sortedGroupKeys = [...byGroupKey.keys()].sort((a, b) => {
            return (
                getImportSourceManualGroupSortIndex(a) -
                    getImportSourceManualGroupSortIndex(b) || a.localeCompare(b)
            );
        });

        const result: XrayJsonConfig[] = [];
        let globalIndex = 0;

        for (const groupKey of sortedGroupKeys) {
            const configs = byGroupKey.get(groupKey)!;
            const countryName = buildImportSourceManualGroupRemarks(groupKey);
            const tagPart = normalizeTagPart(groupKey);

            // Sort servers within a group stably by outbound tag.
            configs.sort((a, b) => a.outbound.tag.localeCompare(b.outbound.tag));

            for (let i = 0; i < configs.length; i++) {
                // Always append #N so the user can distinguish servers within the same country.
                const remarks = `${countryName} #${i + 1}`;

                const built = this.buildManualImportSourceGroupConfig(
                    template,
                    { configs: [configs[i]], groupKey, remarks, tagPart },
                    globalIndex,
                    importSourceManualStrategy,
                    importSourceSettings,
                );

                if (built) {
                    result.push(built);
                    globalIndex++;
                }
            }
        }

        return result;
    }

    private buildManualImportSourceGroupConfig(
        template: XrayJsonConfig,
        manualGroup: ImportSourceManualGroup,
        groupIndex: number,
        strategyType: ImportSourceBalancerStrategy = 'random',
        importSourceSettings: ImportSourceXrayJsonRuntimeSettings = DEFAULT_IMPORT_SOURCE_XRAY_JSON_RUNTIME_SETTINGS,
    ): XrayJsonConfig | null {
        return this.buildAutoImportSourceConfig(
            template,
            manualGroup.remarks,
            `lb_import_sources_manual_${manualGroup.tagPart}_${groupIndex}`,
            manualGroup.configs,
            strategyType,
            importSourceSettings,
        );
    }

    private buildImportSourceConfigsForGroup(
        group: ISubscriptionImportSourceGroup,
    ): ImportSourceGroupConfigs | null {
        const tagPrefix = normalizeTagPart(group.name);
        const parsedConfigs: ImportedOutboundConfig[] = [];

        for (const [index, line] of group.rawLines.entries()) {
            const config = this.parseImportSourceLine(line, tagPrefix, index);
            if (!config) continue;

            const configWithSourceContext: ImportedOutboundConfig = {
                ...config,
                geoIpCountryCode: this.getImportSourceGeoIpCountryCode(config),
                sourceGroupName: group.name,
                sourceNames: group.sourceNames,
            };

            if (hasServerData(configWithSourceContext)) {
                parsedConfigs.push(configWithSourceContext);
            }
        }

        const importedConfigs = dedupeImportedConfigs(parsedConfigs);

        if (importedConfigs.length === 0) {
            return null;
        }

        const autoImportedConfigs = importedConfigs.filter(
            (config) => !isRussianImportSourceConfig(config),
        );

        return {
            autoImportedConfigs,
            importedConfigs,
            sourceNames: group.sourceNames,
        };
    }

    private getImportSourceGeoIpCountryCode(config: ImportedOutboundConfig): string | undefined {
        for (const address of getImportSourceEndpointAddresses(config)) {
            const countryCode = this.importSourceGeoIpClassifier.lookupCountryCode(address);
            if (countryCode) return countryCode;
        }

        return undefined;
    }

    private buildAutoImportSourceConfig(
        template: XrayJsonConfig,
        remarks: string,
        balancerTag: string,
        importedConfigs: ImportedOutboundConfig[],
        strategyType: ImportSourceBalancerStrategy = 'random',
        importSourceSettings: ImportSourceXrayJsonRuntimeSettings = DEFAULT_IMPORT_SOURCE_XRAY_JSON_RUNTIME_SETTINGS,
        fallbackSeed = '',
    ): XrayJsonConfig | null {
        if (importedConfigs.length === 0) {
            return null;
        }

        const baseTemplate = { ...template };
        delete baseTemplate.remnawave;
        const importedOutbounds = importedConfigs.map((config) => config.outbound);
        const supportingOutbounds = importedConfigs.flatMap(
            (config) => config.supportingOutbounds ?? [],
        );
        const subjectSelector = importedOutbounds.map((outbound) => outbound.tag);
        const existingRules = Array.isArray(baseTemplate.routing?.rules)
            ? baseTemplate.routing.rules
            : [];
        const templateBalancers = Array.isArray(baseTemplate.routing?.balancers)
            ? baseTemplate.routing.balancers
            : [];
        const existingBalancers = templateBalancers.filter(
            (balancer) => balancer.tag !== balancerTag,
        );
        const existingObservatory = asRecord(baseTemplate.observatory);
        const observatorySubjectSelector = mergeStringLists(
            existingObservatory?.subjectSelector,
            subjectSelector,
        );
        const fallbackTag =
            importSourceSettings.autoFallbackPolicy === 'stableHash' && fallbackSeed
                ? (getStableFallbackTag(importedOutbounds, `${fallbackSeed}:${balancerTag}`) ??
                  importedOutbounds[0]?.tag ??
                  'direct')
                : (importedOutbounds[0]?.tag ?? 'direct');
        const advancedRoutingRules: Record<string, unknown>[] = [];
        let baseOutbounds = baseTemplate.outbounds;

        if (importSourceSettings.directPrivateNetworks) {
            baseOutbounds = ensureOutbound(baseOutbounds, {
                tag: 'direct',
                protocol: 'freedom',
                settings: {},
            });
            advancedRoutingRules.push({
                type: 'field',
                ip: ['geoip:private'],
                outboundTag: 'direct',
            });
        }

        if (importSourceSettings.blockBitTorrent) {
            baseOutbounds = ensureOutbound(baseOutbounds, {
                tag: 'block',
                protocol: 'blackhole',
                settings: {},
            });
            advancedRoutingRules.push({
                type: 'field',
                outboundTag: 'block',
                protocol: ['bittorrent'],
            });
        }

        if (importedOutbounds.length === 1) {
            const singleServerTemplate = { ...baseTemplate };
            const singleServerRouting = { ...(baseTemplate.routing ?? {}) };
            delete singleServerTemplate.observatory;
            delete singleServerRouting.balancers;

            return {
                ...singleServerTemplate,
                remarks,
                outbounds: [...importedOutbounds, ...supportingOutbounds, ...baseOutbounds],
                routing: {
                    ...singleServerRouting,
                    ...(importSourceSettings.routingDomainStrategy && {
                        domainStrategy: importSourceSettings.routingDomainStrategy,
                    }),
                    rules: [
                        ...existingRules,
                        ...advancedRoutingRules,
                        {
                            type: 'field',
                            outboundTag: importedOutbounds[0].tag,
                            inboundTag: ['socks', 'http'],
                            network: 'tcp,udp',
                        },
                    ],
                },
            };
        }

        return {
            ...baseTemplate,
            remarks,
            outbounds: [...importedOutbounds, ...supportingOutbounds, ...baseOutbounds],
            observatory: {
                enableConcurrency: importSourceSettings.observatoryEnableConcurrency,
                probeInterval: importSourceSettings.autoProbeInterval,
                probeUrl: importSourceSettings.autoProbeUrl,
                ...(existingObservatory ?? {}),
                subjectSelector: observatorySubjectSelector,
            },
            routing: {
                ...(baseTemplate.routing ?? {}),
                ...(importSourceSettings.routingDomainStrategy && {
                    domainStrategy: importSourceSettings.routingDomainStrategy,
                }),
                balancers: [
                    ...existingBalancers,
                    {
                        tag: balancerTag,
                        selector: subjectSelector,
                        strategy: {
                            type: strategyType,
                        },
                        fallbackTag,
                    },
                ],
                rules: [
                    ...existingRules,
                    ...advancedRoutingRules,
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
        const positionalTag = `${tagPrefix}-${index}`;
        const positionalRemarks = fallbackRemarks ?? `${tagPrefix}-${index + 1}`;
        let config: ImportedOutboundConfig | null = null;

        if (line.startsWith(XRAY_JSON_IMPORT_PROTOCOL)) {
            config = this.parseXrayJsonImportLine(line, positionalTag, positionalRemarks);

            return config ? this.withStableImportSourceTags(tagPrefix, config) : null;
        }

        const schemeSeparatorIndex = line.indexOf('://');
        if (schemeSeparatorIndex === -1) {
            return null;
        }

        const scheme = line.slice(0, schemeSeparatorIndex).toLowerCase();

        switch (scheme) {
            case 'vless':
                config = this.parseVlessOrTrojanImportLine(
                    line,
                    'vless',
                    positionalTag,
                    positionalRemarks,
                );
                break;
            case 'vmess':
                config = this.parseVmessImportLine(line, positionalTag, positionalRemarks);
                break;
            case 'trojan':
                config = this.parseVlessOrTrojanImportLine(
                    line,
                    'trojan',
                    positionalTag,
                    positionalRemarks,
                );
                break;
            case 'ss':
            case 'shadowsocks':
                config = this.parseShadowsocksImportLine(line, positionalTag, positionalRemarks);
                break;
            default:
                return null;
        }

        return config ? this.withStableImportSourceTags(tagPrefix, config) : null;
    }

    private withStableImportSourceTags(
        tagPrefix: string,
        config: ImportedOutboundConfig,
    ): ImportedOutboundConfig {
        const tag = getStableImportSourceTag(tagPrefix, config);

        if (!config.supportingOutbounds?.length) {
            return {
                ...config,
                outbound: {
                    ...config.outbound,
                    tag,
                },
            };
        }

        const tagByOriginalTag = new Map<string, string>();
        for (const [supportIndex, supportingOutbound] of config.supportingOutbounds.entries()) {
            if (!supportingOutbound.tag) continue;

            tagByOriginalTag.set(
                supportingOutbound.tag,
                getStableSupportingOutboundTag(tag, supportingOutbound, supportIndex),
            );
        }

        return {
            ...config,
            outbound: {
                ...rewriteDialerProxyTag(config.outbound, tagByOriginalTag),
                tag,
            },
            supportingOutbounds: config.supportingOutbounds.map((supportingOutbound) => {
                const rewritten = rewriteDialerProxyTag(supportingOutbound, tagByOriginalTag);
                rewritten.tag =
                    tagByOriginalTag.get(supportingOutbound.tag) ??
                    getStableSupportingOutboundTag(tag, supportingOutbound, 0);

                return rewritten;
            }),
        };
    }

    private buildSupportingOutboundsForXrayJsonImport(
        supportingOutbounds: Outbound[] | undefined,
        tag: string,
    ): {
        supportingOutbounds: Outbound[];
        tagByOriginalTag: Map<string, string>;
    } {
        const tagByOriginalTag = new Map<string, string>();

        for (const [supportIndex, supportingOutbound] of (supportingOutbounds ?? []).entries()) {
            if (!supportingOutbound.tag) continue;

            tagByOriginalTag.set(
                supportingOutbound.tag,
                `${tag}-support-${normalizeTagPart(supportingOutbound.tag)}-${supportIndex}`,
            );
        }

        return {
            tagByOriginalTag,
            supportingOutbounds: (supportingOutbounds ?? []).map((supportingOutbound) => {
                const rewritten = rewriteDialerProxyTag(supportingOutbound, tagByOriginalTag);
                rewritten.tag = tagByOriginalTag.get(supportingOutbound.tag) ?? `${tag}-support`;

                return rewritten;
            }),
        };
    }

    private parseXrayJsonImportLine(
        line: string,
        tag: string,
        fallbackRemarks?: string,
    ): ImportedOutboundConfig | null {
        try {
            const encoded = line.slice(XRAY_JSON_IMPORT_PROTOCOL.length);
            const payload = JSON.parse(decodeBase64Url(encoded)) as unknown;
            if (!isXrayJsonImportPayload(payload)) return null;

            const { supportingOutbounds, tagByOriginalTag } =
                this.buildSupportingOutboundsForXrayJsonImport(payload.supportingOutbounds, tag);

            return {
                remarks: payload.remarks || fallbackRemarks || tag,
                outbound: {
                    ...rewriteDialerProxyTag(payload.outbound, tagByOriginalTag),
                    tag,
                },
                supportingOutbounds,
            };
        } catch {
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
        const grpcServiceName = getNonEmptyParam(params, 'serviceName');
        const grpcAuthority =
            getNonEmptyParam(params, 'authority') ?? getNonEmptyParam(params, 'host');

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
                        ...(grpcServiceName ? { serviceName: grpcServiceName } : {}),
                        ...(grpcAuthority ? { authority: grpcAuthority } : {}),
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
