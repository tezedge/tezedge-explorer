import { Action } from '@ngrx/store';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';

export enum StorageResourcesActionTypes {
  LOAD_RESOURCES = 'STORAGE_RESOURCES_LOAD',
  MAP_AVAILABLE_CONTEXTS = 'MAP_AVAILABLE_CONTEXTS',
  CHECK_AVAILABLE_CONTEXTS = 'STORAGE_RESOURCES_CHECK_AVAILABLE_CONTEXTS',
  STORAGE_RESOURCES_LOAD_SUCCESS = 'STORAGE_RESOURCES_LOAD_SUCCESS',
  RESOURCES_LOAD_ERROR = 'STORAGE_RESOURCES_LOAD_ERROR',
}

export class LoadStorageResources implements Action {
  readonly type = StorageResourcesActionTypes.LOAD_RESOURCES;

  constructor(public payload: string) { }
}

export class StorageResourcesLoaded implements Action {
  readonly type = StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: StorageResourcesStats) { }
}

export class MapAvailableContexts implements Action {
  readonly type = StorageResourcesActionTypes.MAP_AVAILABLE_CONTEXTS;

  constructor(public payload: string[]) { }
}

export type StorageResourcesActions = LoadStorageResources | StorageResourcesLoaded | MapAvailableContexts;
