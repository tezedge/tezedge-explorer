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

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}