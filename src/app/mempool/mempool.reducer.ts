import { MempoolEndorsementState } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-state.type';
import { State } from '@app/app.reducers';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MEMPOOL_OPERATION_LOAD_SUCCESS,
  MEMPOOL_OPERATION_STOP,
  MempoolActions
} from '@mempool/mempool.action';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';
import { MempoolOperationState } from '@shared/types/mempool/operation/mempool-operation-state.type';

export interface MempoolState {
  endorsementState: MempoolEndorsementState;
  operationState: MempoolOperationState;
}

const endorsementInitialState: MempoolEndorsementState = {
  endorsements: [],
  statistics: null,
  animateTable: false,
  isLoadingNewBlock: true,
  currentBlock: 0,
  sort: {
    sortBy: 'maxTime',
    sortDirection: 'ascending'
  }
};

const operationInitialState: MempoolOperationState = {
  mempoolOperations: []
};

const initialState: MempoolState = {
  endorsementState: endorsementInitialState,
  operationState: operationInitialState
};

export function reducer(state: MempoolState = initialState, action: MempoolActions): MempoolState {

  switch (action.type) {

    case MEMPOOL_ENDORSEMENT_LOAD: {
      return {
        ...state,
        endorsementState: {
          ...state.endorsementState,
          isLoadingNewBlock: true,
          currentBlock: action.payload.currentBlock
        }
      };
    }

    case MEMPOOL_ENDORSEMENT_LOAD_SUCCESS: {
      const statistics = calculateStatistics(state.endorsementState.statistics, action.payload.endorsements);

      return {
        ...state,
        endorsementState: {
          ...state.endorsementState,
          endorsements: action.payload.endorsements,
          animateTable: !state.endorsementState.animateTable,
          isLoadingNewBlock: false,
          statistics
        }
      };
    }

    case MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS: {
      const newEndorsements = state.endorsementState.endorsements.map(end => {
        const slotUpdate = end.slots.find(slot => action.payload[slot]);
        const update = action.payload[slotUpdate];
        return { ...end, ...update };
      });

      const endorsements = sortEndorsements(newEndorsements, state.endorsementState.sort);
      const statistics = calculateStatistics(state.endorsementState.statistics, endorsements);

      return {
        ...state,
        endorsementState: {
          ...state.endorsementState,
          endorsements,
          statistics
        }
      };
    }

    case MEMPOOL_ENDORSEMENT_SORT: {
      const endorsements = sortEndorsements([...state.endorsementState.endorsements], action.payload);

      return {
        ...state,
        endorsementState: {
          ...state.endorsementState,
          endorsements,
          sort: { ...action.payload }
        }
      };
    }

    case MEMPOOL_ENDORSEMENT_STOP: {
      return {
        ...state,
        endorsementState: endorsementInitialState
      };
    }

    case MEMPOOL_OPERATION_LOAD_SUCCESS: {
      return {
        ...state,
        operationState: {
          mempoolOperations: [
            ...action.payload.applied
              .map((mem) => ({ status: 'applied', type: mem.contents[0].kind, ...mem })),
            ...action.payload.refused
              .map((mem) => ({ status: 'refused', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
            ...action.payload.branch_refused
              .map((mem) => ({ status: 'branchRefused', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
            ...action.payload.branch_delayed
              .map((mem) => ({ status: 'branchDelayed', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
            ...action.payload.unprocessed
              .map((mem) => ({ status: 'unprocessed', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
          ]
        }
      };
    }

    case MEMPOOL_OPERATION_STOP: {
      return {
        ...state,
        operationState: operationInitialState
      };
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

function calculateStatistics(currentStatistics: MempoolEndorsementStatistics, endorsements: MempoolEndorsement[]): MempoolEndorsementStatistics {
  return {
    endorsementTypes: [
      {
        name: 'Missing', color: '#fff',
        value: endorsements.filter(e => !e.status).reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Broadcasted', color: '#bf5af2',
        value: endorsements.filter(e => e.status === 'broadcast').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Applied', color: '#32d74b',
        value: endorsements.filter(e => e.status === 'applied').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Prechecked', color: '#0a84ff',
        value: endorsements.filter(e => e.status === 'prechecked').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Decoded', color: '#ff9f0a',
        value: endorsements.filter(e => e.status === 'decoded').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
      {
        name: 'Received', color: '#ffd60a',
        value: endorsements.filter(e => e.status === 'received').reduce((acc, curr) => [...acc, ...curr.slots], []).length
      },
    ],
    previousBlockMissedEndorsements: currentStatistics ? currentStatistics.endorsementTypes[0].value : undefined
  };
}

export const selectMempoolEndorsements = (state: State) => state.mempool.endorsementState.endorsements;
export const selectMempoolEndorsementTableAnimate = (state: State) => state.mempool.endorsementState.animateTable;
export const selectMempoolEndorsementStatistics = (state: State) => state.mempool.endorsementState.statistics;
export const selectMempoolEndorsementCurrentBlock = (state: State) => state.mempool.endorsementState.currentBlock;
export const selectMempoolEndorsementSorting = (state: State) => state.mempool.endorsementState.sort;
export const selectMempoolOperations = (state: State) => state.mempool.operationState.mempoolOperations;
