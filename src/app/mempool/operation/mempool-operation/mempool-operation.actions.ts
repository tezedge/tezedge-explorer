import { Action } from '@ngrx/store';

enum MempoolOperationActionTypes {
  MEMPOOL_OPERATION_LOAD = 'MEMPOOL_OPERATION_LOAD',
  MEMPOOL_OPERATION_LOAD_SUCCESS = 'MEMPOOL_OPERATION_LOAD_SUCCESS',
  MEMPOOL_OPERATION_STOP = 'MEMPOOL_OPERATION_STOP'
}

export const MEMPOOL_OPERATION_LOAD = MempoolOperationActionTypes.MEMPOOL_OPERATION_LOAD;
export const MEMPOOL_OPERATION_LOAD_SUCCESS = MempoolOperationActionTypes.MEMPOOL_OPERATION_LOAD_SUCCESS;
export const MEMPOOL_OPERATION_STOP = MempoolOperationActionTypes.MEMPOOL_OPERATION_STOP;

export class MempoolOperationLoad implements Action {
  readonly type = MEMPOOL_OPERATION_LOAD;
}

export class MempoolOperationLoadSuccess implements Action {
  readonly type = MEMPOOL_OPERATION_LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class MempoolOperationStop implements Action {
  readonly type = MEMPOOL_OPERATION_STOP;
}

export type MempoolOperationActions = MempoolOperationLoad
  | MempoolOperationLoadSuccess
  | MempoolOperationStop
  ;
