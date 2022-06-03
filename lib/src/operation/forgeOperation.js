"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgeOperationAtomic = exports.forgeOperationInternal = exports.forgeOperation = void 0;
const sodium = require("libsodium-wrappers");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
const head_1 = require("../head");
// prevent circular dependency
const getContractCounter_1 = require("../contract/getContractCounter");
const getContractManagerKey_1 = require("../contract/getContractManagerKey");
const signOperation_1 = require("./signOperation");
const local_forging_1 = require("@taquito/local-forging");
/**
 * Forge operation in blocchain.
 * Converts operation into binary format and signs operation using script or Trezor
 *
 * @throws LowFeeError [[LowFeeError]]
 */
exports.forgeOperation = () => (source) => source.pipe(
// get head and counter
head_1.head(), 
// get contract counter
getContractCounter_1.counter(), 
// get contract managerKey
getContractManagerKey_1.managerKey(), exports.forgeOperationInternal(), operators_1.tap(state => {
    console.log('#### Forged operation', state.operation);
    console.log('Size', state.operation.length);
}), updateFeesForOperation(), operators_1.tap(state => {
    console.log('#### Re-Forged operation', state.operation);
}), 
// add signature to state
operators_1.flatMap(state => {
    if (state.wallet.type === 'TREZOR_T') {
        return signOperation_1.signOperationTrezor(state);
    }
    else if (state.wallet.type === 'LEDGER') {
        return signOperation_1.signLedgerOperation(state);
    }
    else {
        return signOperation_1.signOperation(state);
    }
}));
/**
 * Converts operation to binary format on node
 */
exports.forgeOperationInternal = () => (source) => source.pipe(operators_1.concatMap((state) => __awaiter(void 0, void 0, void 0, function* () {
    let params = {
        branch: state.head.hash,
        contents: state.operations,
    };
    const hash = yield local_forging_1.localForger.forge(params);
    return Object.assign(Object.assign({}, state), { operation: hash });
})));
/**
 * Converts operation to binary format on node
 *
 * @url /chains/[chainId]/blocks/[headHash]/helpers/forge/operations
 */
exports.forgeOperationAtomic = () => (source) => source.pipe(
// create operation
common_1.rpc(state => ({
    url: `/chains/${state.head.chain_id}/blocks/${state.head.hash}/helpers/forge/operations`,
    path: 'operation',
    payload: {
        branch: state.head.hash,
        contents: state.operations
    }
})));
/**
 * Estimates minimal fee for the operation and compares provided defined fees with minimal
 * If provided fee is insuficient its overriden
 *
 * When fee is modified operation has to be re-forged so signature is matching operation content
 */
const updateFeesForOperation = () => (source) => source.pipe(operators_1.flatMap(state => {
    // we have to re-forge operations if the fees changed
    // otherwise signature would not match
    let feesModified = false;
    const modifiedOps = [];
    state.operations.forEach(operation => {
        // ignore fees calculation for wallet activation
        // @TODO: should it be considered??
        if (operation.kind === "activate_account") {
            return rxjs_1.of(state);
        }
        // value in mutez
        // depends on gas limit and operation byte size in blockchain
        // 64 bytes is for signature appended to operation
        const operationByteSize = sodium.from_hex(state.operation).length + 64;
        const estimatedFee = 100 + parseInt(operation.gas_limit) * 0.1 + operationByteSize;
        const fee = parseFloat(operation.fee);
        console.log(`[+] fees: Estimated operation size is "${operationByteSize}" bytes`);
        console.log(`[+] fees: defined "${fee}" estimated "${estimatedFee}"`);
        if (estimatedFee > fee) {
            console.warn('Defined fee is lower than fail safe minimal fee! Overriding it.');
            operation.fee = estimatedFee.toString();
            feesModified = true;
            modifiedOps.push(operation);
        }
    });
    if (feesModified) {
        // forge again as operation did change
        // return of(state).
        //   pipe(forgeOperationAtomic());
        // shall we throw error here?
        return rxjs_1.throwError({
            state,
            response: modifiedOps.map(op => ({
                id: "tezos-wallet.fee.insuficient",
                kind: "temporary",
                operation: op
            }))
        });
    }
    else {
        return rxjs_1.of(state);
    }
}));
//# sourceMappingURL=forgeOperation.js.map