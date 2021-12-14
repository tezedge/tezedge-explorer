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

function sortEndorsements(endorsements: MempoolEndorsement[], sort: MempoolEndorsementSort) {
  const sortProperty = sort.sortBy;
  const updatedEndorsements = endorsements.filter(e => e.status);
  const missedEndorsements = endorsements.filter(e => !e.status);
  const sortFunction = (e1: MempoolEndorsement, e2: MempoolEndorsement) => {
    return sort.sortDirection === 'ascending'
      ? (e2[sortProperty] ?? Number.MIN_VALUE) - (e1[sortProperty] ?? Number.MIN_VALUE)
      : (e1[sortProperty] ?? Number.MAX_VALUE) - (e2[sortProperty] ?? Number.MAX_VALUE);
  };
  updatedEndorsements.sort(sortFunction);
  return [...updatedEndorsements, ...missedEndorsements];
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
    previousBlockMissedEndorsements: isNewBlock ? currentStatistics?.endorsementTypes[0].value : currentStatistics.previousBlockMissedEndorsements
  };
}

export const selectMempoolEndorsements = (state: State) => state.mempool.endorsementState.endorsements;
export const selectMempoolEndorsementTableAnimate = (state: State) => state.mempool.endorsementState.animateTable;
export const selectMempoolEndorsementStatistics = (state: State) => state.mempool.endorsementState.statistics;
export const selectMempoolEndorsementCurrentBlock = (state: State) => state.mempool.endorsementState.currentBlock;
export const selectMempoolEndorsementSorting = (state: State) => state.mempool.endorsementState.sort;
