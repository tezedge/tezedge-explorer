const initialState: any = {
	form: {
		hostname: '127.0.0.1',
		tezosDataDir: '/tmp/tezedge',
		identityFile: './light_node/etc/tezedge/identity.json',
		identityExpectedPow: 26.0,
		bootstrapDbPath: '/tmp/tezedge',
		maxThreads: 0,
		loggingFile: '/tmp/tezedge/tezedge.log',
		loggingFormat: 'simple',
		loggingLevel: 'info',
		oCamlLogging: false,
		network: 'carthagenet',
		p2pPort: 9732,
		rpcPort: 18732,
		webSocketAddress: '0.0.0.0:4927',
		monitorPort: 3030,
		lowerPeerTreshold: 10,
		higherPeerTreshold: 15,
		peers: '',
		disableBootstrapDnsLookup: false,
		bootstrapLookupAddresses: '',
		protocolRunner: './target/release/protocol-runner',
		ffiCallsNo: 50,
		ffiMaxConn: 10,
		ffiConnTimeout: 60,
		ffiPoolLifetime: 21600,
		ffiPoolUnusedTimeout: 1800,
		mempool: true,
		privateNodeMode: false,
		tokioThreads: 0,
		testChain: false,
		recordingContextActions: true,
		sandboxContextPatching: './light_node/etc/tezedge_sandbox/sandbox-patch-context.json',
	},
	error: {
		type: null,
		field_name: null,
		message: null,
		isShown: false
	}
};

export function reducer(state = initialState, action) {
	switch (action.type) {
		case 'CHAIN_SERVER_FORM_SUBMIT_ERROR': {
			return {
					...state,
					error: mapError(action.payload.error)
			}
		}
		case 'CHAIN_SERVER_FORM_ERROR_SHOWN': {
			return {
					...state,
					error: {
						...state.error,
						isShown: true
					}
			}
		}
		default:
			return state;
	}
}

export function mapError(serverError: any) {
	//if(error.type === 'validation'){
		return {
			...serverError,
			field_name: mapFieldName(serverError.field_name),
			isShown: false
		}
	// } else {
	// 	return error;
	// }
}

// Maps field_name from error into form field name
export function mapFieldName(field_name: string){
	field_name = field_name.replace(/-/g, '_');

	// define field name mappings
	const chainServerFieldNameMappings = {
		identity_expected_pow: 'identityExpectedPow',
		disable_bootstrap_lookup: 'disableBootstrapDnsLookup',
		bootstrap_lookup_address: 'bootstrapLookupAddresses',
		disable_mempool: 'mempool',
		network: 'network', 
		peer_thresh_low: 'lowerPeerTreshold', 
		peer_thresh_high: 'higherPeerTreshold', 
		sandbox_patch_context_json_file: 'sandboxContextPatching', 
		protocol_runner: 'protocolRunner', 
		tezos_data_dir: 'tezosDataDir',
		identity_file: 'identityFile',
		bootstrap_db_path: 'bootstrapDbPath', 
		db_cfg_max_threads: 'maxThreads',
		log_file: 'loggingFile',
		log_format: 'loggingFormat', 
		log_level: 'loggingLevel', 
		ocaml_log_enabled: 'oCamlLogging', 
		p2p_port: 'p2pPort', 
		rpc_port: 'rpcPort', 
		monitor_port: 'monitorPort', 
		peers: 'peers',
		websocket_address: 'webSocketAddress',
		private_node: 'privateNodeMode', 
		ffi_calls_gc_threshold: 'ffiCallsNo', 
		ffi_pool_max_connections: 'ffiMaxConn', 
		ffi_pool_connection_timeout_in_secs: 'ffiConnTimeout', 
		ffi_pool_max_lifetime_in_secs: 'ffiPoolLifetime', 
		ffi_pool_idle_timeout_in_secs: 'ffiPoolUnusedTimeout', 
		store_context_actions: 'recordingContextActions', 
		tokio_threads: 'tokioThreads',
		enable_testchain: 'testChain', 
	};

	// return correct mapping for passed field_name
	return chainServerFieldNameMappings[field_name];
}