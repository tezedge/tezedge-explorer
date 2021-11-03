import { Action } from '@ngrx/store';
import { SystemResourcesState } from '@shared/types/resources/system/system-resources-state.type';
import { SystemResourcesResourceType, SystemResourcesSortBy } from '@shared/types/resources/system/system-resources-panel.type';

export enum SystemResourcesActionTypes {
  SYSTEM_RESOURCES_LOAD = 'SYSTEM_RESOURCES_LOAD',
  SYSTEM_RESOURCES_LOAD_SUCCESS = 'SYSTEM_RESOURCES_LOAD_SUCCESS',
  SYSTEM_RESOURCES_DETAILS_UPDATE = 'SYSTEM_RESOURCES_DETAILS_UPDATE',
  SYSTEM_RESOURCES_SORT = 'SYSTEM_RESOURCES_SORT',
  SYSTEM_RESOURCES_CLOSE = 'SYSTEM_RESOURCES_CLOSE'
}

export class SystemResourcesLoadAction implements Action {
  readonly type = SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD;

  constructor(public payload: { isSmallDevice: boolean }) { }
}

export class SystemResourcesDetailsUpdateAction implements Action {
  readonly type = SystemResourcesActionTypes.SYSTEM_RESOURCES_DETAILS_UPDATE;

  constructor(public payload: { type: 'recently' | 'runnerGroups', resourceType: SystemResourcesResourceType, timestamp: string }) { }
}

export class SystemResourcesLoadedAction implements Action {
  readonly type = SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: SystemResourcesState) { }
}

export class SystemResourcesSortAction implements Action {
  readonly type = SystemResourcesActionTypes.SYSTEM_RESOURCES_SORT;

  constructor(public payload: { sortBy: SystemResourcesSortBy }) { }
}

export class SystemResourcesCloseAction implements Action {
  readonly type = SystemResourcesActionTypes.SYSTEM_RESOURCES_CLOSE;
}

export type SystemResourcesActions = SystemResourcesLoadAction
  | SystemResourcesLoadedAction
  | SystemResourcesDetailsUpdateAction
  | SystemResourcesCloseAction
  | SystemResourcesSortAction
  ;
