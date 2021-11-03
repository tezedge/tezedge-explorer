import { Action } from '@ngrx/store';
import { LogsActionEntity } from '@shared/types/logs/logs-action-entity.type';

enum LogsActionActionTypes {
  LOGS_ACTION_START_SUCCESS = 'LOGS_ACTION_START_SUCCESS',
  LOGS_ACTION_LOAD_SUCCESS = 'LOGS_ACTION_LOAD_SUCCESS',
  LOGS_ACTION_TIME_LOAD = 'LOGS_ACTION_TIME_LOAD',
  LOGS_ACTION_FILTER = 'LOGS_ACTION_FILTER',
  LOGS_ACTION_START = 'LOGS_ACTION_START',
  LOGS_ACTION_RESET = 'LOGS_ACTION_RESET',
  LOGS_ACTION_LOAD = 'LOGS_ACTION_LOAD',
  LOGS_ACTION_STOP = 'LOGS_ACTION_STOP',
}

export const LOGS_ACTION_START_SUCCESS = LogsActionActionTypes.LOGS_ACTION_START_SUCCESS;
export const LOGS_ACTION_LOAD_SUCCESS = LogsActionActionTypes.LOGS_ACTION_LOAD_SUCCESS;
export const LOGS_ACTION_TIME_LOAD = LogsActionActionTypes.LOGS_ACTION_TIME_LOAD;
export const LOGS_ACTION_FILTER = LogsActionActionTypes.LOGS_ACTION_FILTER;
export const LOGS_ACTION_START = LogsActionActionTypes.LOGS_ACTION_START;
export const LOGS_ACTION_RESET = LogsActionActionTypes.LOGS_ACTION_RESET;
export const LOGS_ACTION_LOAD = LogsActionActionTypes.LOGS_ACTION_LOAD;
export const LOGS_ACTION_STOP = LogsActionActionTypes.LOGS_ACTION_STOP;


export class LogsActionStart implements Action {
  readonly type = LOGS_ACTION_START;

  constructor(public payload: { limit?: number }) { }
}

export class LogsActionReset implements Action {
  readonly type = LOGS_ACTION_RESET;
}

export class LogsActionStop implements Action {
  readonly type = LOGS_ACTION_STOP;
}

export class LogsActionFilter implements Action {
  readonly type = LOGS_ACTION_FILTER;

  constructor(public payload: { filterType: string }) { }
}

export class LogsActionLoad implements Action {
  readonly type = LOGS_ACTION_LOAD;

  constructor(public payload: { cursor_id?: number, limit?: number, query?: string }) { }
}

export class LogsActionTimeLoad implements Action {
  readonly type = LOGS_ACTION_TIME_LOAD;

  constructor(public payload: { filterType: string, timestamp: number, limit?: number }) { }
}

export class LogsActionStartSuccess implements Action {
  readonly type = LOGS_ACTION_START_SUCCESS;

  constructor(public payload: { logs: LogsActionEntity[] }) { }
}

export class LogsActionLoadSuccess implements Action {
  readonly type = LOGS_ACTION_LOAD_SUCCESS;

  constructor(public payload: { logs: LogsActionEntity[], timestamp: number }) { }
}

export type LogsActionTypes = LogsActionStart
  | LogsActionReset
  | LogsActionLoad
  | LogsActionStop
  | LogsActionFilter
  | LogsActionTimeLoad
  | LogsActionStartSuccess
  | LogsActionLoadSuccess
  ;
