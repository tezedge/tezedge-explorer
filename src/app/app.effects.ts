import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, defer } from 'rxjs';
import { tap, map, switchMap, catchError, withLatestFrom, delay, filter } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

import { environment } from '../environments/environment';

@Injectable()
export class AppEffects {

    // effect to handle subscription to metrics WS
    @Effect()
    MetriscsSubscirbeEffect$ = this.actions$.pipe(
        ofType('METRICS_SUBSCRIBE'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // connect to ws
        switchMap(({ action, state }) => {
            // console.log('[SETTINGS_INIT_SUSCCESS]', action, state);
            return webSocket(state.settings.endpoint).pipe(
                filter((ws: any) => {
                    // console.log('[ws]', ws);
                    return ws.type === '' ? true : false;
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