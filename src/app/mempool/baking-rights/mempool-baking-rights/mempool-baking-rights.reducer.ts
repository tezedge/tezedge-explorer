import { State } from '@app/app.index';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import {
  MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND,
  MEMPOOL_BAKING_RIGHTS_CONSTANTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH,
  MEMPOOL_BAKING_RIGHTS_DISPLAYED_BLOCK_UPDATE,
  MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE,
  MEMPOOL_BAKING_RIGHTS_LIVE,
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_PAUSE,
  MEMPOOL_BAKING_RIGHTS_SORT,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsActions
} from '@mempool/baking-rights/mempool-baking-rights/mempool-baking-rights.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';

const initialState: MempoolBakingRightsState = {
  bakingRights: [],
  filteredBakingRights: [],
  bakingDetails: [],
  activeRoundIndex: 0,
  delta: true,
  sort: {
    sortBy: 'receivedTime',
    sortDirection: SortDirection.DSC
  },
  blockHashPagination: {
    levels: [],
    activeIndex: 0
  },
  stream: true,
  lastAppliedBlock: 0,
  currentDisplayedBlock: 0,
  constants: {
    delayIncrementPerRound: 0,
    minimalBlockDelay: 0,
  }
};

export function reducer(state: MempoolBakingRightsState = initialState, action: MempoolBakingRightsActions): MempoolBakingRightsState {
  switch (action.type) {

    case MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS: {
      const activeRoundIndex = action.payload.bakingDetails[state.activeRoundIndex] ? state.activeRoundIndex : 0;
      const filteredBakingRights = action.payload.bakingRights.filter(b => b.blockHash === action.payload.bakingDetails[activeRoundIndex].blockHash);
      return {
        ...state,
        bakingRights: [...action.payload.bakingRights],
        bakingDetails: action.payload.bakingDetails,
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

    case MEMPOOL_BAKING_RIGHTS_CONSTANTS_LOAD_SUCCESS: {
      return {
        ...state,
        constants: action.payload
      };
    }

    case MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND: {
      const activeRoundIndex = action.payload;
      const filteredBakingRights = state.bakingRights.filter(b => b.blockHash === state.bakingDetails[activeRoundIndex].blockHash);
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

    case MEMPOOL_BAKING_RIGHTS_LIVE: {
      return {
        ...state,
        stream: true,
        currentDisplayedBlock: state.lastAppliedBlock
      };
    }

    case MEMPOOL_BAKING_RIGHTS_PAUSE: {
      return {
        ...state,
        stream: false
      };
    }

    case MEMPOOL_BAKING_RIGHTS_LAST_BLOCK_UPDATE: {
      return {
        ...state,
        lastAppliedBlock: action.payload,
        currentDisplayedBlock: state.stream ? action.payload : state.currentDisplayedBlock
      };
    }

    case MEMPOOL_BAKING_RIGHTS_DISPLAYED_BLOCK_UPDATE: {
      return {
        ...state,
        currentDisplayedBlock: action.payload,
        activeRoundIndex: 0
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
export const mempoolBakingRightsDetails = (state: State): MempoolBlockRound[] => state.mempool.bakingRightsState.bakingDetails;
export const mempoolBakingRightsDelta = (state: State): boolean => state.mempool.bakingRightsState.delta;
export const mempoolBakingRightsActiveRoundIndex = (state: State): number => state.mempool.bakingRightsState.activeRoundIndex;
export const mempoolBakingRightsCurrentDisplayedBlock = (state: State): number => state.mempool.bakingRightsState.currentDisplayedBlock;
