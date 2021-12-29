import { Action } from '@ngrx/store';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';

enum MempoolBakingRightsActionTypes {
  MEMPOOL_BAKING_RIGHTS_INIT = 'MEMPOOL_BAKING_RIGHTS_INIT',
  MEMPOOL_BAKING_RIGHTS_LOAD = 'MEMPOOL_BAKING_RIGHTS_LOAD',
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS = 'MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS',
  MEMPOOL_BAKING_RIGHTS_SORT = 'MEMPOOL_BAKING_RIGHTS_SORT',
  MEMPOOL_BAKING_RIGHTS_STOP = 'MEMPOOL_BAKING_RIGHTS_STOP',
}

export const MEMPOOL_BAKING_RIGHTS_INIT = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_INIT;
export const MEMPOOL_BAKING_RIGHTS_LOAD = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_LOAD;
export const MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS;
export const MEMPOOL_BAKING_RIGHTS_SORT = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_SORT;
export const MEMPOOL_BAKING_RIGHTS_STOP = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_STOP;


export class MempoolBakingRightsInit implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_INIT;
}

export class MempoolBakingRightsLoad implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_LOAD;
}

export class MempoolBakingRightsLoadSuccess implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS;

  constructor(public payload: Partial<MempoolBakingRightsState>) { }
}

export class MempoolBakingRightsSort implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_SORT;

  constructor(public payload: TableSort) { }
}

export class MempoolBakingRightsStop implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_STOP;
}

export type MempoolBakingRightsActions = MempoolBakingRightsInit
  | MempoolBakingRightsLoad
  | MempoolBakingRightsLoadSuccess
  | MempoolBakingRightsSort
  | MempoolBakingRightsStop
  ;
