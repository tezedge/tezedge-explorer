import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, EMPTY, interval, ObservedValueOf, of, Subject, tap, timer } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import { State } from '@app/app.index';
import { SettingsNodeEntityHeader } from '@shared/types/settings-node/settings-node-entity-header.type';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import {
  MONITORING_CLOSE, MONITORING_LOAD, MONITORING_OCTEZ_PEERS_LOAD, MONITORING_OCTEZ_STATS_LOAD,
  MONITORING_WEBSOCKET_INIT, MONITORING_WEBSOCKET_LOAD,
  MonitoringActionTypes,
  MonitoringClose,
  MonitoringLoad, MonitoringWebsocketInit
} from './monitoring.actions';
import { SettingsNodeService } from '@settings/settings-node.service';
import { APP_INIT_SUCCESS, APP_REFRESH } from '@app/app.actions';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';

const WS_MONITORING_ID = 'WS_MONITORING';

@Injectable({ providedIn: 'root' })
export class MonitoringEffects {

  private websocketInterval$: BehaviorSubject<number> = new BehaviorSubject<number>(1000);
  private webSocketConnection$: WebSocketSubject<any>;
  private webSocketDestroy$: Subject<void>;
  private networkDestroy$: Subject<void>;
  private networkInterval$: BehaviorSubject<number> = new BehaviorSubject(1);

  monitoringLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MONITORING_LOAD, APP_REFRESH, APP_INIT_SUCCESS),
    withLatestFrom(this.store, (action: MonitoringLoad | any, state: ObservedValueOf<Store<State>>) => (
      { action, state }
    )),
    filter(({ action, state }) => !!state.settingsNode.activeNode),
    switchMap(({ action, state }) => {

      const isMonitoringPage = window.location.href.endsWith('/monitoring');
      if (isMonitoringPage && action.type === APP_INIT_SUCCESS) {
        return EMPTY;
      }

      const lazyCalls = !isMonitoringPage;
      const actions = [];

      if (this.networkDestroy$) {
        this.networkDestroy$.next(void 0);
        this.networkDestroy$.complete();
      }

      const ws = state.settingsNode.activeNode.features.find(f => f.name === 'ws');
      if (ws && (!this.webSocketConnection$ || this.webSocketConnection$.closed)) {
        this.webSocketDestroy$ = new Subject<void>();
        this.webSocketConnection$ = webSocket({
          url: ws.url + '/rpc',
          WebSocketCtor: WebSocket,
        }) as WebSocketSubject<any>;

        actions.push({ type: MONITORING_WEBSOCKET_LOAD });
        actions.push({ type: MONITORING_WEBSOCKET_INIT });
      }
      if (ws) {
        this.websocketInterval$.next(lazyCalls ? 5000 : 1000);
      } else {
        this.networkDestroy$ = new Subject<void>();
        this.networkInterval$.next(lazyCalls ? 5 : 1);

        actions.push({ type: MONITORING_OCTEZ_STATS_LOAD, payload: { lazyCalls } });
        actions.push({ type: MONITORING_OCTEZ_PEERS_LOAD, payload: { lazyCalls } });

        if (!this.webSocketConnection$ || this.webSocketConnection$.closed) {
          this.webSocketDestroy$.next();
          this.webSocketDestroy$.complete();
          this.webSocketConnection$.complete();
          this.webSocketConnection$.unsubscribe();
        }
      }
      return actions;
    })
  ));

  websocketInit$ = createNonDispatchableEffect(() => this.actions$.pipe(
    ofType(MONITORING_WEBSOCKET_INIT),
    withLatestFrom(this.store, (action: MonitoringWebsocketInit, state: ObservedValueOf<Store<State>>) => (
      { action, state }
    )),
    switchMap(({ action, state }) => {
      return this.websocketInterval$.pipe(
        takeUntil(this.webSocketDestroy$),
        switchMap((duration: number) => timer(0, duration)),
        tap(() => {
          this.webSocketConnection$.next({ jsonrpc: '2.0', method: 'getMonitorStats', id: WS_MONITORING_ID });
        })
      );
    })
  ));

  monitoringCloseEffect$ = createNonDispatchableEffect(() => this.actions$.pipe(
    ofType(MONITORING_CLOSE),
    withLatestFrom(this.store, (action: MonitoringClose, state: ObservedValueOf<Store<State>>) => (
      { action, state }
    )),
    tap(({ action, state }) => {
      if (state.settingsNode.activeNode.features.some(f => f.name === 'ws')) {
        this.websocketInterval$.next(5000);
      } else {
        this.networkInterval$.next(5);
      }
    })
  ));

  // load network stats
  networkStatsLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MONITORING_OCTEZ_STATS_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const headerData$ = this.settingsNodeService.getSettingsHeader(state.settingsNode.activeNode.http)
        .pipe(
          map((response: SettingsNodeEntityHeader) => ({ type: 'NETWORK_STATS_LOAD_SUCCESS', payload: response })),
          catchError(error => of({ type: 'NETWORK_STATS_LOAD_ERROR', payload: error })),
        );

      return this.networkInterval$.pipe(
        switchMap(value => interval(value * 1000)
          .pipe(
            startWith(1),
            takeUntil(this.networkDestroy$)
          )
        ),
        switchMap(() => headerData$)
      );
    }),
  ));

  // load network peers
  networkPeersLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MONITORING_OCTEZ_PEERS_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {

      const peersData$ = this.http.get(state.settingsNode.activeNode.http + '/network/peers').pipe(
        map(response => ({ type: 'NETWORK_PEERS_LOAD_SUCCESS', payload: response })),
        catchError(error => of({ type: 'NETWORK_PEERS_LOAD_ERROR', payload: error })),
      );

      return this.networkInterval$.pipe(
        switchMap(value => interval(value * 1000)
          .pipe(
            startWith(1),
            takeUntil(this.networkDestroy$)
          )
        ),
        switchMap(() => peersData$)
      );
    }),
  ));

  networkWebsocketLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MONITORING_WEBSOCKET_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.webSocketConnection$.pipe(
        filter(response => response.id === WS_MONITORING_ID),
        map(response => response.result.messages)
      )
    ),
    switchMap((wsArrayMessage: { type: string, payload: any }[]) => {
      const historyPayload = {
        blocks: wsArrayMessage.find(m => m.type === 'blockStatus').payload,
        chain: wsArrayMessage.find(m => m.type === 'chainStatus').payload.chain
      };
      const statsPayload = {
        ...wsArrayMessage.find(m => m.type === 'incomingTransfer').payload,
        ...wsArrayMessage.find(m => m.type === 'blockApplicationStatus').payload
      };
      const peersPayload = wsArrayMessage.find(m => m.type === 'peersMetrics').payload;
      return [
        { type: 'WS_NETWORK_HISTORY_LOAD_SUCCESS', payload: historyPayload },
        { type: 'WS_NETWORK_STATS_LOAD_SUCCESS', payload: statsPayload },
        { type: 'WS_NETWORK_PEERS_LOAD_SUCCESS', payload: peersPayload },
      ];
    }),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ADD_ERROR,
        payload: { title: 'Websocket error', message: error.message || 'Connection failed' }
      });
      return caught;
    }),
  ));

  constructor(private http: HttpClient,
              private actions$: Actions,
              private store: Store<State>,
              private settingsNodeService: SettingsNodeService) { }

}
