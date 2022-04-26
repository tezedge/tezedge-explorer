import { TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { FeatureAction } from '@shared/types/shared/store/feature-action.type';

enum MempoolBakingRightsActionTypes {
  MEMPOOL_BAKING_RIGHTS_INIT = 'MEMPOOL_BAKING_RIGHTS_INIT',
  MEMPOOL_BAKING_RIGHTS_LOAD = 'MEMPOOL_BAKING_RIGHTS_LOAD',
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS = 'MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS',
  MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH = 'MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH',
  MEMPOOL_BAKING_RIGHTS_SORT = 'MEMPOOL_BAKING_RIGHTS_SORT',
  MEMPOOL_BAKING_RIGHTS_STOP = 'MEMPOOL_BAKING_RIGHTS_STOP',
  MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE = 'MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE',
  MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND = 'MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND',
}

export const MEMPOOL_BAKING_RIGHTS_INIT = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_INIT;
export const MEMPOOL_BAKING_RIGHTS_LOAD = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_LOAD;
export const MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS;
export const MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH;
export const MEMPOOL_BAKING_RIGHTS_SORT = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_SORT;
export const MEMPOOL_BAKING_RIGHTS_STOP = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_STOP;
export const MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE;
export const MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND = MempoolBakingRightsActionTypes.MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND;


interface MempoolBakingRightAction extends FeatureAction<MempoolBakingRightsActionTypes> {
  readonly type: MempoolBakingRightsActionTypes;
}

export class MempoolBakingRightsInit implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_INIT;
}

export class MempoolBakingRightsLoad implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_LOAD;
}

export class MempoolBakingRightsLoadSuccess implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS;

  constructor(public payload: { bakingRights: MempoolBakingRight[], rounds: MempoolBlockRound[] }) { }
}

export class MempoolBakingRightsSort implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_SORT;

  constructor(public payload: TableSort) { }
}

export class MempoolBakingRightsDeltaSwitch implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH;
}

export class MempoolBakingRightsStop implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_STOP;
}

export class MempoolBakingRightsLastBlockUpdate implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE;

  constructor(public payload: number) { }
}

export class MempoolBakingRightsChangeRound implements MempoolBakingRightAction {
  readonly type = MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND;

  constructor(public payload: number) { }
}

export type MempoolBakingRightsActions = MempoolBakingRightsInit
  | MempoolBakingRightsLoad
  | MempoolBakingRightsLoadSuccess
  | MempoolBakingRightsDeltaSwitch
  | MempoolBakingRightsSort
  | MempoolBakingRightsStop
  | MempoolBakingRightsLastBlockUpdate
  | MempoolBakingRightsChangeRound
  ;
