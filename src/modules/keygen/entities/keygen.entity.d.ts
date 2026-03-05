import { Keygen } from '@prisma/client';
export declare class KeygenEntity implements Keygen {
    uuid: string;
    privKey: string;
    pubKey: string;
    caCert: string | null;
    caKey: string | null;
    clientCert: string | null;
    clientKey: string | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(keygen: Partial<Keygen>);
}
