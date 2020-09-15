import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, flatMap, switchMap, catchError, filter, tap, takeLast, first, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { initializeWallet, getWallet, transaction, confirmOperation } from 'tezos-wallet';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class WalletsEffects {

    @Effect()
    WalletsListInit$ = this.actions$.pipe(
        ofType('WALLETS_LIST_INIT'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(state.settingsNode.sandbox + '/wallets');
        }),

        // dispatch action
        switchMap((payload) => [
            { type: 'WALLET_LIST_INIT_SUCCESS', payload: payload },
            { type: 'WALLET_LIST_LOAD' },
        ]),
        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'WALLET_LIST_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    );

    // get wallets (to update ballance)
    @Effect()
    WalletsListLoad$ = this.actions$.pipe(
        ofType('WALLET_LIST_LOAD'),

        // get state from store
        withLatestFrom(this.store, (action, state: any) => state),
        // get all accounts address
        flatMap((state: any) => state.wallets.ids
            // TODO: temp comment to see changes fast
            // .filter(id =>
            //     // get balance only if last download is older than 3 mins
            //     (new Date().getTime() - state.tezos.tezosWalletList.entities[id].timestamp) < (5 * 60 * 1000) ? false : true
            // )
            .map(id => ({
                node: {
                    display: 'Sandbox',
                    name: 'sandbox',
                    // url: 'http://sandbox.dev.tezedge.com:18732', 
                    url: state.settingsNode.api.http, 
                    tzstats: {
                        url: 'https://tzstats.com/',
                        api: 'https://api.tzstats.com/',
                    },
                },
                detail: state.wallets.entities[id],
            }))
        ),

        // wait for animation to finish
        delay(500),
    
        flatMap((state: any) => of([]).pipe(
            // initialize 
            initializeWallet(stateWallet => ({
                publicKeyHash: state.detail.publicKeyHash,
                node: state.node
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

    @Effect()
    TezosOperationTransaction$ = this.actions$.pipe(
        ofType('WALLET_TRANSACTION'),

        // add state to effect
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        flatMap(({ action, state }) => of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                secretKey: state.wallets.entities[state.wallets.selectedWalletId].secretKey,
                publicKey: state.wallets.entities[state.wallets.selectedWalletId].publicKey,
                // for smart contract use manager address
                publicKeyHash: state.wallets.entities[state.wallets.selectedWalletId].publicKeyHash,
                // set tezos node
                node: {
                    display: 'Sandbox',
                    name: 'sandbox',
                    url: 'http://sandbox.dev.tezedge.com:18732', 
                    // url: state.settingsNode.api.http, 
                    tzstats: {
                        url: 'https://tzstats.com/',
                        api: 'https://api.tzstats.com/',
                    },
                },
                // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                type: "web",
                // set HD path for HW wallet
                path: undefined
            })),

            // send xtz 
            transaction(stateWallet => ({
                to: state.wallets.form.to,
                amount: state.wallets.form.amount,
                fee: state.wallets.form.fee,
            })),

            // enter back into zone.js so change detection works
            enterZone(this.zone),

        )),

        // dispatch action based on result
        // map((data: any) => ({
        //     type: 'WALLET_TRANSACTION_SUCCESS',
        //     payload: { injectionOperation: data.injectionOperation }
        // })),
        switchMap((data: any) => [
            { type: 'MEMPOOL_ACTION_LOAD' },
            {
                type: 'WALLET_TRANSACTION_SUCCESS',
                payload: { injectionOperation: data.injectionOperation }
            },
        ]),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'WALLET_TRANSACTION_ERROR',
                payload: error.response,
            });
            return caught;
        }),
        // show success notification
        tap((action) => {
            this.snackBar.open('Transaction added to Mempool', 'DISMISS', {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'right'
            });
        }),
    )

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private zone: NgZone,
        private snackBar: MatSnackBar
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