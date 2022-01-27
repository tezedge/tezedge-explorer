import { State } from '@app/app.reducers';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import {
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_SORT,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsActions
} from '@mempool/mempool-baking-rights/mempool-baking-rights.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

const initialState: MempoolBakingRightsState = {
  blockLevel: null,
  currentHeads: [],
  sort: {
    sortBy: 'delta',
    sortDirection: 'descending'
  }
};

export function reducer(state: MempoolBakingRightsState = initialState, action: MempoolBakingRightsActions): MempoolBakingRightsState {
  switch (action.type) {

    case MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS: {
      return {
        ...state,
        ...action.payload,
        currentHeads: sortBakingRights([...action.payload.currentHeads], state.sort),
      };
    }

    case MEMPOOL_BAKING_RIGHTS_SORT: {
      return {
        ...state,
        currentHeads: sortBakingRights([...state.currentHeads], action.payload),
        sort: { ...action.payload }
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
  const isStringSorting = ['address', 'nodeId', 'baker', 'blockHash'].includes(sortProperty);

  const numberSort = (o1: MempoolBakingRight, o2: MempoolBakingRight): number => {
    const o2Sort = o2[sortProperty] ?? Number.MAX_VALUE;
    const o1Sort = o1[sortProperty] ?? Number.MAX_VALUE;
    return sort.sortDirection === 'descending'
      ? o2Sort - o1Sort
      : o1Sort - o2Sort;
  };

  if (isStringSorting) {
    const stringSort = (o1: MempoolBakingRight, o2: MempoolBakingRight) =>
      sort.sortDirection === 'descending'
        ? o2[sortProperty] > o1[sortProperty] ? 1 : -1
        : o1[sortProperty] > o2[sortProperty] ? 1 : -1;
    bakingRights.sort(stringSort);
  } else {
    bakingRights.sort(numberSort);
  }
  return bakingRights;
}

export const mempoolBakingRights = (state: State): MempoolBakingRightsState => state.mempool.bakingRightsState;
