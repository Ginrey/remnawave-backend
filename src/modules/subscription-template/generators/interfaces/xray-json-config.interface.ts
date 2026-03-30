import type { TRemnawaveInjector } from '@libs/contracts/models';

<<<<<<< HEAD
import { IFormattedHost } from './formatted-hosts.interface';
=======
import { ResolvedProxyConfig } from '@modules/subscription-template/resolve-proxy/interfaces';
>>>>>>> upstream/main

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
<<<<<<< HEAD
=======
    kcpSettings?: unknown;
    finalmask?: unknown;
>>>>>>> upstream/main
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
    meta?: {
        serverDescription?: string;
    };
    remnawave?: TRemnawaveInjector;
}

export interface IGenerateConfigParams {
<<<<<<< HEAD
    hosts: IFormattedHost[];
    isHapp: boolean;
=======
    hosts: ResolvedProxyConfig[];
    isExtendedClient: boolean;
>>>>>>> upstream/main
    overrideTemplateName?: string;
    ignoreHostXrayJsonTemplate?: boolean;
}
