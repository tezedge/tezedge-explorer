"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const sodium = require("libsodium-wrappers");
const common_1 = require("../common");
const contract_1 = require("../contract");
const operation_1 = require("../operation");
const head_1 = require("../head");
const webSocket_1 = require("rxjs/webSocket");
/**
 * Send amount to another wallet
 *
 * Fully covers send useace and get transaction to blockchain
 * @param selector method returning transaction obejct
 *
 * @operation reveal operation when wallet is not activated yet
 * @operation transaction operation
 *
 * @example
 * of({}).
 * initializeWallet(state => { ...wallet }).
 * transaction(state => ({
 *  amount: "20"
 *  to: "wallet address"
 *  fee: "0.01"
 * })).
 * confirmOperation(state => ({
 *  injectionOperation: state.injectionOperation,
 * })).
 * then(state => console.log('amount transfered'))
 *
 */
exports.transaction = (selector) => (source) => source.pipe(operators_1.map((state) => {
    var _a;
    return (Object.assign(Object.assign({}, state), { ws: Object.assign(Object.assign({}, state.ws), { webSocket: ((_a = state.ws) === null || _a === void 0 ? void 0 : _a.enabled) ? webSocket_1.webSocket({
                url: state.wallet.node.wsUrl,
                WebSocketCtor: state.ws.browserWebSocketCtor,
            })
                : null }), transactions: selector(state) }));
}), 
// get head constants for estimating transaction costs
head_1.constants(), head_1.head(), 
// get contract counter
contract_1.counter(), 
// get contract managerKey
contract_1.managerKey(), 
// display transaction info to console
operators_1.tap(state => {
    // ꜩ  fee:' + state.transaction.fee + ' '
    // console.log(`[+] transaction: ${state.transaction.amount} from "${state.wallet.publicKeyHash}" to "${state.transaction.to}"`);
}), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    state.transactions.forEach((stateTransaction) => {
        const withTestRun = stateTransaction.testRun || false;
        if (state.manager_key === null) {
            if (typeof state.wallet.publicKey === undefined) {
                console.warn(`[transaction] Wallet public key not available!`);
            }
            operations.push({
                kind: 'reveal',
                public_key: state.wallet.publicKey || '',
                source: state.wallet.publicKeyHash,
                fee: common_1.parseAmount(stateTransaction.fee).toString(),
                // extra gas is for safety
                gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : '50000',
                storage_limit: '257',
                counter: (++state.counter).toString(),
            });
        }
        const transaction = {
            kind: 'transaction',
            source: state.wallet.publicKeyHash,
            destination: stateTransaction.to,
            amount: common_1.parseAmount(stateTransaction.amount).toString(),
            fee: common_1.parseAmount(stateTransaction.fee).toString(),
            // extra gas is for safety
            gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : '50000',
            storage_limit: '257',
            counter: (++state.counter).toString(),
        };
        if (stateTransaction.parameters) {
            transaction.parameters = stateTransaction.parameters;
        }
        // add params for smart contract manager
        if (stateTransaction.parameters_manager) {
            const parameters_manager = stateTransaction.parameters_manager;
            // add params for transfer from KT1 -> tz
            if (parameters_manager.transfer) {
                // check for destination and amount params
                if (parameters_manager.transfer.destination && parameters_manager.transfer.amount) {
                    const destination = sodium.to_hex(common_1.publicKeyHash2buffer(parameters_manager.transfer.destination).hash);
                    const amount = common_1.parseAmount(parameters_manager.transfer.amount).toString();
                    // use different parametrs for implicit / smart contract address
                    transaction.parameters =
                        common_1.publicKeyHash2buffer(parameters_manager.transfer.destination).originated ?
                            // smart contract address
                            {
                                'entrypoint': 'do',
                                'value': [{ 'prim': 'DROP' },
                                    { 'prim': 'NIL', 'args': [{ 'prim': 'operation' }] },
                                    {
                                        'prim': 'PUSH',
                                        'args': [{ 'prim': 'address' },
                                            {
                                                'bytes': destination,
                                            }],
                                    },
                                    { 'prim': 'CONTRACT', 'args': [{ 'prim': 'unit' }] },
                                    [{
                                            'prim': 'IF_NONE',
                                            'args': [[[{ 'prim': 'UNIT' }, { 'prim': 'FAILWITH' }]],
                                                []],
                                        }],
                                    {
                                        'prim': 'PUSH',
                                        'args': [{ 'prim': 'mutez' }, { 'int': amount }],
                                    },
                                    { 'prim': 'UNIT' }, { 'prim': 'TRANSFER_TOKENS' },
                                    { 'prim': 'CONS' }],
                            }
                            :
                                // implicit address
                                {
                                    'entrypoint': 'do',
                                    'value': [{ 'prim': 'DROP' },
                                        { 'prim': 'NIL', 'args': [{ 'prim': 'operation' }] },
                                        {
                                            'prim': 'PUSH',
                                            'args': [{ 'prim': 'key_hash' },
                                                {
                                                    'bytes': destination,
                                                }],
                                        },
                                        { 'prim': 'IMPLICIT_ACCOUNT' },
                                        {
                                            'prim': 'PUSH',
                                            'args': [{ 'prim': 'mutez' }, { 'int': amount }],
                                        },
                                        { 'prim': 'UNIT' }, { 'prim': 'TRANSFER_TOKENS' },
                                        { 'prim': 'CONS' }],
                                };
                    console.log('[+] transaction parameres ', transaction.parameters);
                }
            }
            // add params for delegation set
            if (parameters_manager.set_delegate) {
                const delegate = sodium.to_hex(common_1.publicKeyHash2buffer(parameters_manager.set_delegate).hash);
                transaction.parameters = {
                    'entrypoint': 'do',
                    'value': [{ 'prim': 'DROP' },
                        { 'prim': 'NIL', 'args': [{ 'prim': 'operation' }] },
                        {
                            'prim': 'PUSH',
                            'args': [{ 'prim': 'key_hash' },
                                {
                                    'bytes': delegate,
                                }],
                        },
                        { 'prim': 'SOME' },
                        { 'prim': 'SET_DELEGATE' },
                        { 'prim': 'CONS' }],
                };
            }
            // add params for delegation cancel
            if (parameters_manager.hasOwnProperty('cancel_delegate')) {
                transaction.parameters = {
                    'entrypoint': 'do',
                    'value': [{ 'prim': 'DROP' },
                        { 'prim': 'NIL', 'args': [{ 'prim': 'operation' }] },
                        { 'prim': 'NONE', 'args': [{ 'prim': 'key_hash' }] },
                        { 'prim': 'SET_DELEGATE' },
                        { 'prim': 'CONS' }],
                };
            }
        }
        operations.push(transaction);
    });
    return Object.assign(Object.assign({}, state), { operations: operations });
}), 
// run operation on node and calculate its gas consumption and storage size
operators_1.flatMap(state => {
    return (state.transactions[0].testRun ? operation_1.validateOperation() : rxjs_1.of(state));
}), 
// create operation
operation_1.operation(), operators_1.tap((state) => {
    var _a, _b;
    (_b = (_a = state.ws) === null || _a === void 0 ? void 0 : _a.webSocket) === null || _b === void 0 ? void 0 : _b.complete();
}));
function isNodeJs() {
    return !!(typeof module !== 'undefined' && module.exports && typeof require !== 'undefined' && require.resolve);
}
;
//# sourceMappingURL=createTransaction.js.map