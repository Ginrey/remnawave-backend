import type { TRemnawaveInjector } from '@libs/contracts/models';

import { ISubscriptionImportSourceGroup } from '@modules/subscription-import-sources/interfaces/import-source-group.interface';
import { ResolvedProxyConfig } from '@modules/subscription-template/resolve-proxy/interfaces';

export interface StreamSettings {
    network: string;
    security?: string;
    wsSettings?: unknown;
    tcpSettings?: unknown;
    rawSettings?: unknown;
    xhttpSettings?: unknown;
    tlsSettings?: unknown;
    httpupgradeSettings?: unknown;
    realitySettings?: unknown;
    grpcSettings?: unknown;
    sockopt?: unknown;
    kcpSettings?: unknown;
    finalmask?: unknown;
}

export interface OutboundSettings {
    vnext?: Array<{
        address: string;
        port: number;
        users: Array<{
            id: string;
            security?: string;
            encryption?: string;
            flow?: string;
            alterId?: number;
            email?: string;
        }>;
    }>;
    servers?: Array<{
        address: string;
        port: number;
        password?: string;
        email?: string;
        method?: string;
        uot?: boolean;
        ivCheck?: boolean;
    }>;
}

export interface Outbound {
    tag: string;
    protocol: string;
    settings: OutboundSettings;
    streamSettings?: StreamSettings;
    mux?: unknown;
}

export interface XrayJsonConfig {
    remarks: string;
    outbounds: Outbound[];
    dns?: Record<string, unknown>;
    inbounds?: Record<string, unknown>[];
    routing?: Record<string, unknown> & {
        rules?: Record<string, unknown>[];
        balancers?: Record<string, unknown>[];
    };
    observatory?: Record<string, unknown> & {
        subjectSelector?: string[];
    };
    meta?: {
        serverDescription?: string;
    };
    remnawave?: TRemnawaveInjector;
    [key: string]: unknown;
}

export interface IGenerateConfigParams {
    hosts: ResolvedProxyConfig[];
    isExtendedClient: boolean;
    overrideTemplateName?: string;
    ignoreHostXrayJsonTemplate?: boolean;
    extraImportSourceGroups?: ISubscriptionImportSourceGroup[];
}
