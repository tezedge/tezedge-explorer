"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpc = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ajax_1 = require("rxjs/ajax");
/**
 * Remote procedure call (RPC) on tezos node
 * Returns state object with rpc result under property defined in rpc parameters
 *
 * @param selector method returning rpc parameters
 *
 * @throws RpcError
 */
exports.rpc = (selector) => (source) => source.pipe(
//exec callback function
operators_1.map(state => (Object.assign(Object.assign({}, state), { rpc: selector(state) }))), operators_1.flatMap((state) => {
    if (!state.rpc.payload && state.ws && state.ws.webSocket && !state.ws.webSocket.closed) {
        const id = Math.floor(Math.random() * 1000000000000);
        const body = state.rpc.payload ? { params: { body: state.rpc.payload } } : undefined;
        state.ws.webSocket.next(Object.assign({ jsonrpc: '2.0', method: state.rpc.url, id }, body));
        return state.ws.webSocket.asObservable().pipe(operators_1.filter(response => response.id === id), operators_1.map(response => (Object.assign(Object.assign({}, state), { [state.rpc.path]: response.result }))));
    }
    return state.rpc.payload !== undefined ?
        // post
        ajax_1.ajax.post(state.wallet.node.url + state.rpc.url, state.rpc.payload, { 'Content-Type': 'application/json' }).pipe(
        // without response do not run it
        // filter(event => event.response),
        // use only response
        operators_1.map(event => (Object.assign(Object.assign({}, state), { [state.rpc.path]: event.response }))), 
        // catchError
        operators_1.catchError(error => {
            console.warn('[-] [rpc][ajax.post][request] url: ', error.request.url);
            console.warn('[-] [rpc][ajax.post][request] body: ', error.request.body);
            console.warn('[-] [rpc][ajax.post][response] error: ', error.status, error.response);
            return rxjs_1.throwError(Object.assign(Object.assign({}, error), { state }));
        }))
        :
            // get
            ajax_1.ajax.get(state.wallet.node.url + state.rpc.url, { 'Content-Type': 'application/json' }).pipe(
            // without response do not run it
            // filter(event => event.response),
            // use only response
            operators_1.map(event => (Object.assign(Object.assign({}, state), { [state.rpc.path]: event.response }))), 
            // catchError
            operators_1.catchError(error => {
                console.warn('[-] [rpc][ajax.get][request] url: ', error.request.url);
                console.warn('[-] [rpc][ajax.get][response] error: ', error.status, error.response);
                return rxjs_1.throwError(Object.assign(Object.assign({}, error), { state }));
            }));
}));
//# sourceMappingURL=rpc.js.map