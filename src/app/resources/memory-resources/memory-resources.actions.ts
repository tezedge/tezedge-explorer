import { Action } from '@ngrx/store';

export enum MemoryResourcesActionTypes {
  MEMORY_RESOURCES_LOAD = 'MEMORY_RESOURCES_LOAD',
  MEMORY_RESOURCES_LOAD_SUCCESS = 'MEMORY_RESOURCES_LOAD_SUCCESS',
  MEMORY_RESOURCES_CLOSE = 'MEMORY_RESOURCES_CLOSE'
}

export class MemoryResourcesLoad implements Action {
  readonly type = MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD;

  constructor(public payload: { reversed: boolean }) { }
}

export class MemoryResourcesLoaded implements Action {
  readonly type = MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: any) { }
}

export class MemoryResourcesClose implements Action {
  readonly type = MemoryResourcesActionTypes.MEMORY_RESOURCES_CLOSE;
}

export type MemoryResourcesActions = MemoryResourcesLoad
  | MemoryResourcesLoaded
  | MemoryResourcesClose
  ;
