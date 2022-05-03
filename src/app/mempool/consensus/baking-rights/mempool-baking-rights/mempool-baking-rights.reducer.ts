import {
  MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND,
  MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH,
  MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE,
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_SORT,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsActions
} from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBakingRightsState } from './mempool-baking-rights.index';

const initialState: MempoolBakingRightsState = {
  bakingRights: [],
  filteredBakingRights: [],
  rounds: [],
  activeRoundIndex: 0,
  delta: true,
  sort: {
    sortBy: 'receivedTime',
    sortDirection: SortDirection.DSC
  },
  stream: true,
  activeBlockLevel: 0,
};

export function reducer(state: MempoolBakingRightsState = initialState, action: MempoolBakingRightsActions): MempoolBakingRightsState {
  switch (action.type) {

    case MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS: {
      const activeRoundIndex = action.payload.rounds[state.activeRoundIndex] ? state.activeRoundIndex : 0;
      const filteredBakingRights = action.payload.bakingRights.filter(b => b.blockHash === action.payload.rounds[activeRoundIndex].blockHash);
      return {
        ...state,
        bakingRights: [...action.payload.bakingRights],
        rounds: action.payload.rounds,
        filteredBakingRights: sortBakingRights(filteredBakingRights, state.sort),
        activeRoundIndex
      };
    }

    case MEMPOOL_BAKING_RIGHTS_SORT: {
      return {
        ...state,
        filteredBakingRights: sortBakingRights([...state.filteredBakingRights], action.payload),
        sort: { ...action.payload }
      };
    }

    case MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND: {
      const activeRoundIndex = action.payload;
      const filteredBakingRights = state.bakingRights.filter(b => b.blockHash === state.rounds[activeRoundIndex]?.blockHash);
      return {
        ...state,
        activeRoundIndex,
        filteredBakingRights: sortBakingRights(filteredBakingRights, state.sort),
      };
    }

    case MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH: {
      return {
        ...state,
        delta: !state.delta
      };
    }

    case MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE: {
      return {
        ...state,
        activeBlockLevel: action.payload
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
