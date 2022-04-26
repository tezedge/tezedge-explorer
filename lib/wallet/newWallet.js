import * as sodium from 'libsodium-wrappers';
import { flatMap, concatMap, map, tap } from "rxjs/operators";
import { of } from "rxjs";
import { keys } from '../common';
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export const newWallet = () => (source) => source.pipe(flatMap(state => of({}).pipe(
// sodium must be initialized  
concatMap(() => Promise.resolve(sodium.ready)), map(() => (Object.assign(Object.assign({}, state), { newWallet: keys() }))), tap(state => {
    console.log(state.newWallet);
}))));
//# sourceMappingURL=newWallet.js.map