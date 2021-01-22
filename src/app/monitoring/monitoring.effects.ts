import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, Subject, empty, timer } from 'rxjs';
import { tap, map, switchMap, catchError, withLatestFrom, filter, takeUntil } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';

const websocketDestroy$ = new Subject();
const networkDestroy$ = new Subject();

let wsCounter = 0;

@Injectable()
export class MonitoringEffects {

    // initialize app features
    @Effect({ dispatch: false })
    MonitoringAppInitEffect$ = this.actions$.pipe(
        ofType('APP_INIT'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            // close all open observables
            networkDestroy$.next();
            websocketDestroy$.next();
        }),
    );

    // initialize app features
    @Effect()
    MonitoringLoadEffect$ = this.actions$.pipe(
        ofType('MONITORING_LOAD'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        switchMap(({ action, state }) => {
            const appFeaturesActions = [];

            // TODO: use app features
            if (state.settingsNode.api.ws === false) {
                appFeaturesActions.push({ type: 'NETWORK_STATS_LOAD' });
                appFeaturesActions.push({ type: 'NETWORK_PEERS_LOAD' });
            } else {
                appFeaturesActions.push({ type: 'NETWORK_WEBSOCKET_LOAD' });
            }

            return appFeaturesActions;
        })
    );


    // initialize app features
    @Effect({ dispatch: false })
    MonitoringCloseEffect$ = this.actions$.pipe(
        ofType('MONITORING_CLOSE'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            // TODO: use app features
            if (state.settingsNode.api.ws === false) {
                // close all open observables
                networkDestroy$.next();
            } else {
                websocketDestroy$.next();
            }
        })
    );

    // load network stats
    @Effect()
    NetworkStatsLoadEffect$ = this.actions$.pipe(
        ofType('NETWORK_STATS_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) =>

            // get header data every second
            timer(0, 1000).pipe(
                takeUntil(networkDestroy$),
                switchMap(() =>
                    this.http.get(state.settingsNode.api.http + '/chains/main/blocks/head/header').pipe(
                        map(response => ({ type: 'NETWORK_STATS_LOAD_SUCCESS', payload: response })),
                        catchError(error => of({ type: 'NETWORK_STATS_LOAD_ERROR', payload: error })),
                    )
                )
            )
        ),
    );

    // load network peers
    @Effect()
    NetworkPeersLoadEffect$ = this.actions$.pipe(
        ofType('NETWORK_PEERS_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) =>

            // get header data every second
            timer(0, 1000).pipe(
                takeUntil(networkDestroy$),
                switchMap(() =>
                    this.http.get(state.settingsNode.api.http + '/network/peers').pipe(
                        map(response => ({ type: 'NETWORK_PEERS_LOAD_SUCCESS', payload: response })),
                        catchError(error => of({ type: 'NETWORK_PEERS_LOAD_ERROR', payload: error })),
                    )
                )
            )
        ),
    );


    // load network websocket
    @Effect()
    NetworkWebsocketLoadEffect$ = this.actions$.pipe(
        ofType('NETWORK_WEBSOCKET_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        // connect to ws
        switchMap(({ action, state }) => {

            // return empty observable
            if (state.settingsNode.api.ws === false) {
                return empty();
            }

            const webSocketConnection$ = (
                webSocket({
                    url: state.settingsNode.api.ws,
                    WebSocketCtor: WebSocket,
                })
            );

            return webSocketConnection$.pipe(
                takeUntil(websocketDestroy$),
                filter((data: any) => {
                    // even if ws is turned off update state cca every minute
                    wsCounter = wsCounter < 700 ? wsCounter + 1 : 0;
                    // console.log('[state.monitoring] open', state.app.monitoring.open, wsCounter, data);
                    return state.monitoring.open || wsCounter < 6;
                })
            );
        }),

        // TODO: handle errors
        // dispatch action from ws
        map((data) => ({ ...data })),

        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'NETWORK_WEBSOCKET_ERROR',
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
