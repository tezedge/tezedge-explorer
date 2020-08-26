import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-chain-server',
	templateUrl: './chain-server.component.html',
	styleUrls: ['./chain-server.component.scss'],
})
export class ChainServerComponent implements OnInit {
	chainServer;
	formDefaults: any;

	constructor(private store: Store<any>, private fb: FormBuilder) {}

	ngOnInit(): void {
		// TODO: fetch real defaults here
		this.formDefaults = {
			hostname: '127.0.0.1',
			bootstrapDbPath: '/tmp/tezedge',
			maxThreads: 0,
			maxOpenFiles: 512,
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
		};

		// create form group
		this.chainServer = this.fb.group({
			hostname: [this.formDefaults.hostname, [Validators.required]],
			bootstrapDbPath: [this.formDefaults.bootstrapDbPath, [Validators.required]],
			maxThreads: [this.formDefaults.maxThreads],
			maxOpenFiles: [this.formDefaults.maxOpenFiles],
			loggingFile: [this.formDefaults.loggingFile],
			loggingFormat: [this.formDefaults.loggingFormat, [Validators.required]],
			loggingLevel: [this.formDefaults.loggingLevel, [Validators.required]],
			oCamlLogging: [this.formDefaults.oCamlLogging, [Validators.required]],
			network: [this.formDefaults.network, [Validators.required]],
			p2pPort: [this.formDefaults.p2pPort, [Validators.required]],
			rpcPort: [this.formDefaults.rpcPort, [Validators.required]],
			webSocketAddress: [this.formDefaults.webSocketAddress, [Validators.required]],
			monitorPort: [this.formDefaults.monitorPort, [Validators.required]],
			lowerPeerTreshold: [this.formDefaults.lowerPeerTreshold, [Validators.required]],
			higherPeerTreshold: [this.formDefaults.higherPeerTreshold, [Validators.required]],
			peers: [this.formDefaults.peers],
			disableBootstrapDnsLookup: [this.formDefaults.disableBootstrapDnsLookup, [Validators.required]],
			bootstrapLookupAddresses: [this.formDefaults.bootstrapLookupAddresses],
			protocolRunner: [this.formDefaults.protocolRunner, [Validators.required]],
			ffiCallsNo: [this.formDefaults.ffiCallsNo, [Validators.required]],
			ffiMaxConn: [this.formDefaults.ffiMaxConn, [Validators.required]],
			ffiConnTimeout: [this.formDefaults.ffiConnTimeout, [Validators.required]],
			ffiPoolLifetime: [this.formDefaults.ffiPoolLifetime, [Validators.required]],
			ffiPoolUnusedTimeout: [this.formDefaults.ffiPoolUnusedTimeout, [Validators.required]],
			mempool: [this.formDefaults.mempool, [Validators.required]],
			privateNodeMode: [this.formDefaults.privateNodeMode, [Validators.required]],
			testChain: [this.formDefaults.testChain, [Validators.required]],
			recordingContextActions: [this.formDefaults.recordingContextActions, [Validators.required]],
			sandboxContextPatching: [this.formDefaults.sandboxContextPatching, [Validators.required]],
		});
	}
}
