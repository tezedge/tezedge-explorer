import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { State } from '@app/app.index';
import { StateResourcesBlockData } from '@shared/types/resources/state/state-resources-block-data.type';

export interface StateResourcesState {
  blocks: StateResourcesBlockData[];
  activeBlock: StateResourcesBlockData;
  groups: StateResourcesActionGroup[];
  filteredGroups: StateResourcesActionGroup[];
  actionFilter: string | null;
  blockLevelFilter: number;
  blockRoundFilter: number;
  sort: TableSort;
  activeType: 'node' | 'block';
}

export const selectStateResources = (state: State): StateResourcesState => state.resources.stateResourcesState;
export const selectStateResourcesSort = (state: State): TableSort => state.resources.stateResourcesState.sort;
