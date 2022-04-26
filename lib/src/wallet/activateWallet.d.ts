import { Observable } from "rxjs";
import { State, ActivatedWallet } from "../common";
import { StateOperations } from "../operation";
export declare type StateActivateWallet = {
    activateWallet: ActivatedWallet;
};
/**
  * Activate generated wallet address
  *
  * @operation activate_account
  * @returns Observable
  */
export declare const activateWallet: <T extends State>(selector: (state: T) => ActivatedWallet) => (source: Observable<T>) => Observable<T & StateActivateWallet & StateOperations & import("..").StateHead & import("..").StateCounter & import("..").StateManagerKey & import("../operation").StateOperation & State & import("../operation").StateSignOperation & import("../operation").StatePreapplyOperation & import("../operation").StateInjectionOperation>;
