export interface ShadowsocksSettings {
    clients: ShadowsocksUser[];
}
export interface ShadowsocksUser extends UserObject {
    method: string;
    password: string;
    id: string;
}
export interface TrojanFallback {
    alpn?: string;
    dest?: number | string;
    path?: string;
    xver?: number;
}
export interface TrojanSettings {
    clients: TrojanUser[];
    fallbacks?: TrojanFallback[];
}
export interface TrojanUser extends UserObject {
    flow?: string;
    password: string;
    id: string;
}
export interface UserObject {
    email?: string;
    level?: number;
}
export interface VLessFallback {
    alpn?: string;
    dest?: number | string;
    path?: string;
    xver?: number;
}
export interface VLessSettings {
    clients: VLessUser[];
    decryption: 'none' | string;
    fallbacks?: VLessFallback[];
    flow?: 'xtls-rprx-vision' | '' | 'none';
}
export interface VLessUser extends UserObject {
    encryption?: string;
    flow?: 'xtls-rprx-vision' | '';
    id: string;
}
