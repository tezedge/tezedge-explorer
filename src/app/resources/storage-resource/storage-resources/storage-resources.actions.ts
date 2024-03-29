import { Action } from '@ngrx/store';
import { StorageResourcesStats } from '@shared/types/resources/storage/storage-resources-stats.type';

export enum StorageResourcesActionTypes {
  STORAGE_RESOURCES_LOAD = 'STORAGE_RESOURCES_LOAD',
  STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS = 'STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS',
  STORAGE_RESOURCES_CHECK_AVAILABLE_CONTEXTS = 'STORAGE_RESOURCES_CHECK_AVAILABLE_CONTEXTS',
  STORAGE_RESOURCES_LOAD_SUCCESS = 'STORAGE_RESOURCES_LOAD_SUCCESS',
  STORAGE_RESOURCES_CLOSE = 'STORAGE_RESOURCES_CLOSE',
}

export class LoadStorageResources implements Action {
  readonly type = StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD;

  constructor(public payload: { context: string, protocol?: string }) { }
}

export class StorageResourcesLoaded implements Action {
  readonly type = StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: StorageResourcesStats) { }
}

export class MapAvailableContexts implements Action {
  readonly type = StorageResourcesActionTypes.STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS;

  constructor(public payload: string[]) { }
}

export class CloseStorageResources implements Action {
  readonly type = StorageResourcesActionTypes.STORAGE_RESOURCES_CLOSE;
}

export type StorageResourcesActions = LoadStorageResources
  | StorageResourcesLoaded
  | MapAvailableContexts
  | CloseStorageResources
  ;
