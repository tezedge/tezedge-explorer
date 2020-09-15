import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, empty } from 'rxjs';
import { tap, map, switchMap, catchError, withLatestFrom, flatMap } from 'rxjs/operators';

@Injectable()
export class SettingsNodeEffects {

    // check node availability
    @Effect()
    SettingsNodeLoadEffect$ = this.actions$.pipe(
        ofType('SETTINGS_NODE_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // create observable from every item in list
        flatMap(({ action, state }) => {

            // get api settings from localstorage
            // const settingsNode: any = localStorage.getItem('settingsNode') ? localStorage.getItem('settingsNode') : api.ws;
            // console.log('[SETTINGS_NODE_LOAD][effect][settingsNode]',  settingsNode);

            return state.settingsNode.ids.map(id => state.settingsNode.entities[id]);
        }),

        // check if api is available
        flatMap((api: any) => {
            // call node
            return this.http.get(api.http + '/chains/main/blocks/head/header').pipe(
                // dispatch action
                map((response) => ({ type: 'SETTINGS_NODE_LOAD_SUSCCESS', payload: { api: api, response: response } })),
                // dispatch error
                catchError((error) => of({ type: 'SETTINGS_NODE_LOAD_ERROR', payload: { api: api, response: error } })),
            );
        }),

    );

    @Effect()
    SettingsNodeInitEffect$ = this.actions$.pipe(
        ofType('SETTINGS_NODE_LOAD_SUSCCESS', 'SETTINGS_NODE_CHANGE'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        flatMap(({ action, state }) => {

            // dispatch action only for current api
            return action.payload.api.id === state.settingsNode.api.id ?
                of({ type: 'APP_INIT', payload: state.settingsNode.api }) : empty();

        }),
    );

    @Effect()
    SettingsNodeLoadSandboxEffect$ = this.actions$.pipe(
        ofType('SETTINGS_NODE_LOAD_SANDBOX'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // check if api is available
        flatMap(({ action, state }) => {
            const sandbox = state.settingsNode.entities['sandbox-carthage-tezedge'];
            return this.http.get(sandbox.http + '/chains/main/blocks/head/header').pipe(
                // dispatch action
                map((response) => ({ type: 'SETTINGS_NODE_LOAD_SANDBOX_SUCCESS', payload: { api: sandbox, response: response } })),
                // dispatch error
                catchError((error) => of({ type: 'SETTINGS_NODE_LOAD_SANDBOX_ERROR', payload: { api: sandbox, response: error } })),
            );
        }),
    );

    @Effect()
    SettingsNodeSandboxSuccessEffect$ = this.actions$.pipe(
        ofType('SETTINGS_NODE_LOAD_SANDBOX_SUCCESS'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        flatMap(({ action, state }) => {
            return of({ type: 'APP_INIT', payload: state.settingsNode.entities['sandbox-carthage-tezedge'] });
        }),
    );

constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store < any >,
) { }

}
