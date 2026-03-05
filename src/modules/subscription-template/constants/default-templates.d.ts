export declare const DEFAULT_TEMPLATE_MIHOMO = "mixed-port: 7890\nsocks-port: 7891\nredir-port: 7892\nallow-lan: true\nmode: global\nlog-level: info\nexternal-controller: 127.0.0.1:9090\ndns:\n  enable: true\n  use-hosts: true\n  enhanced-mode: fake-ip\n  fake-ip-range: 198.18.0.1/16\n  default-nameserver:\n    - 1.1.1.1\n    - 8.8.8.8\n  nameserver:\n    - 1.1.1.1\n    - 8.8.8.8\n  fake-ip-filter:\n    - '*.lan'\n    - stun.*.*.*\n    - stun.*.*\n    - time.windows.com\n    - time.nist.gov\n    - time.apple.com\n    - time.asia.apple.com\n    - '*.openwrt.pool.ntp.org'\n    - pool.ntp.org\n    - ntp.ubuntu.com\n    - time1.apple.com\n    - time2.apple.com\n    - time3.apple.com\n    - time4.apple.com\n    - time5.apple.com\n    - time6.apple.com\n    - time7.apple.com\n    - time1.google.com\n    - time2.google.com\n    - time3.google.com\n    - time4.google.com\n    - api.joox.com\n    - joox.com\n    - '*.xiami.com'\n    - '*.msftconnecttest.com'\n    - '*.msftncsi.com'\n    - '+.xboxlive.com'\n    - '*.*.stun.playstation.net'\n    - xbox.*.*.microsoft.com\n    - '*.ipv6.microsoft.com'\n    - speedtest.cros.wr.pvp.net\n\nproxies: # LEAVE THIS LINE!\n\nproxy-groups:\n  - name: '\u2192 Remnawave'\n    type: 'select'\n    proxies: # LEAVE THIS LINE!\n\nrules:\n  - MATCH,\u2192 Remnawave\n";
export declare const DEFAULT_TEMPLATE_STASH = "proxy-groups:\n  - name: \u2192 Remnawave\n    type: select\n    proxies: # LEAVE THIS LINE!\n\nproxies: # LEAVE THIS LINE!\n\nrules:\n  - SCRIPT,quic,REJECT\n  - DOMAIN-SUFFIX,iphone-ld.apple.com,DIRECT\n  - DOMAIN-SUFFIX,lcdn-locator.apple.com,DIRECT\n  - DOMAIN-SUFFIX,lcdn-registration.apple.com,DIRECT\n  - DOMAIN-SUFFIX,push.apple.com,DIRECT\n  - PROCESS-NAME,v2ray,DIRECT\n  - PROCESS-NAME,Surge,DIRECT\n  - PROCESS-NAME,ss-local,DIRECT\n  - PROCESS-NAME,privoxy,DIRECT\n  - PROCESS-NAME,trojan,DIRECT\n  - PROCESS-NAME,trojan-go,DIRECT\n  - PROCESS-NAME,naive,DIRECT\n  - PROCESS-NAME,CloudflareWARP,DIRECT\n  - PROCESS-NAME,Cloudflare WARP,DIRECT\n  - IP-CIDR,162.159.193.0/24,DIRECT,no-resolve\n  - PROCESS-NAME,p4pclient,DIRECT\n  - PROCESS-NAME,Thunder,DIRECT\n  - PROCESS-NAME,DownloadService,DIRECT\n  - PROCESS-NAME,qbittorrent,DIRECT\n  - PROCESS-NAME,Transmission,DIRECT\n  - PROCESS-NAME,fdm,DIRECT\n  - PROCESS-NAME,aria2c,DIRECT\n  - PROCESS-NAME,Folx,DIRECT\n  - PROCESS-NAME,NetTransport,DIRECT\n  - PROCESS-NAME,uTorrent,DIRECT\n  - PROCESS-NAME,WebTorrent,DIRECT\n  - GEOIP,LAN,DIRECT\n  - MATCH,\u2192 Remnawave\nscript:\n  shortcuts:\n    quic: network == 'udp' and dst_port == 443\ndns:\n  default-nameserver:\n    - 1.1.1.1\n    - 1.0.0.1\n  nameserver:\n    - 1.1.1.1\n    - 1.0.0.1\nlog-level: warning\nmode: rule\n\n";
export declare const DEFAULT_TEMPLATE_CLASH = "mixed-port: 7890\nsocks-port: 7891\nredir-port: 7892\nallow-lan: true\nmode: global\nlog-level: info\nexternal-controller: 127.0.0.1:9090\ndns:\n  enable: true\n  use-hosts: true\n  enhanced-mode: fake-ip\n  fake-ip-range: 198.18.0.1/16\n  default-nameserver:\n    - 1.1.1.1\n    - 8.8.8.8\n  nameserver:\n    - 1.1.1.1\n    - 8.8.8.8\n  fake-ip-filter:\n    - '*.lan'\n    - stun.*.*.*\n    - stun.*.*\n    - time.windows.com\n    - time.nist.gov\n    - time.apple.com\n    - time.asia.apple.com\n    - '*.openwrt.pool.ntp.org'\n    - pool.ntp.org\n    - ntp.ubuntu.com\n    - time1.apple.com\n    - time2.apple.com\n    - time3.apple.com\n    - time4.apple.com\n    - time5.apple.com\n    - time6.apple.com\n    - time7.apple.com\n    - time1.google.com\n    - time2.google.com\n    - time3.google.com\n    - time4.google.com\n    - api.joox.com\n    - joox.com\n    - '*.xiami.com'\n    - '*.msftconnecttest.com'\n    - '*.msftncsi.com'\n    - '+.xboxlive.com'\n    - '*.*.stun.playstation.net'\n    - xbox.*.*.microsoft.com\n    - '*.ipv6.microsoft.com'\n    - speedtest.cros.wr.pvp.net\n\nproxies: # LEAVE THIS LINE!\n\nproxy-groups:\n  - name: '\u2192 Remnawave'\n    type: 'select'\n    proxies: # LEAVE THIS LINE!\n\nrules:\n  - MATCH,\u2192 Remnawave";
export declare const DEFAULT_TEMPLATE_SINGBOX: {
    log: {
        disabled: boolean;
        level: string;
        timestamp: boolean;
    };
    dns: {
        servers: ({
            tag: string;
            address: string;
            address_strategy?: undefined;
            strategy?: undefined;
            detour?: undefined;
        } | {
            tag: string;
            address: string;
            address_strategy: string;
            strategy: string;
            detour: string;
        })[];
        rules: ({
            query_type: string[];
            server: string;
            outbound?: undefined;
        } | {
            outbound: string;
            server: string;
            query_type?: undefined;
        })[];
        fakeip: {
            enabled: boolean;
            inet4_range: string;
            inet6_range: string;
        };
        independent_cache: boolean;
    };
    inbounds: ({
        type: string;
        mtu: number;
        interface_name: string;
        tag: string;
        inet4_address: string;
        inet6_address: string;
        auto_route: boolean;
        strict_route: boolean;
        endpoint_independent_nat: boolean;
        stack: string;
        sniff: boolean;
        platform: {
            http_proxy: {
                enabled: boolean;
                server: string;
                server_port: number;
            };
        };
        listen?: undefined;
        listen_port?: undefined;
        users?: undefined;
        set_system_proxy?: undefined;
    } | {
        type: string;
        tag: string;
        listen: string;
        listen_port: number;
        sniff: boolean;
        users: never[];
        set_system_proxy: boolean;
        mtu?: undefined;
        interface_name?: undefined;
        inet4_address?: undefined;
        inet6_address?: undefined;
        auto_route?: undefined;
        strict_route?: undefined;
        endpoint_independent_nat?: undefined;
        stack?: undefined;
        platform?: undefined;
    })[];
    outbounds: ({
        type: string;
        tag: string;
        interrupt_exist_connections: boolean;
        outbounds: null;
    } | {
        type: string;
        tag: string;
        interrupt_exist_connections?: undefined;
        outbounds?: undefined;
    })[];
    route: {
        rules: ({
            action: string;
            type?: undefined;
            mode?: undefined;
            rules?: undefined;
            ip_is_private?: undefined;
            outbound?: undefined;
        } | {
            type: string;
            mode: string;
            rules: ({
                protocol: string;
                port?: undefined;
            } | {
                port: number;
                protocol?: undefined;
            })[];
            action: string;
            ip_is_private?: undefined;
            outbound?: undefined;
        } | {
            ip_is_private: boolean;
            outbound: string;
            action?: undefined;
            type?: undefined;
            mode?: undefined;
            rules?: undefined;
        })[];
        auto_detect_interface: boolean;
        override_android_vpn: boolean;
    };
    experimental: {
        clash_api: {
            external_controller: string;
            external_ui: string;
            external_ui_download_url: string;
            external_ui_download_detour: string;
            default_mode: string;
        };
        cache_file: {
            enabled: boolean;
            path: string;
            cache_id: string;
            store_fakeip: boolean;
        };
    };
};
export declare const DEFAULT_TEMPLATE_XRAY_JSON: {
    dns: {
        servers: string[];
        queryStrategy: string;
    };
    routing: {
        rules: {
            type: string;
            protocol: string[];
            outboundTag: string;
        }[];
        domainMatcher: string;
        domainStrategy: string;
    };
    inbounds: ({
        tag: string;
        port: number;
        listen: string;
        protocol: string;
        settings: {
            udp: boolean;
            auth: string;
            allowTransparent?: undefined;
        };
        sniffing: {
            enabled: boolean;
            routeOnly: boolean;
            destOverride: string[];
        };
    } | {
        tag: string;
        port: number;
        listen: string;
        protocol: string;
        settings: {
            allowTransparent: boolean;
            udp?: undefined;
            auth?: undefined;
        };
        sniffing: {
            enabled: boolean;
            routeOnly: boolean;
            destOverride: string[];
        };
    })[];
    outbounds: {
        tag: string;
        protocol: string;
    }[];
};
