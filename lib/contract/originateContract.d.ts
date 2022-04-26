import { Observable } from "rxjs";
import { State, OriginatedContract } from "../common";
import { StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation, StateValidatedOperations } from "../operation";
import { StateHead } from "../head";
import { StateCounter } from "./getContractCounter";
import { StateManagerKey } from './getContractManagerKey';
export declare type StateOriginateContract = {
    originateContract: OriginatedContract;
};
/**
 * Originate smart contract from implicit wallet. Contract will be used for delegation.
 * Complete operations stack
 *
 * @param selector derives origination data from state
 *
 * @operation reveal for non revealed wallet
 * @operation origination
 *
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * originateContract(state => ({
 *  fee: "100"
 *  amount: "5"
 *  to: "some address"
 * }))
 *
 */
export declare const originateContract: <T extends State>(selector: (state: T) => OriginatedContract) => (source: Observable<T>) => Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & StateOriginateContract & StateSignOperation & StatePreapplyOperation & StateInjectionOperation & StateValidatedOperations>;
