const initialState: any = {
    chainServer: {},
    chainConfig: {},
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'CHAIN_SERVER_FORM_SUBMIT': {
            return {
                ...state,
                chainServer: mapChainServerData(action.payload)
            }
        }
        case 'CHAIN_CONFIG_FORM_SUBMIT': {
            return {
                ...state,
                chainConfig: mapChainConfigData(action.payload)
            }
        }
        default:
            return state;
    }
}

export function mapChainServerData(formData: any){
    return {
        identity_expected_pow: 0, // TODO - what is this?
        disable_bootstrap_lookup: formData.disableBootstrapDnsLookup, 
        network: formData.network, 
        peer_thresh_low: formData.lowerPeerTreshold, 
        peer_thresh_high: formData.higherPeerTreshold, 
        sandbox_patch_context_json_file: formData.sandboxContextPatching, 
        protocol_runner: formData.protocolRunner, 
        tezos_data_dir: '/tmp/tezedge_developer/tezos-node', // TODO - what is this?
        identity_file: '/tmp/sandbox/light-node/identity.json', // TODO - what is this?
        bootstrap_db_path: formData.bootstrapDbPath, 
        db_cfg_max_threads: formData.maxThreads, 
        log_format: formData.loggingFormat, 
        log_level: formData.loggingLevel, 
        ocaml_log_enabled: formData.oCamlLogging, 
        p2p_port: formData.p2pPort, 
        rpc_port: formData.rpcPort, 
        monitor_port: formData.monitorPort, 
        websocket_address: formData.webSocketAddress, 
        ffi_calls_gc_threshold: formData.ffiCallsNo, 
        ffi_pool_max_connections: formData.ffiMaxConn, 
        ffi_pool_connection_timeout_in_secs: formData.ffiConnTimeout, 
        ffi_pool_max_lifetime_in_secs: formData.ffiPoolLifetime, 
        ffi_pool_idle_timeout_in_secs: formData.ffiPoolUnusedTimeout, 
        store_context_actions: formData.recordingContextActions, 
        tokio_threads: formData.maxThreads, 
        enable_testchain: formData.testChain, 
    }
}

export function mapChainConfigData(formData: any){
    // TODO - map
    return formData;
}