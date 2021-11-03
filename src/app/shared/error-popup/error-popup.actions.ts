import { Action } from '@ngrx/store';
import { HttpError } from '@shared/types/shared/error-popup/http-error.type';

enum ErrorActionTypes {
  ADD_ERROR = 'ADD_ERROR',
  REMOVE_ERROR = 'REMOVE_ERROR',
}

export const ADD_ERROR = ErrorActionTypes.ADD_ERROR;
export const REMOVE_ERROR = ErrorActionTypes.REMOVE_ERROR;

export class ErrorAdd implements Action {
  readonly type = ADD_ERROR;
  initiator?: string;

  constructor(public payload: HttpError) { }
}

export class RemoveErrors implements Action {
  readonly type = REMOVE_ERROR;
}

export type ErrorActions = ErrorAdd | RemoveErrors;
