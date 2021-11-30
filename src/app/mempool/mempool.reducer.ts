import { MempoolEndorsementState } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-state.type';
import { State } from '@app/app.reducers';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MempoolActions
} from '@mempool/mempool.action';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';


const initialState: MempoolEndorsementState = {
  endorsements: [],
  statistics: null,
  animateTable: false,
  isLoadingNewBlock: true,
  sort: {
    sortBy: 'totalTime',
    sortDirection: 'ascending'
  }
};

export function reducer(state: MempoolEndorsementState = initialState, action: MempoolActions): MempoolEndorsementState {

  switch (action.type) {

    case MEMPOOL_ENDORSEMENT_LOAD: {
      return {
        ...state,
        isLoadingNewBlock: true
      };
    }

    case MEMPOOL_ENDORSEMENT_LOAD_SUCCESS: {
      return {
        ...state,
        endorsements: action.payload.endorsements,
        animateTable: !state.animateTable,
        isLoadingNewBlock: false
      };
    }

    case MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS: {
      const newEnd = {};
      state.endorsements.forEach(endorsement => {
        newEnd[endorsement.slot] = endorsement;
      });
      action.payload.forEach(update => {
        newEnd[update.slot] = { ...newEnd[update.slot], ...update };
      });
      const endorsements = sortEndorsements(Object.keys(newEnd).map(key => newEnd[key]), state.sort);
      const statistics = calculateStatistics(endorsements);

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
      return { ...initialState };
    }

    default:
      return state;
  }
}

function sortEndorsements(endorsements: MempoolEndorsement[], sort: MempoolEndorsementSort) {
  const sortProperty = sort.sortBy;
  return endorsements.sort((e1: MempoolEndorsement, e2: MempoolEndorsement) => {
    return sort.sortDirection === 'ascending'
      ? (e2[sortProperty] ?? Number.MIN_VALUE) - (e1[sortProperty] ?? Number.MIN_VALUE)
      : (e1[sortProperty] ?? Number.MAX_VALUE) - (e2[sortProperty] ?? Number.MAX_VALUE);
  });
}

function calculateStatistics(endorsements: MempoolEndorsement[]): MempoolEndorsementStatistics {
  return {
    endorsementTypes: [
      { name: 'Missed endorsements', value: endorsements.filter(e => !e.status).length },
      { name: 'Broadcasted endorsements', value: endorsements.filter(e => e.status === 'broadcast').length },
      { name: 'Applied endorsements', value: endorsements.filter(e => e.status === 'applied').length },
      { name: 'Prechecked endorsements', value: endorsements.filter(e => e.status === 'prechecked').length },
      { name: 'Decoded endorsements', value: endorsements.filter(e => e.status === 'decoded').length },
      { name: 'Received endorsements', value: endorsements.filter(e => e.status === 'received').length },
    ]
  };
}

export const selectMempoolEndorsements = (state: State) => state.mempool.endorsements;
export const selectMempoolEndorsementTableAnimate = (state: State) => state.mempool.animateTable;
export const selectMempoolEndorsementStatistics = (state: State) => state.mempool.statistics;
export const selectMempoolEndorsementSorting = (state: State) => state.mempool.sort;
