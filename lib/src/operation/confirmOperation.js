import { throwError, of } from "rxjs";
import { map, tap, delay, flatMap } from "rxjs/operators";
import { pendingOperationsAtomic } from "./pendingOperation";
/**
 * Wait until operation is confirmed & moved from mempool to head
 *
 * Polls mempool to check when operation is confirmed and moved to head
 * @param selector method returning operation hash to check in mempool
 */
export const confirmOperation = (selector) => (source) => source.pipe(map(state => (Object.assign(Object.assign({}, state), { confirmOperation: selector(state) }))), tap((state) => console.log(`[-] pending: operation "${state.confirmOperation.injectionOperation}"`)), 
// wait 3 sec for operation 
delay(3000), pendingOperationsAtomic(), 
// if we find operation in mempool call confirmOperation() again
flatMap((state) => {
    // check if operation is refused
    if (state.mempool.refused.filter(hasRefusedOperationInMempool, state).length > 0) {
        console.error('[-] operation refused: ', state.mempool.refused, state.confirmOperation.injectionOperation);
        return throwError(state.mempool.refused);
    }
    else {
        return state.mempool.applied.filter(hasAppliedOperationInMempool, state).length > 0 ?
            of(state).pipe(confirmOperation(selector)) :
            source;
    }
}));
/**
 * Check if mempool contains operation among refused
 * @this state with operation to confirm
 * @param operation mempool operation
 */
function hasRefusedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
;
/**
 * Check if mempool contains operation among applied
 * @this state with operation to confirm
 * @param mempool operation
 */
function hasAppliedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
;
//# sourceMappingURL=confirmOperation.js.map