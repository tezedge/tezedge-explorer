import { Action } from '@ngrx/store';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';

export enum SystemResourcesActionTypes {
  LoadResources = 'RESOURCES_LOAD',
  ResourcesLoadSuccess = 'RESOURCES_LOAD_SUCCESS',
  ResourcesLoadError = 'RESOURCES_LOAD_ERROR',
  ResourcesClose = 'RESOURCES_CLOSE'
}

export class SystemLoadResources implements Action {
  readonly type = SystemResourcesActionTypes.LoadResources;

  constructor(public payload: { isSmallDevice: boolean }) { }
}

export class SystemResourcesLoaded implements Action {
  readonly type = SystemResourcesActionTypes.ResourcesLoadSuccess;

  constructor(public payload: SystemResources) { }
}

export type SystemResourcesActions = SystemLoadResources | SystemResourcesLoaded;
