"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLedgerWallet = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
require("babel-polyfill");
const ledger_1 = require("../common/ledger");
exports.getLedgerWallet = (selector) => (source) => source.pipe(operators_1.switchMap(state => {
    const transportHolder = selector(state);
    return rxjs_1.from(new ledger_1.LedgerUtils().getAddress(transportHolder)).pipe(operators_1.map(ledgerState => (Object.assign(Object.assign({}, state), { ledger: ledgerState }))));
}));
//# sourceMappingURL=getLedgerWallet.js.map