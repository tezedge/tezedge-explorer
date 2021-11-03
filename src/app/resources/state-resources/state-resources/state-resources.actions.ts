import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';
import { StateResourcesBlockData } from '@shared/types/resources/state/state-resources-block-data.type';

enum StateResourcesActionTypes {
  STATE_RESOURCES_LOAD = 'STATE_RESOURCES_LOAD',
  STATE_RESOURCES_LOAD_SUCCESS = 'STATE_RESOURCES_LOAD_SUCCESS',
  STATE_RESOURCES_LOAD_BLOCKS = 'STATE_RESOURCES_LOAD_BLOCKS',
  STATE_RESOURCES_LOAD_BLOCKS_SUCCESS = 'STATE_RESOURCES_LOAD_BLOCKS_SUCCESS',
  STATE_RESOURCES_CHANGE_ACTIVE_ROUND = 'STATE_RESOURCES_CHANGE_ACTIVE_ROUND',
  STATE_RESOURCES_NODE_LIFETIME_DATA = 'STATE_RESOURCES_NODE_LIFETIME_DATA',
  STATE_RESOURCES_GROUP_FILTER = 'STATE_RESOURCES_GROUP_FILTER',
  STATE_RESOURCES_SORT = 'STATE_RESOURCES_SORT',
  STATE_RESOURCES_CLOSE = 'STATE_RESOURCES_CLOSE',
}

export const STATE_RESOURCES_LOAD = StateResourcesActionTypes.STATE_RESOURCES_LOAD;
export const STATE_RESOURCES_LOAD_SUCCESS = StateResourcesActionTypes.STATE_RESOURCES_LOAD_SUCCESS;
export const STATE_RESOURCES_LOAD_BLOCKS = StateResourcesActionTypes.STATE_RESOURCES_LOAD_BLOCKS;
export const STATE_RESOURCES_LOAD_BLOCKS_SUCCESS = StateResourcesActionTypes.STATE_RESOURCES_LOAD_BLOCKS_SUCCESS;
export const STATE_RESOURCES_CHANGE_ACTIVE_ROUND = StateResourcesActionTypes.STATE_RESOURCES_CHANGE_ACTIVE_ROUND;
export const STATE_RESOURCES_NODE_LIFETIME_DATA = StateResourcesActionTypes.STATE_RESOURCES_NODE_LIFETIME_DATA;
export const STATE_RESOURCES_GROUP_FILTER = StateResourcesActionTypes.STATE_RESOURCES_GROUP_FILTER;
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

export class StateResourcesLoadBlocks implements StateResourcesAction {
  readonly type = STATE_RESOURCES_LOAD_BLOCKS;

  constructor(public payload: { level: number, round: number }) { }
}

export class StateResourcesLoadBlocksSuccess implements StateResourcesAction {
  readonly type = STATE_RESOURCES_LOAD_BLOCKS_SUCCESS;

  constructor(public payload: { blocks: StateResourcesBlockData[] }) { }
}

export class StateResourcesChangeActiveRound implements StateResourcesAction {
  readonly type = STATE_RESOURCES_CHANGE_ACTIVE_ROUND;

  constructor(public payload: { level: number, round: number }) { }
}

export class StateResourcesNodeLifetimeData implements StateResourcesAction {
  readonly type = STATE_RESOURCES_NODE_LIFETIME_DATA;
}

export class StateResourcesSorting implements StateResourcesAction {
  readonly type = STATE_RESOURCES_SORT;

  constructor(public payload: TableSort) { }
}

export class StateResourcesGroupFilter implements StateResourcesAction {
  readonly type = STATE_RESOURCES_GROUP_FILTER;

  constructor(public payload: string) { }
}

export class StateResourcesClose implements StateResourcesAction {
  readonly type = STATE_RESOURCES_CLOSE;
}

export type StateResourcesActions =
  | StateResourcesLoad
  | StateResourcesLoadSuccess
  | StateResourcesLoadBlocks
  | StateResourcesLoadBlocksSuccess
  | StateResourcesChangeActiveRound
  | StateResourcesNodeLifetimeData
  | StateResourcesSorting
  | StateResourcesGroupFilter
  | StateResourcesClose
  ;
