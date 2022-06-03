"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDelegation = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
const contract_1 = require("../contract");
const operation_1 = require("../operation");
const head_1 = require("../head");
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
exports.setDelegation = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign(Object.assign({}, state), { setDelegate: selector(state) }))), head_1.head(), head_1.constants(), 
// get contract counter
contract_1.counter(), 
// get contract managerKey
contract_1.managerKey(), 
// display transaction info to console
operators_1.tap(state => {
    console.log(`[+] setDelegate: from "${state.wallet.publicKeyHash}" to "${state.setDelegate.to}"`);
}), operators_1.tap(state => {
    console.log(`[+] wallet: from "${state.wallet}"`);
}), 
// prepare config for operation
operators_1.map(state => {
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
            fee: common_1.parseAmount(state.setDelegate.fee).toString(),
            // extra gas is for safety 
            gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
            storage_limit: "0",
            counter: (++state.counter).toString(),
        });
    }
    operations.push({
        kind: "delegation",
        source: state.wallet.publicKeyHash,
        fee: common_1.parseAmount(state.setDelegate.fee).toString(),
        // extra gas is for safety 
        gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
        storage_limit: "0",
        counter: (++state.counter).toString(),
        delegate: !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    });
    return Object.assign(Object.assign({}, state), { operations: operations });
}), 
// run operation on node and calculate its gas consumption and storage size
operators_1.flatMap(state => {
    return (state.setDelegate.testRun ? operation_1.validateOperation() : rxjs_1.of(state));
}), 
// create operation 
operation_1.operation());
//# sourceMappingURL=setDelegate.js.map