import { of } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";
import { parseAmount } from "../common";
import { operation, validateOperation } from "../operation";
import { constants, head } from "../head";
import { counter } from "./getContractCounter";
/**
 * Originate smart contract from implicit wallet. Contract will be used for delegation.
 * Complete operations stack
 *
 * @param selector derives origination data from state
 *
 * @operation reveal for non revealed wallet
 * @operation origination
 *
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * originateContract(state => ({
 *  fee: "100"
 *  amount: "5"
 *  to: "some address"
 * }))
 *
 */
export const originateContract = (selector) => (source) => source.pipe(
// get meta data for contract
map(state => (Object.assign(Object.assign({}, state), { originateContract: selector(state) }))), 
// display transaction info to console
tap(state => {
    console.log(`[+] originate : from "${state.wallet.publicKeyHash}"`);
}), head(), constants(), 
// get contract counter
counter(), 
// get contract managerKey
// managerKey(),
// prepare config for operation
map(state => {
    const withTestRun = state.originateContract.testRun || false;
    const operations = [];
    // revealed wallet already has a manager
    if (state.manager_key === null) {
        if (typeof state.wallet.publicKey === 'undefined') {
            console.warn('[originateContract] Public key not available in wallet. Using empty string.');
        }
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey || '',
            source: state.wallet.publicKeyHash,
            fee: parseAmount(state.originateContract.fee).toString(),
            // extra  gas is for safety 
            gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
            storage_limit: "0",
            counter: (++state.counter).toString(),
        });
    }
    const originationOperation = {
        kind: "origination",
        source: state.wallet.publicKeyHash,
        fee: parseAmount(state.originateContract.fee).toString(),
        balance: parseAmount(state.originateContract.amount).toString(),
        // extra gas is for safety 
        gas_limit: state.constants.hard_gas_limit_per_operation,
        storage_limit: state.constants.hard_storage_limit_per_operation,
        counter: (++state.counter).toString(),
        script: state.originateContract.script,
    };
    operations.push(originationOperation);
    return Object.assign(Object.assign({}, state), { operations: operations });
}), 
// run operation on node and calculate its gas consumption and storage size
flatMap(state => {
    return (state.originateContract.testRun ? validateOperation() : of(state));
}), 
// create operation 
operation(), tap(state => {
    const origination = state.preapply[0].contents.filter(op => op.kind === "origination")[0];
    origination && console.log(`[+] Originated contract address: "${origination.metadata.operation_result.originated_contracts}"`);
}));
//# sourceMappingURL=originateContract.js.map