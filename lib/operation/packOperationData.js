import { tap } from "rxjs/operators";
import { rpc } from "../common";
/**
 * Serialize operation parameters into binary format
 */
export const packOperationParameters = () => (source) => source.pipe(tap(state => console.log('[+] packOperationParameters: ', state)), 
// get packed transaction parameters  
packOperationParametersAtomic(), tap(state => console.log('[+] packOperationParameters: ', state.packOperationParameters)));
/**
 * Serialize operation parameters on node
 *
 * @url /chains/main/blocks/head/helpers/scripts/pack_data
 */
const packOperationParametersAtomic = () => (source) => source.pipe(rpc((state) => {
    const lastOperation = state.operations[state.operations.length - 1];
    return {
        url: '/chains/main/blocks/head/helpers/scripts/pack_data',
        path: 'packOperationParameters',
        payload: {
            data: lastOperation.parameters || {},
            type: {}
        }
    };
}));
//# sourceMappingURL=packOperationData.js.map