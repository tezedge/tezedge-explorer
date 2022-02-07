import { State } from '@app/app.reducers';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import {
  MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH,
  MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_SORT,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsActions
} from '@mempool/mempool-baking-rights/mempool-baking-rights.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';

const initialState: MempoolBakingRightsState = {
  bakingRights: [],
  bakingDetails: [],
  delta: true,
  sort: {
    sortBy: 'delta',
    sortDirection: SortDirection.DSC
  }
};

export function reducer(state: MempoolBakingRightsState = initialState, action: MempoolBakingRightsActions): MempoolBakingRightsState {
  switch (action.type) {

    case MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS: {
      return {
        ...state,
        bakingRights: sortBakingRights([...action.payload.bakingRights], state.sort),
      };
    }

    case MEMPOOL_BAKING_RIGHTS_SORT: {
      return {
        ...state,
        bakingRights: sortBakingRights([...state.bakingRights], action.payload),
        sort: { ...action.payload }
      };
    }

    case MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD_SUCCESS: {
      return {
        ...state,
        bakingDetails: action.payload.details
      };
    }

    case MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH: {
      return {
        ...state,
        delta: !state.delta
      };
    }

    case MEMPOOL_BAKING_RIGHTS_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function sortBakingRights(bakingRights: MempoolBakingRight[], sort: TableSort): MempoolBakingRight[] {
  const sortProperty = sort.sortBy;
  const isStringSorting = ['address', 'nodeId', 'responseRate'].includes(sortProperty);

  const numberSort = (o1: MempoolBakingRight, o2: MempoolBakingRight): number => {
    const o2Sort = o2[sortProperty] ?? Number.MAX_VALUE;
    const o1Sort = o1[sortProperty] ?? Number.MAX_VALUE;
    return sort.sortDirection === SortDirection.DSC
      ? o2Sort - o1Sort
      : o1Sort - o2Sort;
  };

  if (isStringSorting) {
    const stringSort = (o1: MempoolBakingRight, o2: MempoolBakingRight) =>
      sort.sortDirection === SortDirection.DSC
        ? o2[sortProperty] > o1[sortProperty] ? 1 : -1
        : o1[sortProperty] > o2[sortProperty] ? 1 : -1;
    bakingRights.sort(stringSort);
  } else {
    bakingRights.sort(numberSort);
  }
  return bakingRights;
}

export const mempoolBakingRightsState = (state: State): MempoolBakingRightsState => state.mempool.bakingRightsState;
export const mempoolBakingRights = (state: State): MempoolBakingRight[] => state.mempool.bakingRightsState.bakingRights;
export const mempoolBakingRightsDetails = (state: State): MempoolBlockDetails[] => state.mempool.bakingRightsState.bakingDetails;
export const mempoolBakingRightsDelta = (state: State): boolean => state.mempool.bakingRightsState.delta;
