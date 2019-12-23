import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, defer, Subject } from 'rxjs';
import { tap, map, switchMap, catchError, withLatestFrom, delay, filter, takeUntil } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

import { environment } from '../environments/environment';

let onDestroy$ = new Subject()
let wsCounter = 0;
@Injectable()
export class AppEffects {

    // effect to handle subscription to metrics WS
    @Effect()
    MetriscsSubscirbeEffect$ = this.actions$.pipe(
        ofType('METRICS_SUBSCRIBE', 'NETWORKING_OPEN'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // connect to ws
        switchMap(({ action, state }) => {
            // console.log('[SETTINGS_INIT_SUSCCESS]', action, state);
            return webSocket(state.settings.endpoint).pipe(
                takeUntil(onDestroy$),
                filter((ws: any) => {
                    // even if ws is turned off update state cca every minute
                    wsCounter = wsCounter < 70 ? wsCounter + 1 : 0;
                    // console.log('[state.networking] open', state.app.networking.open);
                    return state.app.networking.open || wsCounter < 6;
                })
                // tap(data => console.log('[METRICS_SUBSCRIBE][ws] payload: ', data, state.settings.endpoint)),
            );
        }),

        // TODO: handle errors
        // TODO: map ws to redux actions
        // dispatch action from ws
        map((data) => ({ ...data })),

        // tap(() => console.log('[MetricsSubscribeEffect]')),

        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'METRICS_SUBSCRIBE_ERROR',
                payload: error,
            });
            return caught;
        })
    );

    // close WS
    @Effect()
    NetworkingClose$ = this.actions$.pipe(
        ofType('NETWORKING_CLOSE'),

        tap(() => {
            // generate observables and close websocket
            onDestroy$.next();
            // this.onDestroy$.complete();
        }),

        map((data) => ({ type: 'NETWOKING_CLOSE_SUCCESS' })),

        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'NETWOKING_CLOSE_ERROR',
                payload: error,
            });
            return caught;
        })
    );

    // trigger subscription to webservice
    @Effect()
    MetriscsSubscirbeErrorReconnectEffect$ = this.actions$.pipe(
        ofType('METRICS_SUBSCRIBE_ERROR'),
        // try to reconnect
        delay(1000),
        map(() => ({ type: 'METRICS_SUBSCRIBE' }))
    );

    // trigger subscription to webservice
    @Effect()
    SettingsInitSuccessEffect$ = this.actions$.pipe(
        ofType('SETTINGS_INIT_SUSCCESS'),
        map(() => ({ type: 'METRICS_SUBSCRIBE' }))
    );


    // initialize app
    // @Effect()
    // AppInitEffect$$ = defer(() => {
    //     return of({ type: 'SETTINGS_INIT' });
    // });


    // trigger subscription to webservice
    @Effect()
    AppEffectInit$ = this.actions$.pipe(
        ofType('@ngrx/effects/init'),
        map(() => ({ type: 'SETTINGS_INIT' }))
    );


    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}