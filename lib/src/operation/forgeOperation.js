var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as sodium from 'libsodium-wrappers';
import { of, throwError } from 'rxjs';
import { concatMap, flatMap, tap } from 'rxjs/operators';
import { rpc } from '../common';
import { head } from '../head';
// prevent circular dependency
import { counter } from '../contract/getContractCounter';
import { managerKey } from '../contract/getContractManagerKey';
import { signLedgerOperation, signOperation, signOperationTrezor } from './signOperation';
import { localForger } from '@taquito/local-forging';
/**
 * Forge operation in blocchain.
 * Converts operation into binary format and signs operation using script or Trezor
 *
 * @throws LowFeeError [[LowFeeError]]
 */
export const forgeOperation = () => (source) => source.pipe(
// get head and counter
head(), 
// get contract counter
counter(), 
// get contract managerKey
managerKey(), forgeOperationInternal(), tap(state => {
    console.log('#### Forged operation', state.operation);
    console.log('Size', state.operation.length);
}), updateFeesForOperation(), tap(state => {
    console.log('#### Re-Forged operation', state.operation);
}), 
// add signature to state
flatMap(state => {
    if (state.wallet.type === 'TREZOR_T') {
        return signOperationTrezor(state);
    }
    else if (state.wallet.type === 'LEDGER') {
        return signLedgerOperation(state);
    }
    else {
        return signOperation(state);
    }
}));
/**
 * Converts operation to binary format on node
 */
export const forgeOperationInternal = () => (source) => source.pipe(concatMap((state) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield localForger.forge({
        branch: state.head.hash,
        contents: state.operations,
    });
    return Object.assign(Object.assign({}, state), { operation: hash });
})));
/**
 * Converts operation to binary format on node
 *
 * @url /chains/[chainId]/blocks/[headHash]/helpers/forge/operations
 */
export const forgeOperationAtomic = () => (source) => source.pipe(
// create operation
rpc(state => ({
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
const updateFeesForOperation = () => (source) => source.pipe(flatMap(state => {
    // we have to re-forge operations if the fees changed
    // otherwise signature would not match
    let feesModified = false;
    const modifiedOps = [];
    state.operations.forEach(operation => {
        // ignore fees calculation for wallet activation
        // @TODO: should it be considered??
        if (operation.kind === "activate_account") {
            return of(state);
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
        return throwError({
            state,
            response: modifiedOps.map(op => ({
                id: "tezos-wallet.fee.insuficient",
                kind: "temporary",
                operation: op
            }))
        });
    }
    else {
        return of(state);
    }
}));
//# sourceMappingURL=forgeOperation.js.map