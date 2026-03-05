declare enum KeyType {
    MLKEM768 = "mlkem768",
    X25519 = "x25519"
}
interface IKeyWithType {
    type: KeyType;
    value: string;
}
interface IDecryptionParsed {
    protocol: string;
    mode: string;
    ticketLifetime: string;
    padding?: string;
    keys: IKeyWithType[];
}
interface IPublicKeyWithType {
    type: KeyType;
    value: string;
}
interface IEncryptionGenerated {
    encryption: string;
    publicKeys: IPublicKeyWithType[];
}
export declare function parseDecryption(decryption: string): IDecryptionParsed;
export declare function generateX25519PublicKey(privateKeyBase64: string): Promise<string>;
export declare function generateMlkem768PublicKey(seedBase64: string): string;
export declare function generateEncryptionFromDecryption(decryption: string): Promise<IEncryptionGenerated>;
export {};
