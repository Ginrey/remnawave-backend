export declare function generateMasterCerts(): Promise<{
    caCertPem: string;
    caKeyPem: string;
    clientCertPem: string;
    clientKeyPem: string;
}>;
export declare function generateNodeCert(caCertPem: string, caKeyPem: string): Promise<{
    nodeCertPem: string;
    nodeKeyPem: string;
    caCertPem: string;
}>;
export declare function generateJwtKeypair(): Promise<{
    publicKey: string;
    privateKey: string;
}>;
