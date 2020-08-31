const initialState: any = {
	form: {
		preservedCycles: 2,

		blocksPerCycle: 8,
		blocksPerCommit: 4,
		blocksPerRollSnap: 4,
		blocksPerVotingPeriod: 64,
		timeBetweenBlocks1: '1',
		timeBetweenBlocks2: '0',
		endorsersPerBlock: 32,

		hardGasLimitPerOperation: 1.04,
		hardGasLimitPerBlock: 1.04,
		proofOfWorkTreshold: -1,
		tokensPerRoll: 8000,
		michelsonMaxTypeSize: 1000,
		seedNonceRevelationTip: 0.125,

		originationSize: 257,
		blockSecurityDeposit: 512,
		endorsementSecurityDeposit: 64,
		bakingRewardPerEndorsement1: '1250000',
		bakingRewardPerEndorsement2: '187500',
		endorsementReward1: '1250000',
		endorsementReward2: '833333',
		costPerByte: 1,
		storageLimitPerOperation: 60000,
		testChainDuration: 1966080,

		quorumMin: 2000,
		quorumMax: 7000,
		minProposalQuorum: 500,
		initialEndorsers: 1,
		delayPerMissingEndorsement: 1,
	},
};

export function reducer(state = initialState, action) {
	switch (action.type) {
		default:
			return state;
	}
}
