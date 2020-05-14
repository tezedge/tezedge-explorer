import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, defer, Subject } from 'rxjs';
import { tap, map, switchMap, catchError, withLatestFrom, delay, filter, takeUntil } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

const onDestroy$ = new Subject();
let wsCounter = 0;

@Injectable()
export class AppEffects {

    // effect to handle subscription to metrics WS
    @Effect()
    MetriscsSubscirbeEffect$ = this.actions$.pipe(
        ofType('METRICS_SUBSCRIBE', 'MONITORING_OPEN'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // connect to ws
        switchMap(({ action, state }) => {

            const webSocketConnection$ = (
                webSocket({
                  url: state.settingsNode.api.ws,
                  WebSocketCtor: WebSocket,
                })
            );
            
            // console.log('[SETTINGS_INIT_SUSCCESS]', action, state);
            return webSocketConnection$.pipe(
                takeUntil(onDestroy$),
                filter((ws: any) => {
                    // even if ws is turned off update state cca every minute
                    wsCounter = wsCounter < 700 ? wsCounter + 1 : 0;
                    // console.log('[state.monitoring] open', state.app.monitoring.open, wsCounter);
                    return state.app.monitoring.open || wsCounter < 6;
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
    networkClose$ = this.actions$.pipe(
        ofType('MONITORING_CLOSE'),

        tap(() => {
            console.log('[NETWORK_CLOSE]');
            // generate observables and close websocket
            onDestroy$.next();
            // onDestroy$.complete();

            // close websocket
            // webSocketConnection$.unsubscribe();
        }),

        map((data) => ({ type: 'MONITORING_CLOSE_SUCCESS' })),

        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'MONITORING_CLOSE_ERROR',
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

    // load node settings
    @Effect()
    SettingsNodeLoadEffect$ = this.actions$.pipe(
        ofType('@ngrx/effects/init'),
        map(() => ({ type: 'SETTINGS_NODE_LOAD' }))
    );

    // initialize app features
    @Effect()
    AppInitEffect$ = this.actions$.pipe(
        ofType('APP_INIT'),
        map(() => ({ type: 'APP_INIT_SUCCESS' }))
    );

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}