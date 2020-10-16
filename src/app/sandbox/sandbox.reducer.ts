const initialState: any = {
    endpoints: {
        start: {},
        activateProtocol: {},
        initClient: []
    },
    showLoading: false,
    error: null
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
                error: null
            }
        }
        case 'CHAIN_SERVER_FORM_SUBMIT_SUCCESS': {
            return {
                ...state,
                showLoading: false,
                error: null
            }
        }
        case 'CHAIN_SERVER_FORM_SUBMIT_ERROR': {
            return {
                ...state,
                showLoading: false,
                error: action.payload.error
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
                error: null
            }
        }
        case 'CHAIN_CONFIG_FORM_SUBMIT_SUCCESS': {
            return {
                ...state,
                showLoading: false,
                error: null
            }
        }
        case 'CHAIN_CONFIG_FORM_SUBMIT_ERROR': {
            return {
                ...state,
                showLoading: false,
                error: action.payload.error
            }
        }

        // Chain wallets form submit
        case 'CHAIN_WALLETS_SUBMIT': {
            return {
                ...state,
                endpoints: {
                    ...state.endpoints,
                    initClient: mapChainWalletsForEndpoint(action.payload)
                },
                showLoading: true,
                error: null
            }
        }
        case 'CHAIN_WALLETS_SUBMIT_SUCCESS': {
            return {
                ...state,
                showLoading: false,
                error: null
            }
        }
        case 'CHAIN_WALLETS_SUBMIT_ERROR': {
            return {
                ...state,
                showLoading: false,
                error: action.payload.error
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
        network: 'sandbox',
        peer_thresh_low: formData.lowerPeerTreshold,
        peer_thresh_high: formData.higherPeerTreshold,
        sandbox_patch_context_json: JSON.parse(formData.sandboxContextPatching),
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

export function mapChainWalletsForEndpoint(wallets: any[]){
    const endpointWallets = [];
    wallets.forEach((wallet)=>{
        const endpointWallet = {
            alias: wallet.alias,
            secret_key: wallet.secretKey,
            public_key: wallet.publicKey,
            public_key_hash: wallet.publicKeyHash,
            initial_balance: wallet.balance
        }
        endpointWallets.push(endpointWallet);
    });
    return endpointWallets;
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
            hard_gas_limit_per_operation: convertXtzToMutez(formData.hardGasLimitPerOperation),
            hard_gas_limit_per_block: convertXtzToMutez(formData.hardGasLimitPerBlock),
            proof_of_work_threshold: formData.proofOfWorkTreshold,
            tokens_per_roll: convertXtzToMutez(formData.tokensPerRoll),
            michelson_maximum_type_size: formData.michelsonMaxTypeSize,
            seed_nonce_revelation_tip: convertXtzToMutez(formData.seedNonceRevelationTip),
            origination_size: formData.originationSize,
            block_security_deposit: convertXtzToMutez(formData.blockSecurityDeposit),
            endorsement_security_deposit: convertXtzToMutez(formData.endorsementSecurityDeposit),
            baking_reward_per_endorsement: [
                formData.bakingRewardPerEndorsement1,
                formData.bakingRewardPerEndorsement2
            ],
            endorsement_reward: [
            formData.endorsementReward1,
            formData.endorsementReward2
            ],
            cost_per_byte: convertXtzToMutez(formData.costPerByte),
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

export function convertXtzToMutez(xtz: string){
    return (Number(xtz) * 1000000).toString();
}
