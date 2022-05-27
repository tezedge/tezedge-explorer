import { Observable } from 'rxjs';
import { State } from '../common';
import { StateHead } from '../head';
import { StateCounter } from '../contract/getContractCounter';
import { StateManagerKey } from '../contract/getContractManagerKey';
import { StateOperations } from './operation';
export declare type StateOperation = {
    operation: string;
};
/**
 * Forge operation in blocchain.
 * Converts operation into binary format and signs operation using script or Trezor
 *
 * @throws LowFeeError [[LowFeeError]]
 */
export declare const forgeOperation: <T extends State & StateOperations>() => (source: Observable<T>) => Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & State & import("./signOperation").StateSignOperation>;
/**
 * Converts operation to binary format on node
 */
export declare const forgeOperationInternal: <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => Observable<T & StateOperation>;
/**
 * Converts operation to binary format on node
 *
 * @url /chains/[chainId]/blocks/[headHash]/helpers/forge/operations
 */
export declare const forgeOperationAtomic: <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => Observable<T & StateOperation>;
