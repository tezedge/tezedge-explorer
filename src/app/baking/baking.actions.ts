import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { BakingPage } from '@shared/types/baking/baking-page.type';

enum BakingActionTypes {
  BAKING_INIT = 'BAKING_INIT',
  BAKING_GET_STATE = 'BAKING_GET_STATE',
  BAKING_GET_STATE_SUCCESS = 'BAKING_GET_STATE_SUCCESS',
  BAKING_CHANGE_STREAM = 'BAKING_CHANGE_STREAM',
  BAKING_CHANGE_PAGE = 'BAKING_CHANGE_PAGE',
  BAKING_STOP = 'BAKING_STOP',
}

export const BAKING_INIT = BakingActionTypes.BAKING_INIT;
export const BAKING_GET_STATE = BakingActionTypes.BAKING_GET_STATE;
export const BAKING_GET_STATE_SUCCESS = BakingActionTypes.BAKING_GET_STATE_SUCCESS;
export const BAKING_CHANGE_STREAM = BakingActionTypes.BAKING_CHANGE_STREAM;
export const BAKING_CHANGE_PAGE = BakingActionTypes.BAKING_CHANGE_PAGE;
export const BAKING_STOP = BakingActionTypes.BAKING_STOP;

export interface BakingAction extends FeatureAction<BakingActionTypes> {
  readonly type: BakingActionTypes;
}

export class BakingInit implements BakingAction {
  readonly type = BAKING_INIT;
}

export class BakingGetState implements BakingAction {
  readonly type = BAKING_GET_STATE;
}

export class BakingGetStateSuccess implements BakingAction {
  readonly type = BAKING_GET_STATE_SUCCESS;

  constructor(public payload: { state: BakingPage }) { }
}

export class BakingChangeStream implements BakingAction {
  readonly type = BAKING_CHANGE_STREAM;

  constructor(public payload: boolean) { }
}

export class BakingChangePage implements BakingAction {
  readonly type = BAKING_CHANGE_PAGE;

  constructor(public payload: number) { }
}

export class BakingStop implements BakingAction {
  readonly type = BAKING_STOP;
}

export type BakingActions =
  | BakingInit
  | BakingGetState
  | BakingGetStateSuccess
  | BakingChangeStream
  | BakingChangePage
  | BakingStop
  ;
