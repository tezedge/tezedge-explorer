import { Action } from '@ngrx/store';

export enum MonitoringActionTypes {
  MONITORING_LOAD = 'MONITORING_LOAD',
  MONITORING_CLOSE = 'MONITORING_CLOSE',
}

export class LoadMonitoring implements Action {
  readonly type = MonitoringActionTypes.MONITORING_LOAD;
}

export class CloseMonitoring implements Action {
  readonly type = MonitoringActionTypes.MONITORING_CLOSE;
}

export type MonitoringActions = LoadMonitoring | CloseMonitoring;
