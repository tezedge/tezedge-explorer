import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-chain-server',
	templateUrl: './chain-server.component.html',
	styleUrls: ['./chain-server.component.scss'],
})
export class ChainServerComponent implements OnInit {
	formGroup: FormGroup;

	constructor(private store: Store<any>, private fb: FormBuilder) {}

	ngOnInit(): void {
		// create form group
		this.formGroup = this.fb.group({
			hostname: [{ value: '', disabled: true }, [Validators.required]],
			bootstrapDbPath: ['', [Validators.required]],
			maxThreads: [''],
			maxOpenFiles: [''],
			loggingFile: [''],
			loggingFormat: ['', [Validators.required]],
			loggingLevel: ['', [Validators.required]],
			oCamlLogging: ['', [Validators.required]],
			network: ['', [Validators.required]],
			p2pPort: ['', [Validators.required]],
			rpcPort: ['', [Validators.required]],
			webSocketAddress: ['', [Validators.required]],
			monitorPort: ['', [Validators.required]],
			lowerPeerTreshold: ['', [Validators.required]],
			higherPeerTreshold: ['', [Validators.required]],
			peers: [''],
			disableBootstrapDnsLookup: ['', [Validators.required]],
			bootstrapLookupAddresses: [''],
			protocolRunner: ['', [Validators.required]],
			ffiCallsNo: ['', [Validators.required]],
			ffiMaxConn: ['', [Validators.required]],
			ffiConnTimeout: ['', [Validators.required]],
			ffiPoolLifetime: ['', [Validators.required]],
			ffiPoolUnusedTimeout: ['', [Validators.required]],
			mempool: ['', [Validators.required]],
			privateNodeMode: ['', [Validators.required]],
			testChain: ['', [Validators.required]],
			recordingContextActions: ['', [Validators.required]],
			sandboxContextPatching: ['', [Validators.required]],
		});
	}
}
