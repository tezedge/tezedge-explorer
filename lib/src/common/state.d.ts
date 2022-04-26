import { OperationMetadata, OperationValidationResult } from "./operations";
import { TezosNode } from './config';
import { RpcParams } from './rpc';
import { LedgerState } from './ledger';
export interface State {
    activateWallet?: ActivatedWallet;
    confirmOperation?: ConfirmOperation;
    constants?: HeadConstants;
    counter?: number;
    getWallet?: WalletDetail;
    ledger?: LedgerState;
    head?: Head;
    injectionOperation?: InjectionOperation;
    manager_key?: string;
    mempool?: Mempool;
    originateContract?: OriginatedContract;
    operation?: string;
    operations?: OperationMetadata[];
    packOperationParameters?: PackOperationParameters;
    pendingOperation?: PendingOperation;
    preapply?: PreapplyOperation[];
    rpc?: RpcParams;
    setDelegate?: SetDelegate;
    signOperation?: SignOperation;
    transactions?: Transaction[];
    validatedOperations?: ValidationResult;
    wallet: Wallet;
    newWallet?: NewWallet;
}
export declare type ActivatedWallet = {
    secret: string;
};
export declare type ConfirmOperation = {
    injectionOperation: InjectionOperation;
};
export declare type HeadConstants = {
    proof_of_work_nonce_size: number;
    nonce_length: number;
    max_revelations_per_block: number;
    max_operation_data_length: number;
    max_proposals_per_delegate: number;
    preserved_cycles: number;
    blocks_per_cycle: number;
    blocks_per_commitment: number;
    blocks_per_roll_snapshot: number;
    blocks_per_voting_period: number;
    time_between_blocks: string[];
    endorsers_per_block: number;
    hard_gas_limit_per_operation: string;
    hard_gas_limit_per_block: string;
    proof_of_work_threshold: string;
    tokens_per_roll: string;
    michelson_maximum_type_size: number;
    seed_nonce_revelation_tip: string;
    origination_size: number;
    block_security_deposit: string;
    endorsement_security_deposit: string;
    block_reward: string;
    endorsement_reward: string;
    cost_per_byte: string;
    hard_storage_limit_per_operation: string;
};
export declare type Head = {
    chain_id: string;
    hash: string;
    header: {
        context: string;
        fitness: [string, string];
        level: number;
        operations_hash: string;
        predecessor: string;
        priority: number;
        proof_of_work_nonce: string;
        proto: number;
        signature: string;
        timestamp: string;
        validation_pass: number;
    };
    metadata: {
        baker: string;
        balance_updates: any[];
        consumed_gas: string;
        deactivated: any[];
        level: any;
        max_block_header_length: number;
        max_operation_data_length: number;
        max_operation_list_length: {
            max_size: number;
            max_op?: number;
        }[];
        max_operations_ttl: number;
        next_protocol: string;
        nonce_hash: string | null;
        protocol: string;
        test_chain_status: {
            status: 'running' | 'not_running';
        };
        voting_period_kind: 'proposal';
    };
    operations: {
        branch: string;
        chain_id: string;
        contents: {
            kind: string;
            level: number;
            metadata: any;
        }[];
        hash: string;
        protocol: string;
        signature: string;
    }[];
    protocol: string;
};
export declare type InjectionOperation = {};
export declare type MempoolOperation = {
    branch: string;
    contents: any;
    hash: string;
    signature: string;
};
export declare type Mempool = {
    applied: MempoolOperation[];
    branch_delayed: MempoolOperation[];
    branch_refused: MempoolOperation[];
    refused: MempoolOperation[];
    unprocessed: MempoolOperation[];
};
export declare type OriginatedContract = {
    fee: string;
    amount: string;
    script: Record<string, any>;
    testRun?: boolean;
};
export declare type PackOperationParameters = {};
export declare type PendingOperation = {
    publicKeyHash: string;
};
export declare type PreapplyOperation = {
    contents: OperationValidationResult[];
    signature: string;
};
export declare type SetDelegate = {
    fee: string;
    to: string;
    testRun?: boolean;
};
export declare type SignOperation = {
    signature: string;
    signedOperationContents: string;
    operationHash: string;
};
export declare type Transaction = {
    amount: string;
    fee: string;
    to: string;
    parameters?: Record<string, any>;
    testRun?: boolean;
    parameters_manager?: TransactionParametersManager;
};
export declare type TransactionParametersManager = {
    set_delegate?: string;
    cancel_delegate?: boolean;
    transfer?: {
        destination: string;
        amount: string;
    };
};
export declare type ValidationResult = {
    contents: OperationValidationResult[];
};
export declare type Wallet = {
    mnemonic?: string;
    path?: string;
    node: TezosNode;
    publicKey?: string;
    publicKeyHash: string;
    secret?: string;
    secretKey?: string;
    type?: 'web' | 'TREZOR_T' | 'TREZOR_P' | 'LEDGER';
};
export declare type WalletDetail = {
    balance: number;
};
export declare type NewWallet = {
    mnemonic: string;
    secretKey: string;
    publicKey: string;
    publicKeyHash: string;
};
