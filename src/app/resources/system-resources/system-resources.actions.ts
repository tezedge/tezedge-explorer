import { SystemResourcesState } from '@shared/types/resources/system/system-resources-state.type';
import { SystemResourcesResourceType, SystemResourcesSortBy } from '@shared/types/resources/system/system-resources-panel.type';
import { FeatureAction } from '@shared/types/shared/store/feature-action.type';

enum SystemResourcesActionTypes {
  SYSTEM_RESOURCES_LOAD = 'SYSTEM_RESOURCES_LOAD',
  SYSTEM_RESOURCES_LOAD_SUCCESS = 'SYSTEM_RESOURCES_LOAD_SUCCESS',
  SYSTEM_RESOURCES_DETAILS_UPDATE = 'SYSTEM_RESOURCES_DETAILS_UPDATE',
  SYSTEM_RESOURCES_SORT = 'SYSTEM_RESOURCES_SORT',
  SYSTEM_RESOURCES_CLOSE = 'SYSTEM_RESOURCES_CLOSE'
}

export const SYSTEM_RESOURCES_LOAD = SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD;
export const SYSTEM_RESOURCES_LOAD_SUCCESS = SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS;
export const SYSTEM_RESOURCES_DETAILS_UPDATE = SystemResourcesActionTypes.SYSTEM_RESOURCES_DETAILS_UPDATE;
export const SYSTEM_RESOURCES_SORT = SystemResourcesActionTypes.SYSTEM_RESOURCES_SORT;
export const SYSTEM_RESOURCES_CLOSE = SystemResourcesActionTypes.SYSTEM_RESOURCES_CLOSE;

interface SystemResourcesAction extends FeatureAction<SystemResourcesActionTypes> {
  readonly type: SystemResourcesActionTypes;
}

export class SystemResourcesLoadAction implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_LOAD;

  constructor(public payload: { isSmallDevice: boolean }) { }
}

export class SystemResourcesDetailsUpdateAction implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_DETAILS_UPDATE;

  constructor(public payload: { type: 'recently' | 'runnerGroups', resourceType: SystemResourcesResourceType, timestamp: string }) { }
}

export class SystemResourcesLoadedAction implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: SystemResourcesState) { }
}

export class SystemResourcesSortAction implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_SORT;

  constructor(public payload: { sortBy: SystemResourcesSortBy }) { }
}

export class SystemResourcesCloseAction implements SystemResourcesAction {
  readonly type = SYSTEM_RESOURCES_CLOSE;
}

export type SystemResourcesActions = SystemResourcesLoadAction
  | SystemResourcesLoadedAction
  | SystemResourcesDetailsUpdateAction
  | SystemResourcesCloseAction
  | SystemResourcesSortAction
  ;
