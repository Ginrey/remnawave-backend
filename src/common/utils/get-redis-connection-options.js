"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConnectionOptions = getRedisConnectionOptions;
function getRedisConnectionOptions(socket, host, port, format) {
    switch (format) {
        case 'ioredis':
            if (socket !== undefined && socket !== '') {
                return { path: socket };
            }
            else if (host !== undefined && port !== undefined) {
                return { host, port };
            }
            else {
                throw new Error('Either socket or host and port must be provided');
            }
        case 'node-redis':
            if (socket !== undefined && socket !== '') {
                return { socket: { path: socket, tls: false } };
            }
            else if (host !== undefined && port !== undefined) {
                return { url: `redis://${host}:${port}` };
            }
            else {
                throw new Error('Either socket or host and port must be provided');
            }
        default:
            throw new Error('Invalid format');
    }
}
//# sourceMappingURL=get-redis-connection-options.js.map