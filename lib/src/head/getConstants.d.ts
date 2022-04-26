import { Observable } from "rxjs";
import { State, HeadConstants } from "../common";
export declare type StateConstants = {
    constants: HeadConstants;
};
/**
 * Get constants used in block
 *
 * @url "/chains/main/blocks/head/context/constants"
 */
export declare const constants: <T extends State>() => (source: Observable<T>) => Observable<T & StateConstants>;
