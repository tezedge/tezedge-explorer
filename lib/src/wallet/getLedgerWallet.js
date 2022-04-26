import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import 'babel-polyfill';
import { LedgerUtils } from '../common/ledger';
export const getLedgerWallet = (selector) => (source) => source.pipe(switchMap(state => {
    const transportHolder = selector(state);
    return from(new LedgerUtils().getAddress(transportHolder)).pipe(map(ledgerState => (Object.assign(Object.assign({}, state), { ledger: ledgerState }))));
}));
//# sourceMappingURL=getLedgerWallet.js.map