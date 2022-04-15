import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { State } from '@app/app.index';

export interface StateResourcesState {
  groups: StateResourcesActionGroup[];
  filteredGroups: StateResourcesActionGroup[];
  filter: string | null;
  sort: TableSort;
}

export const selectStateResources = (state: State): StateResourcesState => state.resources.stateResourcesState;
export const selectStateResourcesSort = (state: State): TableSort => state.resources.stateResourcesState.sort;
