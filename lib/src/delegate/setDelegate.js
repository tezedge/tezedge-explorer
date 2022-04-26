import { of } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";
import { parseAmount } from "../common";
import { counter, managerKey } from "../contract";
import { operation, validateOperation } from "../operation";
import { constants, head } from "../head";
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
export const setDelegation = (selector) => (source) => source.pipe(map(state => (Object.assign(Object.assign({}, state), { setDelegate: selector(state) }))), head(), constants(), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), 
// display transaction info to console
tap(state => {
    console.log(`[+] setDelegate: from "${state.wallet.publicKeyHash}" to "${state.setDelegate.to}"`);
}), tap(state => {
    console.log(`[+] wallet: from "${state.wallet}"`);
}), 
// prepare config for operation
map(state => {
    const withTestRun = state.setDelegate.testRun || false;
    const operations = [];
    if (state.manager_key === null) {
        if (typeof state.wallet.publicKey === 'undefined') {
            console.warn('[setDelegation] Public key not available in wallet. Using empty string.');
        }
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey || '',
            source: state.wallet.publicKeyHash,
            fee: parseAmount(state.setDelegate.fee).toString(),
            // extra gas is for safety 
            gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
            storage_limit: "0",
            counter: (++state.counter).toString(),
        });
    }
    operations.push({
        kind: "delegation",
        source: state.wallet.publicKeyHash,
        fee: parseAmount(state.setDelegate.fee).toString(),
        // extra gas is for safety 
        gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
        storage_limit: "0",
        counter: (++state.counter).toString(),
        delegate: !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    });
    return Object.assign(Object.assign({}, state), { operations: operations });
}), 
// run operation on node and calculate its gas consumption and storage size
flatMap(state => {
    return (state.setDelegate.testRun ? validateOperation() : of(state));
}), 
// create operation 
operation());
//# sourceMappingURL=setDelegate.js.map