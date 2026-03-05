export declare function resolveInboundAndPublicKey(inbounds: any[]): Promise<Map<string, string>>;
export declare function resolveInboundAndMlDsa65PublicKey(inbounds: any[]): Promise<Map<string, string>>;
export declare function resolveEncryptionFromDecryption(inbounds: any[]): Promise<Map<string, string>>;
export declare function getMlDsa65PublicKey(seed: string): string | null;
