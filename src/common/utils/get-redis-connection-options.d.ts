export declare function getRedisConnectionOptions(socket: string | undefined, host: string | undefined, port: number | undefined, format: 'ioredis'): {
    path: string;
} | {
    host: string;
    port: number;
};
export declare function getRedisConnectionOptions(socket: string | undefined, host: string | undefined, port: number | undefined, format: 'node-redis'): {
    socket: {
        path: string;
        tls: boolean;
    };
} | {
    url: string;
};
