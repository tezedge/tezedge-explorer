import { Action } from '@ngrx/store';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

enum MempoolStatisticsActionTypes {
  MEMPOOL_STATISTICS_LOAD = 'MEMPOOL_STATISTICS_LOAD',
  MEMPOOL_STATISTICS_LOAD_SUCCESS = 'MEMPOOL_STATISTICS_LOAD_SUCCESS',
  MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION = 'MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION',
  MEMPOOL_STATISTICS_SORT = 'MEMPOOL_STATISTICS_SORT',
  MEMPOOL_STATISTICS_DETAILS_SORT = 'MEMPOOL_STATISTICS_DETAILS_SORT',
  MEMPOOL_STATISTICS_STOP = 'MEMPOOL_STATISTICS_STOP',
}

export const MEMPOOL_STATISTICS_LOAD = MempoolStatisticsActionTypes.MEMPOOL_STATISTICS_LOAD;
export const MEMPOOL_STATISTICS_LOAD_SUCCESS = MempoolStatisticsActionTypes.MEMPOOL_STATISTICS_LOAD_SUCCESS;
export const MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION = MempoolStatisticsActionTypes.MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION;
export const MEMPOOL_STATISTICS_SORT = MempoolStatisticsActionTypes.MEMPOOL_STATISTICS_SORT;
export const MEMPOOL_STATISTICS_DETAILS_SORT = MempoolStatisticsActionTypes.MEMPOOL_STATISTICS_DETAILS_SORT;
export const MEMPOOL_STATISTICS_STOP = MempoolStatisticsActionTypes.MEMPOOL_STATISTICS_STOP;

export class MempoolStatisticsLoad implements Action {
  readonly type = MEMPOOL_STATISTICS_LOAD;

  constructor(public payload: { operationHash: string }) { }
}

export class MempoolStatisticsLoadSuccess implements Action {
  readonly type = MEMPOOL_STATISTICS_LOAD_SUCCESS;

  constructor(public payload: MempoolStatisticsOperation[]) { }
}

export class MempoolStatisticsChangeActiveOperation implements Action {
  readonly type = MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION;

  constructor(public payload: MempoolStatisticsOperation | string) { }
}

export class MempoolStatisticsStop implements Action {
  readonly type = MEMPOOL_STATISTICS_STOP;
}

export class MempoolStatisticsSort implements Action {
  readonly type = MEMPOOL_STATISTICS_SORT;

  constructor(public payload: TableSort) { }
}

export class MempoolStatisticsDetailsSort implements Action {
  readonly type = MEMPOOL_STATISTICS_DETAILS_SORT;

  constructor(public payload: TableSort) { }
}

export type MempoolStatisticsActions = MempoolStatisticsLoad
  | MempoolStatisticsLoadSuccess
  | MempoolStatisticsChangeActiveOperation
  | MempoolStatisticsSort
  | MempoolStatisticsDetailsSort
  | MempoolStatisticsStop
  ;
