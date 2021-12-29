import { Action } from '@ngrx/store';
import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';

enum MempoolBlockApplicationActionTypes {
  MEMPOOL_BLOCK_APPLICATION_LOAD = 'MEMPOOL_BLOCK_APPLICATION_LOAD',
  MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS = 'MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS',
  MEMPOOL_BLOCK_APPLICATION_STOP = 'MEMPOOL_BLOCK_APPLICATION_STOP',
}

export const MEMPOOL_BLOCK_APPLICATION_LOAD = MempoolBlockApplicationActionTypes.MEMPOOL_BLOCK_APPLICATION_LOAD;
export const MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS = MempoolBlockApplicationActionTypes.MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS;
export const MEMPOOL_BLOCK_APPLICATION_STOP = MempoolBlockApplicationActionTypes.MEMPOOL_BLOCK_APPLICATION_STOP;

export class MempoolBlockApplicationLoad implements Action {
  readonly type = MEMPOOL_BLOCK_APPLICATION_LOAD;

  constructor(public payload: { xTicksValuesLength: number }) { }
}

export class MempoolBlockApplicationLoadSuccess implements Action {
  readonly type = MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS;

  constructor(public payload: { chartLines: MempoolBlockApplicationChartLine[] }) { }
}

export class MempoolBlockApplicationStop implements Action {
  readonly type = MEMPOOL_BLOCK_APPLICATION_STOP;
}

export type MempoolBlockApplicationActions = MempoolBlockApplicationLoad
  | MempoolBlockApplicationLoadSuccess
  | MempoolBlockApplicationStop
  ;
