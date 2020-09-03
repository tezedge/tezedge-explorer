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
			hostname: [{ value: '', readonly: true }],
			tezosDataDir: [{ value: '', readonly: true }],
			identityFile: [{ value: '', readonly: true }],
			identityExpectedPow: ['', [Validators.required]],
			bootstrapDbPath: [{ value: '', readonly: true }],
			maxThreads: [''],
			maxOpenFiles: [''],
			loggingFile: [{ value: '', readonly: true }],
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
			protocolRunner: [{ value: '', readonly: true }],
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
			sandboxContextPatching: [{ value: '', readonly: true }],
		});

		// disable form if isReadonly is passed
		if(this.isReadonly){
			this.chainServerForm.disable();
		}

		// Subscribe to get form error
		this.store.select('chainServer')
		.pipe(takeUntil(this.onDestroy$))
		.subscribe(store => {
			this.error = store.error;
			if(this.error?.field_name && !this.error?.isShown && this.formHasFieldName(this.error.field_name)) {
				const control = this.chainServerForm.get(this.error.field_name);
				setTimeout(() => control.setErrors({ 'backendError': true }) );

				// Mark error as shown on form
				this.store.dispatch({ type: 'CHAIN_SERVER_FORM_ERROR_SHOWN' });
				
				// subscribe to field value change (to be able to remove backend error)
				control.valueChanges.pipe(take(1)).subscribe(val => {
					control.setErrors({ 'backendError': null })
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
