const initialState: any = {
	form: {
		hostname: '127.0.0.1',
		tezosDataDir: '/tmp/tezedge/tezos-data',
		identityFile: '/tmp/tezedge/identity.json',
		identityExpectedPow: 0,
		bootstrapDbPath: '/tmp/tezedge/light-node',
		maxThreads: 0,
		// loggingFile: '/tmp/tezedge/tezedge.log',
		loggingFormat: 'simple',
		loggingLevel: 'info',
		oCamlLogging: false,
		network: 'sandbox',
		p2pPort: 9732,
		rpcPort: 18732,
		webSocketAddress: '0.0.0.0:4927',
		lowerPeerTreshold: 10,
		higherPeerTreshold: 15,
		peers: '',
		disableBootstrapDnsLookup: false,
		bootstrapLookupAddresses: '',
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
		sandboxContextPatching: '{ \"genesis_pubkey\": \"edpkuSLWfVU1Vq7Jg9FucPyKmma6otcMHac9zG4oU1KMHSTBpJuGQ2\" }',
	},
	error: {
		error_type: null,
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
	if(serverError.error_type === 'validation'){
		return {
			...serverError,
			field_name: mapFieldName(serverError.field_name),
			isShown: false
		}
	} else {
		return serverError;
	}
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
		sandbox_patch_context_json: 'sandboxContextPatching',
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
