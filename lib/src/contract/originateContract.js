"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.originateContract = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
const operation_1 = require("../operation");
const head_1 = require("../head");
const getContractCounter_1 = require("./getContractCounter");
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
exports.originateContract = (selector) => (source) => source.pipe(
// get meta data for contract
operators_1.map(state => (Object.assign(Object.assign({}, state), { originateContract: selector(state) }))), 
// display transaction info to console
operators_1.tap(state => {
    console.log(`[+] originate : from "${state.wallet.publicKeyHash}"`);
}), head_1.head(), head_1.constants(), 
// get contract counter
getContractCounter_1.counter(), 
// get contract managerKey
// managerKey(),
// prepare config for operation
operators_1.map(state => {
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
            fee: common_1.parseAmount(state.originateContract.fee).toString(),
            // extra  gas is for safety 
            gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
            storage_limit: "0",
            counter: (++state.counter).toString(),
        });
    }
    const originationOperation = {
        kind: "origination",
        source: state.wallet.publicKeyHash,
        fee: common_1.parseAmount(state.originateContract.fee).toString(),
        balance: common_1.parseAmount(state.originateContract.amount).toString(),
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
operators_1.flatMap(state => {
    return (state.originateContract.testRun ? operation_1.validateOperation() : rxjs_1.of(state));
}), 
// create operation 
operation_1.operation(), operators_1.tap(state => {
    const origination = state.preapply[0].contents.filter(op => op.kind === "origination")[0];
    origination && console.log(`[+] Originated contract address: "${origination.metadata.operation_result.originated_contracts}"`);
}));
//# sourceMappingURL=originateContract.js.map