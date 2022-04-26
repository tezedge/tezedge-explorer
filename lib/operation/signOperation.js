import * as sodium from 'libsodium-wrappers';
import { from, of, throwError } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { base58CheckDecode, bs58checkEncode, concatKeys, parseAmount, prefix, validateOriginationOperation, validateRevealOperation, validateTransactionOperation, } from '../common';
import { LedgerUtils } from '../common/ledger';
/**
 * Sign operation in state. Software signing is used.
 * @param state transaction state
 * @throws TypeError when operation is not available in state
 */
export function signOperation(state) {
    // TODO: change secretKey name to privateKey
    if (typeof state.operation !== 'string') {
        throw new TypeError('[signOperation] Operation not available in state');
    }
    // convert pre applied operation from hex format to by array
    const operation = sodium.from_hex(state.operation);
    if (typeof state.wallet.publicKey === 'undefined') {
        console.warn('[signOperation] Public key not available in wallet. Using empty string.');
    }
    if (typeof state.wallet.secretKey === 'undefined') {
        console.warn('[signOperation] Secret key not available in wallet. Using empty string.');
    }
    // keys in byte format
    const publicKey = base58CheckDecode(prefix.edpk, state.wallet.publicKey || '');
    const privateKey = base58CheckDecode(prefix.edsk32, state.wallet.secretKey || '');
    // @TODO: add all watermarks
    // ed25516
    const sig = sodium.crypto_sign_detached(sodium.crypto_generichash(32, concatKeys(new Uint8Array([3]), operation)), concatKeys(privateKey, publicKey), 'uint8array');
    const signature = bs58checkEncode(prefix.edsig, sig);
    // build signed operation
    const signedOperationContents = state.operation + sodium.to_hex(sig);
    const operationHash = bs58checkEncode(prefix.operation, 
    // blake2b
    sodium.crypto_generichash(32, sodium.from_hex(signedOperationContents)));
    // add signed operation to state
    return of(state).pipe(map(state => (Object.assign(Object.assign({}, state), { signOperation: {
            signature: signature,
            signedOperationContents: signedOperationContents,
            operationHash: operationHash
        } }))));
}
;
/**
 * Sign operation using hardware Trezor wallet
 * @param state transaction state
 * @throws Typerror when operation is not available
 */
export function signOperationTrezor(state) {
    if (!Array.isArray(state.operations)) {
        throw new TypeError('[signOperationTrezor] Operations not available in state');
    }
    // set basic config
    let message = {
        path: state.wallet.path || '',
        branch: state.head.hash,
        operation: {}
    };
    // add operations to message
    state.operations.map((operation) => {
        console.log('[+][signOperationTrezor] operation', operation);
        switch (operation.kind) {
            case 'reveal': {
                validateRevealOperation(operation);
                // add reveal to operation
                message.operation.reveal = {
                    source: operation.source,
                    public_key: operation.public_key,
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit)
                };
                break;
            }
            case 'transaction': {
                validateTransactionOperation(operation);
                console.log('[signOperation] transaction: ', operation);
                // add transaction to operation
                message.operation.transaction = {
                    source: operation.source,
                    destination: operation.destination,
                    amount: parseInt(operation.amount),
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit)
                };
                // app params for manager smart contract management
                if (operation.parameters_manager) {
                    const parameters_manager = operation.parameters_manager;
                    // add parameters for transfer
                    if (parameters_manager.transfer) {
                        message.operation.transaction.parameters_manager = {
                            transfer: {
                                destination: parameters_manager.transfer.destination,
                                amount: parseAmount(parameters_manager.transfer.amount.toString())
                            }
                        };
                    }
                    // add parameters to set delegate
                    if (parameters_manager.set_delegate) {
                        message.operation.transaction.parameters_manager = {
                            set_delegate: parameters_manager.set_delegate,
                        };
                    }
                    // add parameters to cancel delegation
                    if (parameters_manager.cancel_delegate) {
                        message.operation.transaction.parameters_manager = {
                            cancel_delegate: true,
                        };
                    }
                }
                break;
            }
            case 'origination': {
                validateOriginationOperation(operation);
                // add origination to operation
                message.operation.origination = {
                    source: operation.source,
                    balance: parseInt(operation.balance),
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit),
                };
                break;
            }
            case 'delegation': {
                // no validation as no special properties are required
                // add delegation to operation
                message.operation.delegation = {
                    source: operation.source,
                    delegate: !operation.delegate ? operation.source : operation.delegate,
                    fee: parseInt(operation.fee),
                    counter: parseInt(operation.counter),
                    gas_limit: parseInt(operation.gas_limit),
                    storage_limit: parseInt(operation.storage_limit)
                };
                break;
            }
            default: {
                throw new TypeError(`[signOperationTrezor] Unknown operation type "${operation.kind}". Cannot proceed.`);
            }
        }
    });
    return of(state).pipe(tap(() => console.warn('[TrezorConnect][signOperationTrezor] message', JSON.stringify(message))), 
    // wait for response from Trezor
    flatMap(() => window.TrezorConnect.tezosSignTransaction(message)), 
    //  handle error from Trezor
    flatMap((response) => {
        // error on invalid response
        if (response.payload.error) {
            // throw error
            return throwError({ response: [Object.assign({ TrezorConnect: 'tezosSignTransaction' }, response.payload)] });
        }
        return of(response);
    }), tap((response) => { console.warn('[TrezorConnect][tezosSignTransaction] response', response.payload); }), map(response => (Object.assign(Object.assign({}, state), { signOperation: {
            signature: response.payload.signature,
            signedOperationContents: response.payload.sig_op_contents,
            operationHash: response.payload.operation_hash,
        } }))));
}
/**
 * Sign operation using hardware Ledger wallet
 * @param state transaction state
 * @throws TypeError when operation is not available
 */
export function signLedgerOperation(state) {
    return from(new LedgerUtils().requestLedgerSignature(state.operation, state.ledger.transportHolder)).pipe(map(signature => ({
        signature: bs58checkEncode(prefix.edsig, Buffer.from(signature, 'hex')),
        signedOperationContents: state.operation + signature,
        operationHash: bs58checkEncode(prefix.operation, 
        // blake2b
        sodium.crypto_generichash(32, sodium.from_hex(state.operation + signature))),
    })), map(signOperation => (Object.assign(Object.assign({}, state), { signOperation }))));
}
//# sourceMappingURL=signOperation.js.map