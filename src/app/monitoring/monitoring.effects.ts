import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { empty, of, Subject, timer } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';


let wsCounter = 0;

@Injectable()
export class MonitoringEffects {

    private websocketDestroy$ = null;
    private networkDestroy$ = null;

    // initialize app features
    @Effect({ dispatch: false })
    MonitoringAppInitEffect$ = this.actions$.pipe(
        ofType('APP_INIT'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            // close all open observables
            // this.networkDestroy$.next();
            // this.websocketDestroy$.next();
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
            if (this.networkDestroy$) {
              this.networkDestroy$.next();
            }
            if (this.websocketDestroy$) {
              this.websocketDestroy$.next();
            }
            if (state.settingsNode.api.ws === false) {
              this.networkDestroy$ = new Subject();
              appFeaturesActions.push({ type: 'NETWORK_STATS_LOAD' });
              appFeaturesActions.push({ type: 'NETWORK_PEERS_LOAD' });
            } else {
              this.websocketDestroy$ = new Subject();
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
                this.networkDestroy$.next();
            } else {
                this.websocketDestroy$.next();
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
                takeUntil(this.networkDestroy$),
                switchMap(() => {
                    return this.http.get(state.settingsNode.api.http + '/chains/main/blocks/head/header').pipe(
                      map(response => ({ type: 'NETWORK_STATS_LOAD_SUCCESS', payload: response })),
                      catchError(error => of({ type: 'NETWORK_STATS_LOAD_ERROR', payload: error })),
                    );
                  }
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
                takeUntil(this.networkDestroy$),
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
                takeUntil(this.websocketDestroy$),
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
