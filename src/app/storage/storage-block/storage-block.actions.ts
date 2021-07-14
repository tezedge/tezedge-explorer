import { Action } from '@ngrx/store';

export enum StorageBlockActionTypes {
  STORAGE_BLOCK_MAP_AVAILABLE_CONTEXTS = 'STORAGE_BLOCK_MAP_AVAILABLE_CONTEXTS',
  STORAGE_BLOCK_CHECK_AVAILABLE_CONTEXTS = 'STORAGE_BLOCK_CHECK_AVAILABLE_CONTEXTS',
}

export class MapAvailableContexts implements Action {
  readonly type = StorageBlockActionTypes.STORAGE_BLOCK_MAP_AVAILABLE_CONTEXTS;

  constructor(public payload: string[]) { }
}

export type StorageBlockActions = MapAvailableContexts;
