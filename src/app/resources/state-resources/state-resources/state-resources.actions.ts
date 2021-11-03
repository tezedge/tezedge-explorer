import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';

enum StateResourcesActionTypes {
  STATE_RESOURCES_LOAD = 'STATE_RESOURCES_LOAD',
  STATE_RESOURCES_LOAD_SUCCESS = 'STATE_RESOURCES_LOAD_SUCCESS',
  STATE_RESOURCES_FILTER = 'STATE_RESOURCES_FILTER',
  STATE_RESOURCES_SORT = 'STATE_RESOURCES_SORT',
  STATE_RESOURCES_CLOSE = 'STATE_RESOURCES_CLOSE',
}

export const STATE_RESOURCES_LOAD = StateResourcesActionTypes.STATE_RESOURCES_LOAD;
export const STATE_RESOURCES_LOAD_SUCCESS = StateResourcesActionTypes.STATE_RESOURCES_LOAD_SUCCESS;
export const STATE_RESOURCES_FILTER = StateResourcesActionTypes.STATE_RESOURCES_FILTER;
export const STATE_RESOURCES_SORT = StateResourcesActionTypes.STATE_RESOURCES_SORT;
export const STATE_RESOURCES_CLOSE = StateResourcesActionTypes.STATE_RESOURCES_CLOSE;

interface StateResourcesAction extends FeatureAction<StateResourcesActionTypes> {
  readonly type: StateResourcesActionTypes;
}

export class StateResourcesLoad implements StateResourcesAction {
  readonly type = STATE_RESOURCES_LOAD;
}

export class StateResourcesLoadSuccess implements StateResourcesAction {
  readonly type = STATE_RESOURCES_LOAD_SUCCESS;

  constructor(public payload: StateResourcesActionGroup[]) { }
}

export class StateResourcesSorting implements StateResourcesAction {
  readonly type = STATE_RESOURCES_SORT;

  constructor(public payload: TableSort) { }
}

export class StateResourcesFilter implements StateResourcesAction {
  readonly type = STATE_RESOURCES_FILTER;

  constructor(public payload: string) { }
}

export class StateResourcesClose implements StateResourcesAction {
  readonly type = STATE_RESOURCES_CLOSE;
}

export type StateResourcesActions =
  | StateResourcesLoad
  | StateResourcesLoadSuccess
  | StateResourcesSorting
  | StateResourcesFilter
  | StateResourcesClose
  ;
