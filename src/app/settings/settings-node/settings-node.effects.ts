import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, catchError, withLatestFrom, flatMap } from 'rxjs/operators';

@Injectable()
export class SettingsNodeEffects {

    @Effect()
    SettingsNodeInitEffect$ = this.actions$.pipe(
        ofType('SETTINGS_NODE_LOAD', 'SETTINGS_NODE_CHANGE'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // create observable from every item in list 
        flatMap(({ action, state }) => {

            // get api settings from localstorage 
            // const settingsNode: any = localStorage.getItem('settingsNode') ? localStorage.getItem('settingsNode') : api.ws;
            // console.log('[SETTINGS_NODE_LOAD][effect][settingsNode]',  settingsNode);

            return state.settingsNode.ids.map(id => state.settingsNode.entities[id]);
        }),

        // chekc if api is available    
        flatMap((node: any) => {
            // call node
            return this.http.get(node.http + '/chains/main/blocks/head/header').pipe(
                // dispatch action
                map((response) => ({ type: 'SETTINGS_NODE_LOAD_SUSCCESS', payload: { node: node, response: response } })),
                // dispatch error 
                catchError((error) => of({ type: 'SETTINGS_NODE_LOAD_ERROR', payload: { node: node, response: error } })),
            )
        }),

    )

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
