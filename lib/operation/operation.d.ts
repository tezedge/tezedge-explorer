import { Observable } from "rxjs";
import { OperationMetadata, State } from "../common";
export declare type StateOperations = {
    operations: OperationMetadata[];
};
/**
 * Create operation in blockchain.
 * Fully forge operation, validates it and inject into blockchain
 */
export declare const operation: () => <T extends State & StateOperations>(source: Observable<T>) => Observable<T & import("..").StateHead & import("..").StateCounter & import("..").StateManagerKey & import("./forgeOperation").StateOperation & State & import("./signOperation").StateSignOperation & import("./applyInjectOperation").StatePreapplyOperation & import("./applyInjectOperation").StateInjectionOperation>;
