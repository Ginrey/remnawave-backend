export const METRIC_NAMES = {
    NODE_ONLINE_USERS: 'node_online_users',
    NODE_STATUS: 'node_status',
    USERS_STATUS: 'users_status',
    USERS_ONLINE_STATS: 'users_online_stats',
    USERS_TOTAL: 'users_total',
    NODE_INBOUND_UPLOAD_BYTES: 'node_inbound_upload_bytes',
    NODE_INBOUND_DOWNLOAD_BYTES: 'node_inbound_download_bytes',
    NODE_OUTBOUND_UPLOAD_BYTES: 'node_outbound_upload_bytes',
    NODE_OUTBOUND_DOWNLOAD_BYTES: 'node_outbound_download_bytes',
<<<<<<< HEAD
    NODEJS_HEAP_USED_BYTES: 'nodejs_heap_used_bytes',
    NODEJS_HEAP_TOTAL_BYTES: 'nodejs_heap_total_bytes',
    NODEJS_HEAP_USAGE_PERCENT: 'nodejs_heap_usage_percent',
    NODEJS_ACTIVE_HANDLERS: 'nodejs_active_handlers',
    NODEJS_ACTIVE_REQUESTS: 'nodejs_active_requests',
    NODEJS_CPU_USAGE_PERCENT: 'nodejs_cpu_usage_percent',
    NODEJS_MEMORY_USAGE_BYTES: 'nodejs_memory_usage_bytes',
    NODEJS_EVENT_LOOP_LATENCY_P50: 'nodejs_event_loop_latency_p50',
    NODEJS_EVENT_LOOP_LATENCY_P95: 'nodejs_event_loop_latency_p95',
    NODEJS_HTTP_REQ_RATE: 'nodejs_http_req_rate',
    NODEJS_HTTP_REQ_LATENCY_P95: 'nodejs_http_req_latency_p95',
    NODEJS_HTTP_REQ_LATENCY_P50: 'nodejs_http_req_latency_p50',
=======

    // Memory
    PROCESS_RSS_BYTES: 'process_rss_bytes',
    PROCESS_HEAP_USED_BYTES: 'process_heap_used_bytes',
    PROCESS_HEAP_TOTAL_BYTES: 'process_heap_total_bytes',
    PROCESS_EXTERNAL_BYTES: 'process_external_bytes',
    PROCESS_ARRAY_BUFFERS_BYTES: 'process_array_buffers_bytes',

    // Event loop
    PROCESS_EVENT_LOOP_DELAY_MS: 'process_event_loop_delay_ms',
    PROCESS_EVENT_LOOP_P99_MS: 'process_event_loop_p99_ms',

    // Resources
    PROCESS_ACTIVE_HANDLES: 'process_active_handles',

    // General
    PROCESS_UPTIME_SECONDS: 'process_uptime_seconds',

    // Node system
    NODE_NETWORK_RX_BYTES_PER_SEC: 'node_network_rx_bytes_per_sec',
    NODE_NETWORK_TX_BYTES_PER_SEC: 'node_network_tx_bytes_per_sec',
    NODE_NETWORK_RX_BYTES_TOTAL: 'node_network_rx_bytes_total',
    NODE_NETWORK_TX_BYTES_TOTAL: 'node_network_tx_bytes_total',
    NODE_MEMORY_TOTAL_BYTES: 'node_memory_total_bytes',
    NODE_MEMORY_FREE_BYTES: 'node_memory_free_bytes',
    NODE_UPTIME_SECONDS: 'node_uptime_seconds',
    NODE_CPU_COUNT: 'node_cpu_count',

    NODE_BASIC_INFO: 'node_basic_info',
    NODE_SYSTEM_INFO: 'node_system_info',
>>>>>>> upstream/main
} as const;

export type TMetricNames = typeof METRIC_NAMES;
export type TMetricNamesKeys = (typeof METRIC_NAMES)[keyof typeof METRIC_NAMES];
