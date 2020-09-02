const initialState: any = {
	form: {
		hostname: '127.0.0.1',
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
		testChain: false,
		recordingContextActions: true,
		sandboxContextPatching: './light_node/etc/tezedge_sandbox/sandbox-patch-context.json',

		// TODO - add form fields for these properties
		identityExpectedPow: 26.0,
		tezosDataDir: '/tmp/tezedge',
		identityFile: './light_node/etc/tezedge/identity.json',
		tokioThreads: 0
	},
};

export function reducer(state = initialState, action) {
	switch (action.type) {
		default:
			return state;
	}
}
