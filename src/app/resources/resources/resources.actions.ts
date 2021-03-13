import { Action } from '@ngrx/store';
import { Resource } from '../../shared/types/resources/resource.type';

export enum ResourcesActionTypes {
  LoadResources = 'RESOURCES_LOAD',
  ResourcesLoadSuccess = 'RESOURCES_LOAD_SUCCESS',
  ResourcesLoadError = 'RESOURCES_LOAD_ERROR',
  ResourcesClose = 'RESOURCES_CLOSE'
}

export class LoadResources implements Action {
  readonly type = ResourcesActionTypes.LoadResources;

  constructor(public payload: any) { }
}

export class ResourcesLoaded implements Action {
  readonly type = ResourcesActionTypes.ResourcesLoadSuccess;

  constructor(public payload: Resource[]) { }
}

export type ResourcesActions = LoadResources | ResourcesLoaded;
