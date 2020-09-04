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

		hardGasLimitPerOperation: '1.04',
		hardGasLimitPerBlock: '1.04',
		proofOfWorkTreshold: '-1',
		tokensPerRoll: '8000',
		michelsonMaxTypeSize: '1000',
		seedNonceRevelationTip: '0.125',

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
	error: {
		error_type: null,
		field_name: null,
		message: null,
		isShown: false
	}
};

export function reducer(state = initialState, action) {
	switch (action.type) {
		case 'CHAIN_CONFIG_FORM_SUBMIT_ERROR': {
			return {
					...state,
					error: mapError(action.payload.error)
			}
		}
		case 'CHAIN_CONFIG_FORM_ERROR_SHOWN': {
			return {
					...state,
					error: {
						...state.error,
						isShown: true
					}
			}
		}
		default:
			return state;
	}
}

export function mapError(serverError: any) {
	if(serverError.error_type === 'validation'){
		return {
			...serverError,
			field_name: mapFieldName(serverError.field_name),
			isShown: false
		}
	} else {
		return serverError;
	}
}

// Maps field_name from error into form field name
export function mapFieldName(field_name: string){
	field_name = field_name.replace(/-/g, '_');

	// define field name mappings
	const chainConfigFieldNameMappings = {
		preserved_cycles: 'preservedCycles',
		blocks_per_cycle: 'blocksPerCycle',
		blocks_per_commitment: 'blocksPerCommit',
		blocks_per_roll_snapshot: 'blocksPerRollSnap',
		blocks_per_voting_period: 'blocksPerVotingPeriod',
		time_between_blocks: 'timeBetweenBlocks1',
		endorsers_per_block: 'endorsersPerBlock',
		hard_gas_limit_per_operation: 'hardGasLimitPerOperation',
		hard_gas_limit_per_block: 'hardGasLimitPerBlock',
		proof_of_work_threshold: 'proofOfWorkTreshold',
		tokens_per_roll: 'tokensPerRoll',
		michelson_maximum_type_size: 'michelsonMaxTypeSize',
		seed_nonce_revelation_tip: 'seedNonceRevelationTip',
		origination_size: 'originationSize',
		block_security_deposit: 'blockSecurityDeposit',
		endorsement_security_deposit: 'endorsementSecurityDeposit',
		baking_reward_per_endorsement: 'bakingRewardPerEndorsement1',
		endorsement_reward: 'endorsementReward1',
		cost_per_byte: 'costPerByte',
		hard_storage_limit_per_operation: 'storageLimitPerOperation',
		test_chain_duration: 'testChainDuration',
		quorum_min: 'quorumMin',
		quorum_max: 'quorumMax',
		min_proposal_quorum: 'minProposalQuorum',
		initial_endorsers: 'initialEndorsers',
		delay_per_missing_endorsement: 'delayPerMissingEndorsement',
	};
	// return correct mapping for passed field_name
	return chainConfigFieldNameMappings[field_name];
}