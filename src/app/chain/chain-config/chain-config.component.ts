import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-chain-config',
	templateUrl: './chain-config.component.html',
	styleUrls: ['./chain-config.component.scss'],
})
export class ChainConfigComponent implements OnInit {
	formGroup: FormGroup;

	constructor(private store: Store<any>, private fb: FormBuilder) {}

	ngOnInit(): void {
		// create form group
		this.formGroup = this.fb.group({
			preservedCycles: ['', [Validators.required]],

			blocksPerCycle: ['', [Validators.required]],
			blocksPerCommit: ['', [Validators.required]],
			blocksPerRollSnap: ['', [Validators.required]],
			blocksPerVotingPeriod: ['', [Validators.required]],
			timeBetweenBlocks1: ['', [Validators.required]],
			timeBetweenBlocks2: ['', [Validators.required]],
			endorsersPerBlock: ['', [Validators.required]],

			hardGasLimitPerOperation: ['', [Validators.required]],
			hardGasLimitPerBlock: ['', [Validators.required]],
			proofOfWorkTreshold: ['', [Validators.required]],
			tokensPerRoll: ['', [Validators.required]],
			michelsonMaxTypeSize: ['', [Validators.required]],
			seedNonceRevelationTip: ['', [Validators.required]],

			originationSize: ['', [Validators.required]],
			blockSecurityDeposit: ['', [Validators.required]],
			endorsementSecurityDeposit: ['', [Validators.required]],
			bakingRewardPerEndorsement1: ['', [Validators.required]],
			bakingRewardPerEndorsement2: ['', [Validators.required]],
			endorsementReward1: ['', [Validators.required]],
			endorsementReward2: ['', [Validators.required]],
			costPerByte: ['', [Validators.required]],
			storageLimitPerOperation: ['', [Validators.required]],
			testChainDuration: ['', [Validators.required]],

			quorumMin: ['', [Validators.required]],
			quorumMax: ['', [Validators.required]],
			minProposalQuorum: ['', [Validators.required]],
			initialEndorsers: ['', [Validators.required]],
			delayPerMissingEndorsement: ['', [Validators.required]],
		});
	}
}
