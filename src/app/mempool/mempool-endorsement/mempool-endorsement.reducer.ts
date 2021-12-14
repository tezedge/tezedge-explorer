import { MempoolEndorsementState } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-state.type';
import { State } from '@app/app.reducers';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MempoolEndorsementActions
} from '@mempool/mempool-endorsement/mempool-endorsement.action';

const initialState: MempoolEndorsementState = {
  endorsements: [],
  statistics: null,
  animateTable: false,
  isLoadingNewBlock: true,
  currentBlock: 0,
  sort: {
    sortBy: 'delta',
    sortDirection: 'ascending'
  }
};

export function reducer(state: MempoolEndorsementState = initialState, action: MempoolEndorsementActions): MempoolEndorsementState {

  switch (action.type) {

    case MEMPOOL_ENDORSEMENT_LOAD: {
      return {
        ...state,
        isLoadingNewBlock: true,
        currentBlock: action.payload.currentBlock
      };
    }

    case MEMPOOL_ENDORSEMENT_LOAD_SUCCESS: {
      const statistics = calculateStatistics(state.statistics, action.payload.endorsements, true);

      return {
        ...state,
        endorsements: action.payload.endorsements,
        animateTable: !state.animateTable,
        isLoadingNewBlock: false,
        statistics
      };
    }

    case MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS: {
      const newEndorsements = state.endorsements.map(endorsement => {
        const slotToUpdate = endorsement.slots.find(slot => action.payload[slot]);
        const bakerOfSlotToUpdate = action.payload[slotToUpdate];
        return { ...endorsement, ...bakerOfSlotToUpdate };
      });

      const endorsements = sortEndorsements(newEndorsements, state.sort);
      const statistics = calculateStatistics(state.statistics, endorsements);

      return {
        ...state,
        endorsements,
        statistics
      };
    }

    case MEMPOOL_ENDORSEMENT_SORT: {
      const endorsements = sortEndorsements([...state.endorsements], action.payload);

      return {
        ...state,
        endorsements,
        sort: { ...action.payload }
      };
    }

    case MEMPOOL_ENDORSEMENT_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function sortEndorsements(endorsements: MempoolEndorsement[], sort: MempoolEndorsementSort): MempoolEndorsement[] {
  const sortProperty = sort.sortBy;
  const includeMissingEndorsements = ['slotsLength', 'bakerName', 'status'].includes(sortProperty);
  const updatedEndorsements = includeMissingEndorsements ? endorsements : endorsements.filter(e => e.status);
  const missedEndorsements = includeMissingEndorsements ? [] : endorsements.filter(e => !e.status);

  const sortFunction = (e1: MempoolEndorsement, e2: MempoolEndorsement): number => {
    if (sortProperty === 'bakerName') {
      return sort.sortDirection === 'ascending'
        ? e2[sortProperty].localeCompare(e1[sortProperty])
        : e1[sortProperty].localeCompare(e2[sortProperty]);
    } else if (sortProperty === 'status') {
      return getSortOrder(e2.status, sort.sortDirection) - getSortOrder(e1.status, sort.sortDirection);
    }
    return sort.sortDirection === 'ascending'
      ? (e2[sortProperty] ?? Number.MIN_VALUE) - (e1[sortProperty] ?? Number.MIN_VALUE)
      : (e1[sortProperty] ?? Number.MAX_VALUE) - (e2[sortProperty] ?? Number.MAX_VALUE);
  };

  updatedEndorsements.sort(sortFunction);
  return [...updatedEndorsements, ...missedEndorsements];
}

function getSortOrder(status: string, direction: 'ascending' | 'descending'): number {
  const priority = direction === 'ascending' ? 1 : -1;
  switch (status) {
    case 'broadcast': {
      return 5 * priority;
    }
    case 'applied': {
      return 4 * priority;
    }
    case 'prechecked': {
      return 3 * priority;
    }
    case 'decoded': {
      return 2 * priority;
    }
    case 'received': {
      return 1 * priority;
    }
    case undefined: {
      return 0;
    }
  }
}

function calculateStatistics(currentStatistics: MempoolEndorsementStatistics, newEndorsements: MempoolEndorsement[], isNewBlock?: boolean): MempoolEndorsementStatistics {
  return {
    endorsementTypes: [
      {
        name: 'Missing', color: '#fff',
        value: newEndorsements.filter(e => !e.status).reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Broadcasted', color: '#32d74b',
        value: newEndorsements.filter(e => e.status === 'broadcast').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Applied', color: '#287e76',
        value: newEndorsements.filter(e => e.status === 'applied').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Prechecked', color: '#0a84ff',
        value: newEndorsements.filter(e => e.status === 'prechecked').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Decoded', color: '#bf5af2',
        value: newEndorsements.filter(e => e.status === 'decoded').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Received', color: '#ff9f0a',
        value: newEndorsements.filter(e => e.status === 'received').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
    ],
    previousBlockMissedEndorsements: isNewBlock ? currentStatistics?.endorsementTypes[0].value : currentStatistics.previousBlockMissedEndorsements,
    nodeStatistics: null
  };
}

export const selectMempoolEndorsements = (state: State): MempoolEndorsement[] => state.mempool.endorsementState.endorsements;
export const selectMempoolEndorsementTableAnimate = (state: State): boolean => state.mempool.endorsementState.animateTable;
export const selectMempoolEndorsementStatistics = (state: State): MempoolEndorsementStatistics => state.mempool.endorsementState.statistics;
export const selectMempoolEndorsementCurrentBlock = (state: State): number => state.mempool.endorsementState.currentBlock;
export const selectMempoolEndorsementSorting = (state: State): MempoolEndorsementSort => state.mempool.endorsementState.sort;
