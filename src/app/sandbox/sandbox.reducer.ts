const initialState: any = {
    endpoints: {
        start: {},
        activateProtocol: {},
        initClient: [
            {
                "alias": "bootstrap1",
                "secret_key": "edsk3gUfUPyBSfrS9CCgmCiQsTCHGkviBDusMxDJstFtojtc1zcpsh",
                "public_key": "edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav",
                "public_key_hash": "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx",
                "initial_balance": "4000000000000"
            },
            {
                "alias": "bootstrap2",
                "secret_key": "edsk39qAm1fiMjgmPkw1EgQYkMzkJezLNewd7PLNHTkr6w9XA2zdfo",
                "public_key": "edpktzNbDAUjUk697W7gYg2CRuBQjyPxbEg8dLccYYwKSKvkPvjtV9",
                "public_key_hash": "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN",
                "initial_balance": "4000000000000"
            }
        ]
    },
    showLoading: false,
    showError: false
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        // Chain server form submit
        case 'CHAIN_SERVER_FORM_SUBMIT': {
            return {
                ...state,
                endpoints: {
                    ...state.endpoints,
                    start: mapChainServerForEndpoint(action.payload)
                },
                showLoading: true,
                showError: false
            }
        }
        case 'CHAIN_SERVER_FORM_SUBMIT_SUCCESS': {
            return {
                ...state,
                showLoading: false,
                showError: false
            }
        }
        case 'CHAIN_SERVER_FORM_SUBMIT_ERROR': {
            return {
                ...state,
                showLoading: false,
                showError: true
            }
        }
    
        // Chain config form submit
        case 'CHAIN_CONFIG_FORM_SUBMIT': {
            return {
                ...state,
                endpoints: {
                    ...state.endpoints,
                    activateProtocol: mapChainConfigForEndpoint(action.payload)
                },
                showLoading: true,
                showError: false
            }
        }     
        case 'CHAIN_CONFIG_FORM_SUBMIT_SUCCESS': {
            return {
                ...state,
                showLoading: false,
                showError: false
            }
        }    
        case 'CHAIN_CONFIG_FORM_SUBMIT_ERROR': {
            return {
                ...state,
                showLoading: false,
                showError: true
            }
        }

        // Chain wallets form submit
        case 'CHAIN_WALLETS_FORM_SUBMIT': {
            return {
                ...state,
                endpoints: {
                    ...state.endpoints,
                    // TODO
                    // initClient: mapChainWalletsForEndpoint(action.payload)
                },
                showLoading: true,
                showError: false
            }
        }
        case 'CHAIN_WALLETS_FORM_SUBMIT_SUCCESS': {
            return {
                ...state,
                showLoading: false,
                showError: false
            }
        }
        case 'CHAIN_WALLETS_FORM_SUBMIT_ERROR': {
            return {
                ...state,
                showLoading: false,
                showError: true
            }
        }
        
        default:
            return state;
    }
}

// Map chain server form data for '/start' endpoint
export function mapChainServerForEndpoint(formData: any){
    return {
        identity_expected_pow: formData.identityExpectedPow,
        disable_bootstrap_lookup: !formData.bootstrapLookupAddresses ? '' : undefined,
        bootstrap_lookup_address: formData.bootstrapLookupAddresses ? formData.bootstrapLookupAddresses : undefined,
        disable_mempool: !formData.mempool,
        network: formData.network, 
        peer_thresh_low: formData.lowerPeerTreshold, 
        peer_thresh_high: formData.higherPeerTreshold, 
        sandbox_patch_context_json_file: formData.sandboxContextPatching, 
        protocol_runner: formData.protocolRunner, 
        tezos_data_dir: formData.tezosDataDir,
        identity_file: formData.identityFile,
        bootstrap_db_path: formData.bootstrapDbPath, 
        db_cfg_max_threads: formData.maxThreads ? formData.maxThreads.toString() : undefined, 
        log_file: formData.loggingFile ? formData.loggingFile : undefined,
        log_format: formData.loggingFormat, 
        log_level: formData.loggingLevel, 
        ocaml_log_enabled: formData.oCamlLogging, 
        p2p_port: formData.p2pPort, 
        rpc_port: formData.rpcPort, 
        monitor_port: formData.monitorPort, 
        peers: formData.peers ? formData.peers : undefined,
        websocket_address: formData.webSocketAddress,
        private_node: formData.privateNodeMode ? formData.privateNodeMode : undefined, 
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

// Map chain config form data for 'activate_protocol' endpoint
export function mapChainConfigForEndpoint(formData: any){
    return {
        timestamp: (new Date).toISOString(),
        protocol_hash: 'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
        protocol_parameters: 
        {
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
            hard_gas_limit_per_operation: formData.hardGasLimitPerOperation.toString(),
            hard_gas_limit_per_block: formData.hardGasLimitPerBlock.toString(),
            proof_of_work_threshold: formData.proofOfWorkTreshold.toString(),
            tokens_per_roll: formData.tokensPerRoll.toString(),
            michelson_maximum_type_size: formData.michelsonMaxTypeSize,
            seed_nonce_revelation_tip: formData.seedNonceRevelationTip.toString(),
            origination_size: formData.originationSize,
            block_security_deposit: formData.blockSecurityDeposit.toString(),
            endorsement_security_deposit: formData.endorsementSecurityDeposit.toString(),
            baking_reward_per_endorsement: [
                formData.bakingRewardPerEndorsement1,
                formData.bakingRewardPerEndorsement2
            ],
            endorsement_reward: [
            formData.endorsementReward1,
            formData.endorsementReward2
            ],
            cost_per_byte: formData.costPerByte.toString(),
            hard_storage_limit_per_operation: formData.storageLimitPerOperation.toString(),
            test_chain_duration: formData.testChainDuration.toString(),
            quorum_min: formData.quorumMin,
            quorum_max: formData.quorumMax,
            min_proposal_quorum: formData.minProposalQuorum,
            initial_endorsers: formData.initialEndorsers,
            delay_per_missing_endorsement: formData.delayPerMissingEndorsement.toString(),
        }
    }
}