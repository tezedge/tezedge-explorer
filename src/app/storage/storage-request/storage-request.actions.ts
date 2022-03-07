import { Action } from '@ngrx/store';
import { StorageRequest } from '@shared/types/storage/request/storage-request.type';

enum StorageRequestActionTypes {
  STORAGE_REQUESTS_INIT = 'STORAGE_REQUESTS_INIT',
  STORAGE_REQUESTS_LOAD = 'STORAGE_REQUESTS_LOAD',
  STORAGE_REQUESTS_LOAD_SUCCESS = 'STORAGE_REQUESTS_LOAD_SUCCESS',
  STORAGE_REQUESTS_STOP = 'STORAGE_REQUESTS_STOP',
}

export const STORAGE_REQUESTS_INIT = StorageRequestActionTypes.STORAGE_REQUESTS_INIT;
export const STORAGE_REQUESTS_LOAD = StorageRequestActionTypes.STORAGE_REQUESTS_LOAD;
export const STORAGE_REQUESTS_LOAD_SUCCESS = StorageRequestActionTypes.STORAGE_REQUESTS_LOAD_SUCCESS;
export const STORAGE_REQUESTS_STOP = StorageRequestActionTypes.STORAGE_REQUESTS_STOP;

export class StorageRequestInitAction implements Action {
  readonly type = STORAGE_REQUESTS_INIT;
}

export class StorageRequestLoadAction implements Action {
  readonly type = STORAGE_REQUESTS_LOAD;
}

export class StorageRequestLoadSuccessAction implements Action {
  readonly type = STORAGE_REQUESTS_LOAD_SUCCESS;

  constructor(public payload: StorageRequest[]) { }
}

export class StorageRequestStopAction implements Action {
  readonly type = STORAGE_REQUESTS_STOP;
}

export type StorageRequestAction = StorageRequestInitAction
  | StorageRequestLoadAction
  | StorageRequestLoadSuccessAction
  | StorageRequestStopAction
  ;
