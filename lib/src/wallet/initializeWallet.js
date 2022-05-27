import * as sodium from 'libsodium-wrappers';
import { flatMap, concatMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
/**
 * Waits for sodium to initialize and prepares wallet for working with it
 * Should be the first step of every workflow
 *
 */
export const initializeWallet = (selector) => (source) => source.pipe(flatMap(state => of({}).pipe(
// wait for sodium to initialize
concatMap(() => Promise.resolve(sodium.ready)), 
// exec callback function and add result state
map(() => ({
    wallet: selector(state)
})), catchError((error) => {
    console.warn('[initializeWallet][sodium] ready', error);
    // this might not work. Why we do not propagate error further?
    // incompatible
    return of(Object.assign(Object.assign({}, state), { error }));
}))));
//# sourceMappingURL=initializeWallet.js.map