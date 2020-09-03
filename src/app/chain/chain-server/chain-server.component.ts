import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
	selector: 'app-chain-server',
	templateUrl: './chain-server.component.html',
	styleUrls: ['./chain-server.component.scss'],
})
export class ChainServerComponent implements OnInit, OnDestroy  {
	@Input() isReadonly?: boolean;
	
  onDestroy$ = new Subject();
	chainServerForm: FormGroup;
	error: any;

	constructor(private store: Store<any>, private fb: FormBuilder) {}

	ngOnInit(): void {
		// create form group
		this.chainServerForm = this.fb.group({
			hostname: ['', [Validators.required]],
			tezosDataDir: ['', [Validators.required]],
			identityFile: ['', [Validators.required]],
			identityExpectedPow: ['', [Validators.required]],
			bootstrapDbPath: ['', [Validators.required]],
			maxThreads: [''],
			maxOpenFiles: [''],
			loggingFile: ['', [Validators.required]],
			loggingFormat: ['', [Validators.required]],
			loggingLevel: ['', [Validators.required]],
			oCamlLogging: ['', [Validators.required]],
			network: ['', [Validators.required]],
			p2pPort: ['', [
				Validators.required, 
				Validators.min(0),
				Validators.max(65535),
				]
			],
			rpcPort: ['', [
				Validators.required, 
				Validators.min(0),
				Validators.max(65535),
				]
			],
			webSocketAddress: ['', [Validators.required, Validators.pattern(/^([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-zA-Z]+):([0-9]{1,5})$/)]],
			monitorPort: ['', [
				Validators.required, 
				Validators.min(0),
				Validators.max(65535),
				]
			],
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
			tokioThreads: ['', [Validators.required]],
			testChain: ['', [Validators.required]],
			recordingContextActions: ['', [Validators.required]],
			sandboxContextPatching: ['', [Validators.required]],
		});

		// disable entire form if isReadonly flag is passed
		if(this.isReadonly){
			this.chainServerForm.disable();
		}

		// Subscribe to store to get form server error
		this.store.select('chainServer')
		.pipe(takeUntil(this.onDestroy$))
		.subscribe(store => {
			this.error = store.error;
			if(this.error?.field_name && !this.error?.isShown && this.formHasFieldName(this.error.field_name)) {
				const control = this.chainServerForm.get(this.error.field_name);
				setTimeout(() => control.setErrors({ 'serverError': true }) );

				// Mark error as shown on form
				this.store.dispatch({ type: 'CHAIN_SERVER_FORM_ERROR_SHOWN' });
				
				// subscribe to field value change (to be able to remove server error)
				control.valueChanges.pipe(take(1)).subscribe(val => {
					control.setErrors({ 'serverError': null })
				});
			}
		});
	}

	// checks whether form has field
	formHasFieldName(fieldName: string): boolean {
    const control = this.chainServerForm.get(fieldName);
    return control != null;
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
