import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-chain-config',
	templateUrl: './chain-config.component.html',
	styleUrls: ['./chain-config.component.scss'],
})
export class ChainConfigComponent implements OnInit {
	chainConfig;
	formDefaults: any;

	constructor(private store: Store<any>, private fb: FormBuilder) {}

	ngOnInit(): void {
		// create form group
		this.chainConfig = this.fb.group({
			preservedCycles: [Validators.required],

			blocksPerCycle: [Validators.required],
			blocksPerCommit: [Validators.required],
			blocksPerRollSnap: [Validators.required],
			blocksPerVotingPeriod: [Validators.required],
			timeBetweenBlocks: [Validators.required],
			endorsersPerBlock: [Validators.required],

			hardGasLimitPerOperation: [Validators.required],
			hardGasLimitPerBlock: [Validators.required],
			proofOfWorkTreshold: [Validators.required],
			tokensPerRoll: [Validators.required],
			michelsonMaxTypeSize: [Validators.required],
			seedNonceRevelationTip: [Validators.required],

			originationSize: [Validators.required],
			blockSecurityDeposit: [Validators.required],
			endorsementSecurityDeposit: [Validators.required],
			bakingRewardPerEndorsement: [Validators.required],
			endorsementReward: [Validators.required],
			costPerByte: [Validators.required],
			storageLimitPerOperation: [Validators.required],
			testChainDuration: [Validators.required],

			quorumMin: [Validators.required],
			quorumMax: [Validators.required],
			minProposalQuorum: [Validators.required],
			initialEndorsers: [Validators.required],
			delayPerMissingEndorsement: [Validators.required],
		});
	}
}
