import { Action } from '@ngrx/store';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';

export enum StorageResourcesActionTypes {
  LoadResources = 'STORAGE_RESOURCES_LOAD',
  ResourcesLoadSuccess = 'STORAGE_RESOURCES_LOAD_SUCCESS',
  ResourcesLoadError = 'STORAGE_RESOURCES_LOAD_ERROR',
  ResourcesClose = 'STORAGE_RESOURCES_CLOSE'
}

export class LoadStorageResources implements Action {
  readonly type = StorageResourcesActionTypes.LoadResources;
}

export class StorageResourcesLoaded implements Action {
  readonly type = StorageResourcesActionTypes.ResourcesLoadSuccess;

  constructor(public payload: StorageResourcesStats) { }
}

export type ResourcesStorageActions = LoadStorageResources | StorageResourcesLoaded;
