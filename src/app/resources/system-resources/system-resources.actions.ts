import { Action } from '@ngrx/store';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';

export enum SystemResourcesActionTypes {
  SYSTEM_RESOURCES_LOAD = 'SYSTEM_RESOURCES_LOAD',
  SYSTEM_RESOURCES_LOAD_SUCCESS = 'SYSTEM_RESOURCES_LOAD_SUCCESS',
  SYSTEM_RESOURCES_CLOSE = 'SYSTEM_RESOURCES_CLOSE'
}

export class SystemLoadResources implements Action {
  readonly type = SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD;

  constructor(public payload: { isSmallDevice: boolean }) { }
}

export class SystemResourcesLoaded implements Action {
  readonly type = SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: SystemResources) { }
}

export type SystemResourcesActions = SystemLoadResources | SystemResourcesLoaded;
