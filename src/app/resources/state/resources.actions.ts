import { Action } from '@ngrx/store';
import { Resource } from '../models/resource';

export enum ResourcesActionTypes {
  LoadResources = 'RESOURCES_STATS_LOAD',
  ResourcesLoadSuccess = 'RESOURCES_STATS_SUCCESS',
  ResourcesLoadError = 'RESOURCES_STATS_ERROR',
  ResourcesClose = 'RESOURCES_STATS_CLOSE'
}

export class LoadResources implements Action {
  readonly type = ResourcesActionTypes.LoadResources;
}

export class ResourcesLoaded implements Action {
  readonly type = ResourcesActionTypes.ResourcesLoadSuccess;

  constructor(public payload: Resource[]) { }
}

export type ResourcesActions = LoadResources | ResourcesLoaded;
