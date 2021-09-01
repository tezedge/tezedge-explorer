import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-chain-config',
	templateUrl: './chain-config.component.html',
	styleUrls: ['./chain-config.component.scss'],
})
export class ChainConfigComponent implements OnInit {
	@Input() isReadonly?: boolean;

	chainConfigForm: FormGroup;
	error: any;

	constructor(private store: Store<any>, private fb: FormBuilder) {}

	ngOnInit(): void {
		// create form group
		this.chainConfigForm = this.fb.group({
			preservedCycles: ['', [Validators.required]],

			blocksPerCycle: ['', [Validators.required]],
			blocksPerCommit: ['', [Validators.required]],
			blocksPerRollSnap: ['', [Validators.required]],
			blocksPerVotingPeriod: ['', [Validators.required]],
			timeBetweenBlocks1: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			timeBetweenBlocks2: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			endorsersPerBlock: ['', [Validators.required]],

			hardGasLimitPerOperation: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			hardGasLimitPerBlock: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			proofOfWorkTreshold: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			tokensPerRoll: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			michelsonMaxTypeSize: ['', [Validators.required]],
			seedNonceRevelationTip: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],

			originationSize: ['', [Validators.required]],
			blockSecurityDeposit: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			endorsementSecurityDeposit: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			bakingRewardPerEndorsement1: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			bakingRewardPerEndorsement2: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			endorsementReward1: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			endorsementReward2: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
			costPerByte: ['', [Validators.required]],
			storageLimitPerOperation: ['', [Validators.required]],
			testChainDuration: ['', [Validators.required]],

			quorumMin: ['', [Validators.required]],
			quorumMax: ['', [Validators.required]],
			minProposalQuorum: ['', [Validators.required]],
			initialEndorsers: ['', [Validators.required]],
			delayPerMissingEndorsement: ['', [Validators.required]],
		});

		// disable form if isReadonly is passed
		if(this.isReadonly){
			this.chainConfigForm.disable();
		}

		// Subscribe to store to get form server error
		this.store.select('chainConfig')
		.pipe(untilDestroyed(this))
		.subscribe(store => {
			this.error = store.error;
			if(
				this.error?.error_type === 'validation' &&
				this.error?.field_name &&
				!this.error?.isShown &&
				this.formHasFieldName(this.error.field_name)
				) {
				// set error to form control
				const control = this.chainConfigForm.get(this.error.field_name);
				setTimeout(() => control.setErrors({ 'serverError': true }) );

				// Mark error as shown on form
				this.store.dispatch({ type: 'CHAIN_CONFIG_FORM_ERROR_SHOWN' });

				// subscribe to field value change (to be able to remove server error)
				control.valueChanges.pipe(take(1)).subscribe(val => {
					control.setErrors({ 'serverError': null })
				});
			} else if(!this.error?.isShown && this.error?.error_type === 'generic'){
				// scroll to top of page and disable whole form
				this.store.dispatch({ type: 'CHAIN_CONFIG_FORM_ERROR_SHOWN' });
				window.scroll(0,0);
			}
		});
	}

	// checks whether form has field
	formHasFieldName(fieldName: string): boolean {
    const control = this.chainConfigForm.get(fieldName);
    return control != null;
  }
}
