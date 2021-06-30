import { Action } from '@ngrx/store';

export enum MemoryResourcesActionTypes {
  MEMORY_RESOURCES_LOAD = 'MEMORY_RESOURCES_LOAD',
  MEMORY_RESOURCES_LOAD_SUCCESS = 'MEMORY_RESOURCES_LOAD_SUCCESS',
  MEMORY_RESOURCES_LOAD_ERROR = 'MEMORY_RESOURCES_LOAD_ERROR',
  MEMORY_RESOURCES_CLOSE = 'MEMORY_RESOURCES_CLOSE'
}

export class LoadMemoryResources implements Action {
  readonly type = MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD;

  constructor(public payload: { reversed: boolean }) { }
}

export class MemoryResourcesLoaded implements Action {
  readonly type = MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export type MemoryResourcesActions = LoadMemoryResources | MemoryResourcesLoaded;
