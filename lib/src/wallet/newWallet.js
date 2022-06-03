"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newWallet = void 0;
const sodium = require("libsodium-wrappers");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const common_1 = require("../common");
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
exports.newWallet = () => (source) => source.pipe(operators_1.flatMap(state => rxjs_1.of({}).pipe(
// sodium must be initialized  
operators_1.concatMap(() => Promise.resolve(sodium.ready)), operators_1.map(() => (Object.assign(Object.assign({}, state), { newWallet: common_1.keys() }))), operators_1.tap(state => {
    console.log(state.newWallet);
}))));
//# sourceMappingURL=newWallet.js.map