import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, flatMap, switchMap, catchError, filter, tap, takeLast, first, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { initializeWallet, getWallet } from 'tezos-wallet';
import { environment } from 'src/environments/environment';

@Injectable()
export class WalletsEffects {

    @Effect()
    WalletsListInit$ = this.actions$.pipe(
        ofType('WALLETS_LIST_INIT'),
        map(() => {
            // get wallets from localstorage
            const localstorageWallets = JSON.parse(localStorage.getItem('SANDBOX-WALLETS'))
            return localstorageWallets ? localstorageWallets : [];
        }),
        // get current url + hydrate wallets from localstorage
        switchMap(payload => [
            { type: 'HYDRATE_LOCALSTORAGE_WALLETS', payload: payload },
            { type: 'WALLET_LIST_LOAD', payload: payload },
        ])
    );

    // get wallet balance 
    @Effect()
    WalletsListLoad$ = this.actions$.pipe(
        ofType('WALLET_LIST_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),

        // get all accounts address
        flatMap((state: any) => state.wallets.initWallets
            // TODO: temp comment to see changes fast
            // .filter(id =>
            //     // get balance only if last download is older than 3 mins
            //     (new Date().getTime() - state.tezos.tezosWalletList.entities[id].timestamp) < (5 * 60 * 1000) ? false : true
            // )
            .map(initWallet=> ({
                node: state.settingsNode.api,
                detail: initWallet,
            }))
        ),

        // wait for animation to finish
        delay(500),
    
        flatMap((state: any) => of([]).pipe(
            
            // initialize 
            initializeWallet(stateWallet => ({
                publicKeyHash: state.detail.publicKeyHash,
                node: state.node,
                detail: state.detail,
            })),

            // get wallet info
            getWallet(),

            // enter back into zone.js so change detection works
            enterZone(this.zone),
        )),

        map(action => ({ type: 'WALLET_LIST_LOAD_SUCCESS', payload: action })),

        catchError((error, caught) => {
            console.error(error.message)
            this.store.dispatch({
                type: 'WALLET_LIST_LOAD_ERROR',
                payload: error.message,
            });
            return caught;
        }),

    )

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private zone: NgZone
    ) { }

}

export function enterZone(zone) {
    return function enterZoneImplementation(source) {
      return Observable.create(observer => {
        const onNext = (value) => zone.run(() => observer.next(value));
        const onError = (e) => zone.run(() => observer.error(e));
        const onComplete = () => zone.run(() => observer.complete());
        return source.subscribe(onNext, onError, onComplete);
      });
    };
  }