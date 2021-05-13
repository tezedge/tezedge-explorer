import { Action } from '@ngrx/store';

export enum MemoryResourcesActionTypes {
  LoadResources = 'MEMORY_RESOURCES_LOAD',
  ResourcesLoadSuccess = 'MEMORY_RESOURCES_LOAD_SUCCESS',
  ResourcesLoadError = 'MEMORY_RESOURCES_LOAD_ERROR',
  ResourcesClose = 'MEMORY_RESOURCES_CLOSE'
}

export class LoadMemoryResources implements Action {
  readonly type = MemoryResourcesActionTypes.LoadResources;
}

export class MemoryResourcesLoaded implements Action {
  readonly type = MemoryResourcesActionTypes.ResourcesLoadSuccess;

  constructor(public payload: any) { }
}

export type MemoryResourcesActions = LoadMemoryResources | MemoryResourcesLoaded;
