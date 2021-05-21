import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, empty, interval, Observable, ObservedValueOf, of, Subject } from 'rxjs';
import { catchError, filter, flatMap, map, switchMap, takeUntil, takeWhile, tap, withLatestFrom } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import { State } from '../app.reducers';
import { SettingsNodeService } from '../settings/settings-node/settings-node.service';
import { SettingsNodeEntityHeader } from '../shared/types/settings-node/settings-node-entity-header.type';

let wsCounter = 0;

@Injectable()
export class MonitoringEffects {

  private websocketDestroy$: Subject<void>;
  private networkDestroy$: Subject<void>;

  private interval$: BehaviorSubject<number> = new BehaviorSubject(1);

  @Effect()
  MonitoringLoadEffect$ = this.actions$.pipe(
    ofType('MONITORING_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const actions = [];
      const initialLoad = action.payload && action.payload.initialLoad;
      const lazyCalls = action.payload && action.payload.lazyCalls;

      if (this.networkDestroy$) {
        this.networkDestroy$.next();
        this.networkDestroy$.complete();
      }
      if (this.websocketDestroy$) {
        this.websocketDestroy$.next();
        this.websocketDestroy$.complete();
      }

      if (state.settingsNode.activeNode.ws) {
        this.websocketDestroy$ = new Subject<void>();
        actions.push({ type: 'NETWORK_WEBSOCKET_LOAD', payload: { initialLoad, lazyCalls } });
      } else {
        if (!initialLoad) {
          this.networkDestroy$ = new Subject<void>();
        }
        this.interval$.next(lazyCalls || initialLoad ? 5 : 1);

        actions.push({ type: 'NETWORK_STATS_LOAD', payload: { initialLoad } });
        actions.push({ type: 'NETWORK_PEERS_LOAD', payload: { initialLoad } });
      }
      return actions;
    })
  );

  // initialize app features
  @Effect()
  MonitoringCloseEffect$ = this.actions$.pipe(
    ofType('MONITORING_CLOSE'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    flatMap(({ action, state }) => {
      // TODO: use app features
      if (state.settingsNode.activeNode.ws === false) {
        // close all open observables
        this.interval$.next(5);
        return empty();
      } else {
        this.websocketDestroy$.next();
        return of({ type: 'NETWORK_WEBSOCKET_LOAD', payload: { lazyCalls: true } });
      }
    })
  );

  // load network stats
  @Effect()
  NetworkStatsLoadEffect$ = this.actions$.pipe(
    ofType('NETWORK_STATS_LOAD'),

    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    switchMap(({ action, state }) => {
      const headerData$ = this.settingsNodeService.getSettingsHeader(state.settingsNode.activeNode.http)
        .pipe(
          map((response: SettingsNodeEntityHeader) => ({ type: 'NETWORK_STATS_LOAD_SUCCESS', payload: response })),
          catchError(error => of({ type: 'NETWORK_STATS_LOAD_ERROR', payload: error })),
        );

      if (action.payload && action.payload.initialLoad) {
        return headerData$;
      }

      return this.interval$.pipe(
        switchMap(value => interval(value * 1000).pipe(takeUntil(this.networkDestroy$))),
        switchMap(() => headerData$)
      );
    }),
  );

  // load network peers
  @Effect()
  NetworkPeersLoadEffect$ = this.actions$.pipe(
    ofType('NETWORK_PEERS_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {

      const peersData$ = this.http.get(state.settingsNode.activeNode.http + '/network/peers').pipe(
        map(response => ({ type: 'NETWORK_PEERS_LOAD_SUCCESS', payload: response })),
        catchError(error => of({ type: 'NETWORK_PEERS_LOAD_ERROR', payload: error })),
      );

      if (action.payload && action.payload.initialLoad) {
        return peersData$;
      }

      return this.interval$.pipe(
        switchMap(value => interval(value * 1000).pipe(takeUntil(this.networkDestroy$))),
        switchMap(() => peersData$)
      );
    }),
  );


  // load network websocket
  @Effect()
  NetworkWebsocketLoadEffect$ = this.actions$.pipe(
    ofType('NETWORK_WEBSOCKET_LOAD'),

    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    // connect to ws
    switchMap(({ action, state }) => {

      // return empty observable
      if (!state.settingsNode.activeNode.ws) {
        return empty();
      }

      const webSocketConnection$ = webSocket({
        url: state.settingsNode.activeNode.ws.toString(),
        WebSocketCtor: WebSocket,
      });

      return webSocketConnection$.pipe(
        takeUntil(this.websocketDestroy$),
        filter((data: any) => {
          // even if ws is turned off update state cca 5 sec
          wsCounter = wsCounter < 25 ? wsCounter + 1 : 0;

          // stop ws when we got all 5 type of data from the backend (this case is only if we are on another route on app start)
          if (action.payload && (action.payload.initialLoad || action.payload.lazyCalls) && wsCounter > 5) {
            return false;
          }
          return state.monitoring.open || wsCounter < 6;
        }),
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
    private store: Store<State>,
    private settingsNodeService: SettingsNodeService,
  ) { }

}
