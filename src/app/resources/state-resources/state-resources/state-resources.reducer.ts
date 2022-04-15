import { StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import {
  STATE_RESOURCES_CLOSE,
  STATE_RESOURCES_FILTER,
  STATE_RESOURCES_LOAD_SUCCESS,
  STATE_RESOURCES_SORT,
  StateResourcesActions
} from '@resources/state-resources/state-resources/state-resources.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';

const initialState: StateResourcesState = {
  groups: [],
  filteredGroups: [],
  filter: null,
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
        filteredGroups: sortGroups([...action.payload], state.sort)
      };
    }

    case STATE_RESOURCES_FILTER: {
      return {
        ...state,
        filter: action.payload,
        filteredGroups: sortGroups(filterGroups(state.groups, action.payload), state.sort)
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
