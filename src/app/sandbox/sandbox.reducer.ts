const initialState: any = {
    chainServer: {},
    chainConfig: {},
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'CHAIN_SERVER_FORM_SUBMIT': {
            return {
                ...state,
                chainServer: mapChainServerData(action.payload)
            }
        }
        case 'CHAIN_CONFIG_FORM_SUBMIT': {
            return {
                ...state,
                chainConfig: mapChainConfigData(action.payload)
            }
        }
        default:
            return state;
    }
}

export function mapChainServerData(formData: any){
    return {
        identity_expected_pow: formData.identityExpectedPow,
        disable_bootstrap_lookup: formData.disableBootstrapDnsLookup,
        bootstrap_lookup_address:  formData.bootstrapLookupAddresses,
        disable_mempool: !formData.mempool,
        network: formData.network, 
        peer_thresh_low: formData.lowerPeerTreshold, 
        peer_thresh_high: formData.higherPeerTreshold, 
        sandbox_patch_context_json_file: formData.sandboxContextPatching, 
        protocol_runner: formData.protocolRunner, 
        tezos_data_dir: formData.tezosDataDir,
        identity_file: formData.identityFile,
        bootstrap_db_path: formData.bootstrapDbPath, 
        db_cfg_max_threads: formData.maxThreads, 
        log_file: formData.loggingFile,
        log_format: formData.loggingFormat, 
        log_level: formData.loggingLevel, 
        ocaml_log_enabled: formData.oCamlLogging, 
        p2p_port: formData.p2pPort, 
        rpc_port: formData.rpcPort, 
        monitor_port: formData.monitorPort, 
        peers: formData.peers,
        websocket_address: formData.webSocketAddress,
        private_node: formData.privateNodeMode, 
        ffi_calls_gc_threshold: formData.ffiCallsNo, 
        ffi_pool_max_connections: formData.ffiMaxConn, 
        ffi_pool_connection_timeout_in_secs: formData.ffiConnTimeout, 
        ffi_pool_max_lifetime_in_secs: formData.ffiPoolLifetime, 
        ffi_pool_idle_timeout_in_secs: formData.ffiPoolUnusedTimeout, 
        store_context_actions: formData.recordingContextActions, 
        tokio_threads: formData.tokioThreads,
        enable_testchain: formData.testChain, 
    }
}

export function mapChainConfigData(formData: any){
    return {
        preserved_cycles: formData.preservedCycles,
        blocks_per_cycle: formData.blocksPerCycle,
        blocks_per_commitment: formData.blocksPerCommit,
        blocks_per_roll_snapshot: formData.blocksPerRollSnap,
        blocks_per_voting_period: formData.blocksPerVotingPeriod,
        time_between_blocks: [
            formData.timeBetweenBlocks1, 
            formData.timeBetweenBlocks2
        ],
        endorsers_per_block: formData.endorsersPerBlock,
        hard_gas_limit_per_operation: formData.hardGasLimitPerOperation,
        hard_gas_limit_per_block: formData.hardGasLimitPerBlock,
        proof_of_work_threshold: formData.proofOfWorkTreshold,
        tokens_per_roll: formData.tokensPerRoll,
        michelson_maximum_type_size: formData.michelsonMaxTypeSize,
        seed_nonce_revelation_tip: formData.seedNonceRevelationTip,
        origination_size: formData.originationSize,
        block_security_deposit: formData.blockSecurityDeposit,
        endorsement_security_deposit: formData.endorsementSecurityDeposit,
        baking_reward_per_endorsement: [
            formData.bakingRewardPerEndorsement1,
            formData.bakingRewardPerEndorsement2
        ],
        endorsement_reward: [
          formData.endorsementReward1,
          formData.endorsementReward2
        ],
        cost_per_byte: formData.costPerByte,
        hard_storage_limit_per_operation: formData.storageLimitPerOperation,
        test_chain_duration: formData.testChainDuration,
        quorum_min: formData.quorumMin,
        quorum_max: formData.quorumMax,
        min_proposal_quorum: formData.minProposalQuorum,
        initial_endorsers: formData.initialEndorsers,
        delay_per_missing_endorsement: formData.delayPerMissingEndorsement,
    }
}