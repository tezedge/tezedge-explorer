interface BaseOperationMetadata {
    source: string;
    fee: string;
    counter: string;
    gas_limit: string;
    storage_limit: string;
}
export interface RevealOperationMetadata extends BaseOperationMetadata {
    kind: 'reveal';
    public_key: string;
}
export interface TransactionOperationMetadata extends BaseOperationMetadata {
    kind: 'transaction';
    amount: string;
    destination: string;
    parameters?: Record<string, any>;
    parameters_manager?: ParametersManager;
}
export interface OriginationOperationMetadata extends BaseOperationMetadata {
    kind: 'origination';
    balance: string;
    delegate?: string;
    script: Record<string, any>;
}
export interface DelegationOperationMetadata extends BaseOperationMetadata {
    kind: 'delegation';
    delegate?: string;
}
export interface ActivateWalletOperationMetadata {
    kind: 'activate_account';
    pkh: string;
    secret: string;
}
export declare type OperationMetadata = BaseOperationMetadata & (RevealOperationMetadata | TransactionOperationMetadata | OriginationOperationMetadata | DelegationOperationMetadata | ActivateWalletOperationMetadata);
export declare type ContractBalanceUpdate = {
    kind: "contract";
    contract: string;
    change: string;
};
export declare type FeeBalanceUpdate = {
    kind: "freezer";
    category: "fees";
    delegate: string;
    level: number;
    change: string;
};
export declare type ParametersManager = {
    set_delegate?: string;
    cancel_delegate?: boolean;
    transfer?: ParametersManagerTransfer;
};
export declare type ParametersManagerTransfer = {
    destination: string;
    amount: number;
};
export declare type BalanceUpdate = ContractBalanceUpdate | FeeBalanceUpdate;
export declare type OperationValidationResult = OperationMetadata & {
    metadata: {
        balance_updates: never[];
        operation_result: {
            status: "applied" | "failed" | "backtracked";
            balance_updates: ContractBalanceUpdate[];
            errors: any;
            consumed_gas: string;
            storage_size?: string;
            originated_contracts?: string;
        };
    };
};
export declare type OperationApplicationResult = OperationValidationResult & {
    balance_updates: BalanceUpdate[];
};
export declare type TrezorRevealOperation = {
    source: string;
    public_key: string;
    fee: number;
    counter: number;
    gas_limit: number;
    storage_limit: number;
};
export declare type TrezorTransactionOperation = {
    source: string;
    destination: string;
    amount: number;
    fee: number;
    counter: number;
    gas_limit: number;
    storage_limit: number;
    parameters_manager?: ParametersManager;
};
export declare type TrezorOriginationOperation = {
    source: string;
    balance: number;
    fee: number;
    counter: number;
    gas_limit: number;
    storage_limit: number;
};
export declare type TrezorDelegationOperation = {
    source: string;
    delegate: string;
    fee: number;
    counter: number;
    gas_limit: number;
    storage_limit: number;
};
export {};
