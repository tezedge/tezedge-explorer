import { map, tap } from "rxjs/operators";
import { rpc } from "../common";
/**
 * Gets list of applied and refused operations in mempool for specific wallet
 * @param selector method returning operation object with public key used as filter
 */
export const pendingOperation = (selector) => (source) => source.pipe(map(state => (Object.assign(Object.assign({}, state), { pendingOperation: selector(state) }))), pendingOperationsAtomic(), 
// get operation for address in mempool
map((state) => ({
    applied: [
        ...state.mempool.applied
            .filter((operation) => operation.contents && operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ],
    refused: [
        ...state.mempool.refused
            .filter((operation) => operation.contents && operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ]
})), tap(state => console.warn('[pendingOperation]', state)));
/**
 * Gets mempool operations
 *
 * @url /chains/main/mempool/pending_operations
 */
export const pendingOperationsAtomic = () => (source) => source.pipe(rpc(() => ({
    url: '/chains/main/mempool/pending_operations',
    path: 'mempool'
})));
//# sourceMappingURL=pendingOperation.js.map