import { Observable } from "rxjs";
import { State } from "../common";
export declare type StateManagerKey = {
    manager_key: string;
};
/**
* Get manager key for contract
*/
export declare const managerKey: <T extends State>() => (source: Observable<T>) => Observable<T & StateManagerKey>;
