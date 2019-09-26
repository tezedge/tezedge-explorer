import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, defer } from 'rxjs';
import { tap, map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { webSocket } from "rxjs/webSocket";

import { environment } from '../environments/environment';

@Injectable()
export class AppEffects {

    // effect to handle subscription to metrics WS
    @Effect()
    MetriscsSubscirbeEffect$ = this.actions$.pipe(
        ofType('SETTINGS_INIT_SUSCCESS'),
        // ofType('@ngrx/effects/init'),

        // ,erge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // connect to ws
        switchMap(({ action, state }) => {
            console.log('[SETTINGS_INIT_SUSCCESS]', state);
            return webSocket(state.settings.endpoint).pipe(
                // tap(data => console.log('[METRICS_SUBSCRIBE][ws] payload: ', data, state.settings.endpoint)),
            )
        }),

        // TODO: handle errors
        // TODO: map ws to redux actions
        // dispatch action from ws 
        map((data) => ({ ...data })),

        // tap(() => console.log('[MetricsSubscribeEffect]')),

        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'METRICS_SUBSCRIBE_ERROR',
                payload: error,
            });
            return caught;
        })
    )

    @Effect({ dispatch: false })
    ZoneDebugEffects$ = this.actions$
        .pipe(
            withLatestFrom(this.store, (action: any, state) => ({ action, state })),
            tap(({ action, state }) => {
                if (NgZone.isInAngularZone() === false) {
                    console.error('[zone][debug]', NgZone.isInAngularZone(), action)
                }
            })
        )

    // initialize app
    @Effect()
    AppInitEffect$$ = defer(() => {
        return of({ type: 'SETTINGS_INIT' })
    });

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}