import { Observable } from "rxjs";
import { State, NewWallet } from '../common';
export declare type StateNewWallet = {
    newWallet: NewWallet;
};
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export declare const newWallet: <T extends State>() => (source: Observable<T>) => Observable<T & StateNewWallet>;
