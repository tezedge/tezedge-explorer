import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, take, last } from 'rxjs/operators';

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
			// loggingFile: [''],
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
			lowerPeerTreshold: ['', [Validators.required]],
			higherPeerTreshold: ['', [Validators.required]],
			peers: [''],
			disableBootstrapDnsLookup: ['', [Validators.required]],
			bootstrapLookupAddresses: [''],
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
			if(
				this.error?.error_type === 'validation' &&
				this.error?.field_name &&
				!this.error?.isShown &&
				this.formHasFieldName(this.error.field_name)
				) {
				// set error to form control
				const control = this.chainServerForm.get(this.error.field_name);
				setTimeout(() => control.setErrors({ 'serverError': true }) );

				// Mark error as shown on form
				this.store.dispatch({ type: 'CHAIN_SERVER_FORM_ERROR_SHOWN' });

				// subscribe to field value change (to be able to remove server error)
				control.valueChanges.pipe(take(1)).subscribe(val => {
					control.setErrors({ 'serverError': null })
				});
			} else if(this.error?.error_type === 'generic'){
				// scroll to top of page and disable whole form
				window.scroll(0,0);
			}
		});

		// Subscribe to privateMode value changes to reflect correct required fields
		let lastPrivateModeValue;
		this.chainServerForm.get('privateNodeMode').valueChanges
		.pipe(takeUntil(this.onDestroy$))
		.subscribe(value => {
			if(value != lastPrivateModeValue){
				lastPrivateModeValue = value;
				// clear peers and lookupAddresses when switching private node
				this.chainServerForm.get('peers').setValue('');
				this.chainServerForm.get('bootstrapLookupAddresses').setValue('');
				if(value){
					// peers are required in private node mode
					this.chainServerForm.get('peers').setValidators(Validators.required);
				} else {
					this.chainServerForm.get('peers').setValidators([]);
				}
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
