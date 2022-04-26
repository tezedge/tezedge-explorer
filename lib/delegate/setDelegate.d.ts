import { Observable } from "rxjs";
import { State, SetDelegate } from "../common";
import { StateCounter, StateManagerKey } from "../contract";
import { StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation } from "../operation";
import { StateHead } from "../head";
export declare type StateSetDelegate = {
    setDelegate: SetDelegate;
};
/**
 *  Set delegation rights to tezos address
 *
 * @param selector provides data for delegation operation
 *
 * @operation reveal when wallet was not revealed yet
 * @operation delegation
 *
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * setDelegate(state => ({
 *  fee: string
 *  to: string
 * }))
 *
 */
export declare const setDelegation: <T extends State>(selector: (state: T) => SetDelegate) => (source: Observable<T>) => Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>;
