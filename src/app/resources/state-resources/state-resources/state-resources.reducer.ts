import { StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import {
  STATE_RESOURCES_CHANGE_ACTIVE_ROUND,
  STATE_RESOURCES_CLOSE,
  STATE_RESOURCES_GROUP_FILTER,
  STATE_RESOURCES_LOAD_BLOCKS,
  STATE_RESOURCES_LOAD_BLOCKS_SUCCESS,
  STATE_RESOURCES_LOAD_SUCCESS,
  STATE_RESOURCES_NODE_LIFETIME_DATA,
  STATE_RESOURCES_SORT,
  StateResourcesActions
} from '@resources/state-resources/state-resources/state-resources.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';

const initialState: StateResourcesState = {
  blocks: [],
  activeBlock: null,
  groups: [],
  filteredGroups: [],
  actionFilter: null,
  blockLevelFilter: 0,
  blockRoundFilter: 0,
  activeType: 'node',
  sort: {
    sortBy: 'totalTime',
    sortDirection: SortDirection.DSC
  }
};

export function reducer(state: StateResourcesState = initialState, action: StateResourcesActions): StateResourcesState {

  switch (action.type) {

    case STATE_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        groups: action.payload,
        filteredGroups: state.activeType === 'node' ? sortGroups([...action.payload], state.sort) : state.filteredGroups
      };
    }

    case STATE_RESOURCES_LOAD_BLOCKS_SUCCESS: {
      const activeBlock = action.payload.blocks.find(b => b.blockLevel === state.blockLevelFilter && b.blockRound === state.blockRoundFilter);

      if (!activeBlock) {
        console.log('block not found');
        return {
          ...state,
          blocks: action.payload.blocks
        };
      }
      return {
        ...state,
        activeBlock,
        blocks: action.payload.blocks,
        filteredGroups: sortGroups(filterGroups([...activeBlock.groups], state.actionFilter), state.sort)
      };
    }

    case STATE_RESOURCES_CHANGE_ACTIVE_ROUND: {
      const activeBlock = state.blocks.find(b => b.blockLevel === action.payload.level && b.blockRound === action.payload.round);
      return {
        ...state,
        activeBlock,
        blockRoundFilter: action.payload.round,
        blockLevelFilter: action.payload.level,
        filteredGroups: sortGroups(filterGroups([...activeBlock.groups], state.actionFilter), state.sort)
      };
    }

    case STATE_RESOURCES_GROUP_FILTER: {
      const groups = state.activeType === 'node' ? state.groups : state.activeBlock.groups;
      return {
        ...state,
        actionFilter: action.payload,
        filteredGroups: sortGroups(filterGroups(groups, action.payload), state.sort)
      };
    }

    case STATE_RESOURCES_LOAD_BLOCKS: {
      return {
        ...state,
        activeType: 'block',
        blockLevelFilter: action.payload.level,
        blockRoundFilter: action.payload.round,
      };
    }

    case STATE_RESOURCES_NODE_LIFETIME_DATA: {
      return {
        ...state,
        activeType: 'node',
        activeBlock: null,
        filteredGroups: sortGroups(filterGroups(state.groups, state.actionFilter), state.sort)
      };
    }

    case STATE_RESOURCES_SORT: {
      return {
        ...state,
        sort: { ...action.payload },
        filteredGroups: sortGroups([...state.filteredGroups], action.payload)
      };
    }

    case STATE_RESOURCES_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}

function filterGroups(groups: StateResourcesActionGroup[], filter: string): StateResourcesActionGroup[] {
  return !filter ? [...groups] : groups.filter(gr => gr.groupName.toLowerCase().includes(filter));
}

function sortGroups(groups: StateResourcesActionGroup[], sort: TableSort): StateResourcesActionGroup[] {
  const sortProperty = sort.sortBy;

  const sortFunction = (e1: StateResourcesActionGroup, e2: StateResourcesActionGroup): number => {
    return sort.sortDirection === SortDirection.DSC
      ? (e2[sortProperty]) - (e1[sortProperty])
      : (e1[sortProperty]) - (e2[sortProperty]);
  };

  return groups.sort(sortFunction);
}
