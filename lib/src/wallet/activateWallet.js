import { map } from "rxjs/operators";
import { operation } from "../operation";
/**
  * Activate generated wallet address
  *
  * @operation activate_account
  * @returns Observable
  */
export const activateWallet = (selector) => (source) => source.pipe(map(state => (Object.assign(Object.assign({}, state), { activateWallet: selector(state) }))), 
// prepare config for operation
map(state => {
    const operations = [];
    operations.push({
        kind: "activate_account",
        pkh: state.wallet.publicKeyHash,
        secret: state.activateWallet.secret
    });
    return Object.assign(Object.assign({}, state), { operations: operations });
}), 
// create operation 
operation());
//# sourceMappingURL=activateWallet.js.map