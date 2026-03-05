import { HashedSet } from '@remnawave/hashed-set';
import { UserForConfigEntity } from '@modules/users/entities/users-for-config';
import { InboundObject as Inbound, IXrayConfig, TCtrXRayConfig } from './interfaces';
interface InboundsWithTagsAndType {
    tag: string;
    type: string;
    network: string | null;
    security: string | null;
    port: number | null;
    rawInbound: object | null;
}
export declare class XRayConfig {
    private config;
    private inbounds;
    private inboundsByProtocol;
    private inboundsByTag;
    private readonly CONFIG_KEY_ORDER;
    constructor(configInput: TCtrXRayConfig);
    private prevValidateConfig;
    private validate;
    private resolveInbounds;
    static getXrayConfigInstance(config: TCtrXRayConfig): XRayConfig;
    getInbound(tag: string): Inbound | undefined;
    excludeInbounds(tags: string[]): void;
    leaveInbounds(tags: Set<string>): void;
    private getInbounds;
    getConfig(): IXrayConfig;
    private getInboundByProtocol;
    private toJSON;
    private sortObjectByKeys;
    processCertificates(): IXrayConfig;
    getConfigHash(): string;
    getAllInbounds(): InboundsWithTagsAndType[];
    cleanClients(): void;
    fixIncorrectServerNames(): void;
    getSortedConfig(): IXrayConfig;
    private getPort;
    cleanInboundClients(): void;
    private addUsersToInbound;
    includeUserBatch(users: UserForConfigEntity[], inboundsUserSets: Map<string, HashedSet>): IXrayConfig;
    resolveInboundAndPublicKey(): Promise<Map<string, string>>;
    private createX25519KeyPairFromBase64;
    private isInboundWithUsers;
    replaceSnippets(snippets: Map<string, unknown>): void;
    private replaceSnippetsInArray;
}
export {};
