import { Action } from '@ngrx/store';

enum MempoolBroadcastActionTypes {
  MEMPOOL_BROADCAST_LOAD = 'MEMPOOL_BROADCAST_LOAD',
  MEMPOOL_BROADCAST_LOAD_SUCCESS = 'MEMPOOL_BROADCAST_LOAD_SUCCESS',
  MEMPOOL_BROADCAST_STOP = 'MEMPOOL_BROADCAST_STOP'
}

export const MEMPOOL_BROADCAST_LOAD = MempoolBroadcastActionTypes.MEMPOOL_BROADCAST_LOAD;
export const MEMPOOL_BROADCAST_LOAD_SUCCESS = MempoolBroadcastActionTypes.MEMPOOL_BROADCAST_LOAD_SUCCESS;
export const MEMPOOL_BROADCAST_STOP = MempoolBroadcastActionTypes.MEMPOOL_BROADCAST_STOP;

export class MempoolBroadcastLoad implements Action {
  readonly type = MEMPOOL_BROADCAST_LOAD;
}

export class MempoolBroadcastLoadSuccess implements Action {
  readonly type = MEMPOOL_BROADCAST_LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class MempoolBroadcastStop implements Action {
  readonly type = MEMPOOL_BROADCAST_STOP;
}

export type MempoolBroadcastActions = MempoolBroadcastLoad
  | MempoolBroadcastLoadSuccess
  | MempoolBroadcastStop
  ;
