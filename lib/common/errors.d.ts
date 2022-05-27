import { State } from "./state";
import { OperationMetadata } from "./operations";
export declare type ErrorKind = "temporary" | "permanent";
export declare type RpcError<S = State> = {
    response: {
        id: string;
        kind: ErrorKind;
        [k: string]: any;
    }[];
    state: S;
};
export declare type ValidationError<S = State> = {
    response: {
        id: string;
        kind: ErrorKind;
        [k: string]: any;
    }[];
    state: S;
};
export declare type InjectionError<S = State> = {
    response: {
        id: string;
        kind: ErrorKind;
        [k: string]: any;
    }[];
    state: S;
};
export declare type LowFeeError<S = State> = {
    response: {
        id: "tezos-wallet.fee.insuficient";
        kind: "temporary";
        operation: OperationMetadata;
    }[];
    state: S;
};
