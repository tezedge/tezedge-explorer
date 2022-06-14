import { FeatureAction } from '@shared/types/shared/store/feature-action.type';

export enum MonitoringActionTypes {
  MONITORING_LOAD = 'MONITORING_LOAD',
  MONITORING_WEBSOCKET_INIT = 'MONITORING_WEBSOCKET_INIT',
  MONITORING_WEBSOCKET_LOAD = 'MONITORING_WEBSOCKET_LOAD',
  MONITORING_WEBSOCKET_HISTORY_LOAD_SUCCESS = 'MONITORING_WEBSOCKET_HISTORY_LOAD_SUCCESS',
  MONITORING_OCTEZ_STATS_LOAD = 'MONITORING_OCTEZ_STATS_LOAD',
  MONITORING_OCTEZ_STATS_LOAD_SUCCESS = 'MONITORING_OCTEZ_STATS_LOAD_SUCCESS',
  MONITORING_OCTEZ_PEERS_LOAD = 'MONITORING_OCTEZ_PEERS_LOAD',
  MONITORING_OCTEZ_PEERS_LOAD_SUCCESS = 'MONITORING_OCTEZ_PEERS_LOAD_SUCCESS',
  MONITORING_CLOSE = 'MONITORING_CLOSE',
}

export const MONITORING_LOAD = MonitoringActionTypes.MONITORING_LOAD;
export const MONITORING_WEBSOCKET_INIT = MonitoringActionTypes.MONITORING_WEBSOCKET_INIT;
export const MONITORING_WEBSOCKET_LOAD = MonitoringActionTypes.MONITORING_WEBSOCKET_LOAD;
export const MONITORING_WEBSOCKET_HISTORY_LOAD_SUCCESS = MonitoringActionTypes.MONITORING_WEBSOCKET_HISTORY_LOAD_SUCCESS;
export const MONITORING_OCTEZ_STATS_LOAD = MonitoringActionTypes.MONITORING_OCTEZ_STATS_LOAD;
export const MONITORING_OCTEZ_STATS_LOAD_SUCCESS = MonitoringActionTypes.MONITORING_OCTEZ_STATS_LOAD_SUCCESS;
export const MONITORING_OCTEZ_PEERS_LOAD = MonitoringActionTypes.MONITORING_OCTEZ_PEERS_LOAD;
export const MONITORING_OCTEZ_PEERS_LOAD_SUCCESS = MonitoringActionTypes.MONITORING_OCTEZ_PEERS_LOAD_SUCCESS;
export const MONITORING_CLOSE = MonitoringActionTypes.MONITORING_CLOSE;


interface MonitoringAction extends FeatureAction<MonitoringActionTypes> {
  readonly type: MonitoringActionTypes;
}

export class MonitoringLoad implements MonitoringAction {
  readonly type = MONITORING_LOAD;
}

export class MonitoringWebsocketInit implements MonitoringAction {
  readonly type = MONITORING_WEBSOCKET_INIT;
}

export class MonitoringWebsocketLoad implements MonitoringAction {
  readonly type = MONITORING_WEBSOCKET_LOAD;
}

export class MonitoringWebsocketHistoryLoadSuccess implements MonitoringAction {
  readonly type = MONITORING_WEBSOCKET_HISTORY_LOAD_SUCCESS;

  constructor(public payload: { history: any, stats: any, peers: any }) { }
}

export class MonitoringOctezStatsLoad implements MonitoringAction {
  readonly type = MONITORING_OCTEZ_STATS_LOAD;
}

export class MonitoringOctezStatsLoadSuccess implements MonitoringAction {
  readonly type = MONITORING_OCTEZ_STATS_LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class MonitoringOctezPeersLoad implements MonitoringAction {
  readonly type = MONITORING_OCTEZ_PEERS_LOAD;
}

export class MonitoringOctezPeersLoadSuccess implements MonitoringAction {
  readonly type = MONITORING_OCTEZ_PEERS_LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class MonitoringClose implements MonitoringAction {
  readonly type = MONITORING_CLOSE;
}

export type MonitoringActions =
  | MonitoringLoad
  | MonitoringWebsocketInit
  | MonitoringWebsocketLoad
  | MonitoringWebsocketHistoryLoadSuccess
  | MonitoringOctezStatsLoad
  | MonitoringOctezStatsLoadSuccess
  | MonitoringOctezPeersLoad
  | MonitoringOctezPeersLoadSuccess
  | MonitoringClose
  ;
