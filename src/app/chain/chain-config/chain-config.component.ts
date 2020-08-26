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
		// TODO: fetch real defaults here
		this.formDefaults = {
			preservedCycles: 2,

			blocksPerCycle: 8,
			blocksPerCommit: 4,
			blocksPerRollSnap: 4,
			blocksPerVotingPeriod: 64,
			timeBetweenBlocks: '1 , 0',
			endorsersPerBlock: 32,

			hardGasLimitPerOperation: 1040000,
			hardGasLimitPerBlock: 10400000,
			proofOfWorkTreshold: -1,
			tokensPerRoll: 8000000000,
			michelsonMaxTypeSize: 1000,
			seedNonceRevelationTip: 125000,

			originationSize: 257,
			blockSecurityDeposit: 512000000,
			endorsementSecurityDeposit: 64000000,
			bakingRewardPerEndorsement: '1250000 , 187500',
			endorsementReward: '1250000 , 833333',
			costPerByte: 1000,
			storageLimitPerOperation: 60000,
			testChainDuration: 1966080,

			quorumMin: 2000,
			quorumMax: 7000,
			minProposalQuorum: 500,
			initialEndorsers: 1,
			delayPerMissingEndorsement: 1,
		};

		// create form group
		this.chainConfig = this.fb.group({
			preservedCycles: [this.formDefaults.preservedCycles, [Validators.required]],

			blocksPerCycle: [this.formDefaults.blocksPerCycle, [Validators.required]],
			blocksPerCommit: [this.formDefaults.blocksPerCommit, [Validators.required]],
			blocksPerRollSnap: [this.formDefaults.blocksPerRollSnap, [Validators.required]],
			blocksPerVotingPeriod: [this.formDefaults.blocksPerVotingPeriod, [Validators.required]],
			timeBetweenBlocks: [this.formDefaults.timeBetweenBlocks, [Validators.required]],
			endorsersPerBlock: [this.formDefaults.endorsersPerBlock, [Validators.required]],

			hardGasLimitPerOperation: [this.formDefaults.hardGasLimitPerOperation, [Validators.required]],
			hardGasLimitPerBlock: [this.formDefaults.hardGasLimitPerBlock, [Validators.required]],
			proofOfWorkTreshold: [this.formDefaults.proofOfWorkTreshold, [Validators.required]],
			tokensPerRoll: [this.formDefaults.tokensPerRoll, [Validators.required]],
			michelsonMaxTypeSize: [this.formDefaults.michelsonMaxTypeSize, [Validators.required]],
			seedNonceRevelationTip: [this.formDefaults.seedNonceRevelationTip, [Validators.required]],

			originationSize: [this.formDefaults.originationSize, [Validators.required]],
			blockSecurityDeposit: [this.formDefaults.blockSecurityDeposit, [Validators.required]],
			endorsementSecurityDeposit: [this.formDefaults.endorsementSecurityDeposit, [Validators.required]],
			bakingRewardPerEndorsement: [this.formDefaults.bakingRewardPerEndorsement, [Validators.required]],
			endorsementReward: [this.formDefaults.endorsementReward, [Validators.required]],
			costPerByte: [this.formDefaults.costPerByte, [Validators.required]],
			storageLimitPerOperation: [this.formDefaults.storageLimitPerOperation, [Validators.required]],
			testChainDuration: [this.formDefaults.testChainDuration, [Validators.required]],

			quorumMin: [this.formDefaults.quorumMin, [Validators.required]],
			quorumMax: [this.formDefaults.quorumMax, [Validators.required]],
			minProposalQuorum: [this.formDefaults.minProposalQuorum, [Validators.required]],
			initialEndorsers: [this.formDefaults.initialEndorsers, [Validators.required]],
			delayPerMissingEndorsement: [this.formDefaults.delayPerMissingEndorsement, [Validators.required]],
		});
	}
}
