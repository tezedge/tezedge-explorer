import { Action } from '@ngrx/store';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';

enum MempoolBakingRightsActionTypes {
  MEMPOOL_BAKING_RIGHTS_INIT = 'MEMPOOL_BAKING_RIGHTS_INIT',
  MEMPOOL_BAKING_RIGHTS_LOAD = 'MEMPOOL_BAKING_RIGHTS_LOAD',
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS = 'MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS',
  MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD = 'MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD',
  MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD_SUCCESS = 'MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD_SUCCESS',
  MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH = 'MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH',
  MEMPOOL_BAKING_RIGHTS_SORT = 'MEMPOOL_BAKING_RIGHTS_SORT',
  MEMPOOL_BAKING_RIGHTS_STOP = 'MEMPOOL_BAKING_RIGHTS_STOP',
}

export const MEMPOOL_BAKING_RIGHTS_INIT = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_INIT;
export const MEMPOOL_BAKING_RIGHTS_LOAD = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_LOAD;
export const MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS;
export const MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD;
export const MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD_SUCCESS = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD_SUCCESS;
export const MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH;
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

  constructor(public payload: { bakingRights: MempoolBakingRight[] }) { }
}

export class MempoolBakingRightsSort implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_SORT;

  constructor(public payload: TableSort) { }
}

export class MempoolBakingRightsDetailsLoad implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD;
}

export class MempoolBakingRightsDeltaSwitch implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH;
}

export class MempoolBakingRightsDetailsLoadSuccess implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD_SUCCESS;

  constructor(public payload: { details: MempoolBlockDetails[] }) { }
}

export class MempoolBakingRightsStop implements Action {
  readonly type = MEMPOOL_BAKING_RIGHTS_STOP;
}

export type MempoolBakingRightsActions = MempoolBakingRightsInit
  | MempoolBakingRightsLoad
  | MempoolBakingRightsLoadSuccess
  | MempoolBakingRightsDetailsLoad
  | MempoolBakingRightsDetailsLoadSuccess
  | MempoolBakingRightsDeltaSwitch
  | MempoolBakingRightsSort
  | MempoolBakingRightsStop
  ;
