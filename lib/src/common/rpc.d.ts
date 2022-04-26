import { Observable } from 'rxjs';
import { State } from './state';
export interface RpcParams {
    path: string;
    url: string;
    payload?: any;
}
/**
 * Remote procedure call (RPC) on tezos node
 * Returns state object with rpc result under property defined in rpc parameters
 *
 * @param selector method returning rpc parameters
 *
 * @throws RpcError
 */
export declare const rpc: <T extends State>(selector: (params: T) => RpcParams) => (source: Observable<T>) => Observable<T>;
