import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError, tap, filter, takeUntil } from 'rxjs/operators';

@Injectable()
export class SandboxEffects {

    @Effect()
    SandboxNodeStart$ = this.actions$.pipe(
        ofType('SANDBOX_NODE_START'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            console.log('[SANDBOX_NODE_START]', state.settingsNode);
            return this.http.post(state.settingsNode.sandbox + '/start', {
                config_file: "./light_node/etc/tezedge/tezedge.config",
                identity_expected_pow: 0,
                disable_bootstrap_lookup: "",
                network: "sandbox",
                peer_thresh_low: 1,
                peer_thresh_high: 1,
                sandbox_patch_context_json_file: "./light_node/etc/tezedge_sandbox/sandbox-patch-context.json",
                protocol_runner: "./target/release/protocol-runner"
            })
        }),

        // dispatch action
        map((payload) => ({ type: 'SANDBOX_NODE_START_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'SANDBOX_NODE_START_ERROR',
                payload: error,
            });
            return caught;
        })
    );


    @Effect()
    SandboxNodeStop$ = this.actions$.pipe(
        ofType('SANDBOX_NODE_STOP'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            console.log('[SANDBOX_NODE_STOP]', state.settingsNode);
            return this.http.get(state.settingsNode.sandbox + '/stop')
        }),

        // dispatch action
        map((payload) => ({ type: 'SANDBOX_NODE_STOP_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'SANDBOX_NODE_STOP_ERROR',
                payload: error,
            });
            return caught;
        })
    );


    @Effect()
    SandboxWalletInit$ = this.actions$.pipe(
        ofType('SANDBOX_WALLET_INIT'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            console.log('[SANDBOX_WALLET_INIT]', state.settingsNode);
            return this.http.get(state.settingsNode.sandbox + '/init_client')
        }),

        // dispatch action
        map((payload) => ({ type: 'SANDBOX_WALLET_INIT_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'SANDBOX_WALLET_INIT_ERROR',
                payload: error,
            });
            return caught;
        })
    );

    @Effect()
    SandboxActivateProtocol$ = this.actions$.pipe(
        ofType('SANDBOX_ACTIVATE_PROTOCOL'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            console.log('[SANDBOX_ACTIVATE_PROTOCOL]', state.settingsNode);
            return this.http.get(state.settingsNode.sandbox + '/activate_protocol')
        }),

        // dispatch action
        map((payload) => ({ type: 'SANDBOX_ACTIVATE_PROTOCOL_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'SANDBOX_ACTIVATE_PROTOCOL_ERROR',
                payload: error,
            });
            return caught;
        })
    );

    @Effect()
    SandboxBakeBLock$ = this.actions$.pipe(
        ofType('SANDBOX_BAKE_BLOCK'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            console.log('[SANDBOX_BAKE_BLOCK]', state.settingsNode);
            return this.http.get(state.settingsNode.sandbox + '/bake')
        }),

        // dispatch action
        map((payload) => ({ type: 'SANDBOX_BAKE_BLOCK_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'SANDBOX_BAKE_BLOCK_ERROR',
                payload: error,
            });
            return caught;
        })
    );


    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}