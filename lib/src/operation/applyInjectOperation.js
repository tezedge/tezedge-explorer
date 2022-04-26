import { of, throwError } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { counter } from '../contract';
import { rpc } from '../common';
/**
 * Validates and inject operation into tezos blockain
 * Can be applied to any prepared operation
 *
 * @throws InjectionError when operation validation fails on node
 */
export const applyAndInjectOperation = () => (source) => source.pipe(
//get counter
counter(), 
// preapply operation
preapplyOperations(), tap(state => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)), 
// check for errors
flatMap(state => {
    const result = state.preapply[0].contents[0].metadata;
    // @@TODO: no such a field as operation_result
    return result.operation_result && result.operation_result.status === "failed" ?
        throwError({
            state,
            response: result.operation_result.errors
        }) :
        of(state);
}), 
// inject operation
injectOperations(), tap((state) => console.log("[+] operation: " + state.wallet.node.tzstats.url + state.injectionOperation)));
/**
 * Prevalidates (preapply) operation on tezos node
 *
 * @url /chains/main/blocks/head/helpers/preapply/operations
 */
const preapplyOperations = () => (source) => source.pipe(rpc((state) => ({
    url: '/chains/main/blocks/head/helpers/preapply/operations',
    path: 'preapply',
    payload: [{
            protocol: state.head.metadata.next_protocol,
            branch: state.head.hash,
            contents: state.operations,
            signature: state.signOperation.signature,
        }],
})));
/**
 * Inbjects prevalidated operation to Tezos blockchain
 *
 * @url /injection/operation
 */
const injectOperations = () => (source) => source.pipe(rpc((state) => {
    return ({
        url: '/injection/operation',
        path: 'injectionOperation',
        payload: `"${state.signOperation.signedOperationContents}"`
    });
}));
//# sourceMappingURL=applyInjectOperation.js.map