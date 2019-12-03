import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';
import { webSocket } from "rxjs/webSocket";

import { environment } from '../../environments/environment';

@Injectable()
export class SettingsEffects {

    @Effect()
    SettingsInitEffect$ = this.actions$.pipe(
        ofType('SETTINGS_INIT'),

        switchMap(() => {
            // localStorage.setItem('endpoint', 'wss://babylon.tezedge.com/');
            // get data from localStorage ( sync call)
            const endpoint: any = localStorage.getItem('endpoint') ? localStorage.getItem('endpoint') : environment.api.ws;
            console.log('[SETTINGS_INIT]', endpoint);
            return of([]).pipe(
                map(() => ({ endpoint: endpoint }))
            )
        }),

        // tap((payload) => console.log("[SETTINGS_INIT_SUSCCESS]", payload)),

        // dispatch action
        map((payload) => ({ type: 'SETTINGS_INIT_SUSCCESS', payload: payload })),

        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'SETTINGS_INIT_ERROR',
                payload: error,
            });
            return caught;
        })

    )

    @Effect()
    SettingsEndpointSaveEffect$ = this.actions$.pipe(
        ofType('SETTINGS_ENDPOINT_SAVE'),

        switchMap((action: any) => {

            // save endpoint to localStorage
            localStorage.setItem('endpoint', action.payload.endpoint);
            return of([]).pipe(
                map(() => ({ endpoint: action.payload.endpoint }))
            )
        }),

        // tap((payload) => console.log("[SETTINGS_ENDPOINT_SAVE_SUSCCESS]", payload)),

        // dispatch action
        map((payload) => ({ type: 'SETTINGS_ENDPOINT_SAVE_SUSCCESS', payload: payload })),

        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'SETTINGS_ENDPOINT_SAVE_ERROR',
                payload: error,
            });
            return caught;
        })

    )

    // reconnect trigger metrics subscire 
    @Effect()
    SettingsEndpointSaveSuccesEffect$ = this.actions$.pipe(
        ofType('SETTINGS_ENDPOINT_SAVE'),
        map(() => ({ type: 'METRICS_SUBSCRIBE' }))
    )


    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}