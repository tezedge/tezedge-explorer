import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { EmbeddedPage } from '@shared/types/embedded/embedded-page.type';

enum EmbeddedActionTypes {
  EMBEDDED_INIT = 'EMBEDDED_INIT',
  EMBEDDED_GET_STATE = 'EMBEDDED_GET_STATE',
  EMBEDDED_GET_STATE_SUCCESS = 'EMBEDDED_GET_STATE_SUCCESS',
  EMBEDDED_CHANGE_STREAM = 'EMBEDDED_CHANGE_STREAM',
  EMBEDDED_CHANGE_PAGE = 'EMBEDDED_CHANGE_PAGE',
  EMBEDDED_STOP = 'EMBEDDED_STOP',
}

export const EMBEDDED_INIT = EmbeddedActionTypes.EMBEDDED_INIT;
export const EMBEDDED_GET_STATE = EmbeddedActionTypes.EMBEDDED_GET_STATE;
export const EMBEDDED_GET_STATE_SUCCESS = EmbeddedActionTypes.EMBEDDED_GET_STATE_SUCCESS;
export const EMBEDDED_CHANGE_STREAM = EmbeddedActionTypes.EMBEDDED_CHANGE_STREAM;
export const EMBEDDED_CHANGE_PAGE = EmbeddedActionTypes.EMBEDDED_CHANGE_PAGE;
export const EMBEDDED_STOP = EmbeddedActionTypes.EMBEDDED_STOP;

export interface EmbeddedAction extends FeatureAction<EmbeddedActionTypes> {
  readonly type: EmbeddedActionTypes;
}

export class EmbeddedInit implements EmbeddedAction {
  readonly type = EMBEDDED_INIT;
}

export class EmbeddedGetState implements EmbeddedAction {
  readonly type = EMBEDDED_GET_STATE;
}

export class EmbeddedGetStateSuccess implements EmbeddedAction {
  readonly type = EMBEDDED_GET_STATE_SUCCESS;

  constructor(public payload: { state: EmbeddedPage }) { }
}

export class EmbeddedChangeStream implements EmbeddedAction {
  readonly type = EMBEDDED_CHANGE_STREAM;

  constructor(public payload: boolean) { }
}

export class EmbeddedChangePage implements EmbeddedAction {
  readonly type = EMBEDDED_CHANGE_PAGE;

  constructor(public payload: number) { }
}

export class EmbeddedStop implements EmbeddedAction {
  readonly type = EMBEDDED_STOP;
}

export type EmbeddedActions =
  | EmbeddedInit
  | EmbeddedGetState
  | EmbeddedGetStateSuccess
  | EmbeddedChangeStream
  | EmbeddedChangePage
  | EmbeddedStop
  ;
