import { MempoolEndorsementState } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-state.type';
import { State } from '@app/app.reducers';
import { MempoolEndorsement, MempoolEndorsementStatusTypes } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MempoolEndorsementActions
} from '@mempool/mempool-endorsement/mempool-endorsement.actions';

const initialState: MempoolEndorsementState = {
  endorsements: [],
  statistics: null,
  animateTable: false,
  isLoadingNewBlock: true,
  currentBlock: 0,
  activeBaker: localStorage.getItem('activeBaker'),
  sort: {
    sortBy: 'delta',
    sortDirection: 'descending'
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
        endorsements: bringItemToBeginning(action.payload.endorsements, state.activeBaker),
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
      newEndorsements.forEach(endorsement => {
        const receiveContentsTimeDelta = endorsement.receiveContentsTime - endorsement.receiveHashTime;
        const decodeTimeDelta = endorsement.decodeTime - endorsement.receiveContentsTime;
        const precheckTimeDelta = endorsement.precheckTime - endorsement.decodeTime;
        const applyTimeDelta = endorsement.applyTime - endorsement.decodeTime;
        const broadcastTimeDelta = endorsement.broadcastTime - (endorsement.precheckTime ?? endorsement.applyTime);
        endorsement.receiveContentsTimeDelta = valOrUndefined(receiveContentsTimeDelta);
        endorsement.decodeTimeDelta = valOrUndefined(decodeTimeDelta);
        endorsement.precheckTimeDelta = valOrUndefined(precheckTimeDelta);
        endorsement.applyTimeDelta = valOrUndefined(applyTimeDelta);
        endorsement.broadcastTimeDelta = valOrUndefined(broadcastTimeDelta);
      });
      const endorsements = sortEndorsements(newEndorsements, state.sort);
      const statistics = calculateStatistics(state.statistics, endorsements);

      return {
        ...state,
        endorsements: bringItemToBeginning(endorsements, state.activeBaker),
        statistics
      };
    }

    case MEMPOOL_ENDORSEMENT_SORT: {
      const endorsements = sortEndorsements([...state.endorsements], action.payload);

      return {
        ...state,
        endorsements: bringItemToBeginning(endorsements, state.activeBaker),
        sort: { ...action.payload }
      };
    }

    case MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER: {
      localStorage.setItem('activeBaker', action.payload);
      return {
        ...state,
        endorsements: bringItemToBeginning(state.endorsements, action.payload),
        activeBaker: action.payload
      };
    }

    case MEMPOOL_ENDORSEMENT_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function bringItemToBeginning(endorsements: MempoolEndorsement[], baker: string): MempoolEndorsement[] {
  if (!baker) {
    return endorsements;
  }
  // @ts-ignore
  return [...endorsements].sort((e1, e2) => (e2.bakerHash === baker) - (e1.bakerHash === baker));
}

function sortEndorsements(endorsements: MempoolEndorsement[], sort: MempoolEndorsementSort): MempoolEndorsement[] {
  const sortProperty = sort.sortBy;
  const includeMissingEndorsements = ['slotsLength', 'bakerName', 'status'].includes(sortProperty);
  const updatedEndorsements = includeMissingEndorsements ? endorsements : endorsements.filter(e => e.status);
  const missedEndorsements = includeMissingEndorsements ? [] : endorsements.filter(e => !e.status);

  const sortFunction = (e1: MempoolEndorsement, e2: MempoolEndorsement): number => {
    if (sortProperty === 'bakerName') {
      return sort.sortDirection === 'descending'
        ? e2[sortProperty].localeCompare(e1[sortProperty])
        : e1[sortProperty].localeCompare(e2[sortProperty]);
    } else if (sortProperty === 'status') {
      return getSortOrder(e2.status, sort.sortDirection) - getSortOrder(e1.status, sort.sortDirection);
    }
    return sort.sortDirection === 'descending'
      ? (e2[sortProperty] ?? Number.MAX_VALUE) - (e1[sortProperty] ?? Number.MAX_VALUE)
      : (e1[sortProperty] ?? Number.MAX_VALUE) - (e2[sortProperty] ?? Number.MAX_VALUE);
  };

  updatedEndorsements.sort(sortFunction);
  return [...updatedEndorsements, ...missedEndorsements];
}

function getSortOrder(status: string, direction: 'ascending' | 'descending'): number {
  const priority = direction === 'descending' ? 1 : -1;
  switch (status) {
    case MempoolEndorsementStatusTypes.BROADCAST: {
      return 5 * priority;
    }
    case MempoolEndorsementStatusTypes.APPLIED: {
      return 4 * priority;
    }
    case MempoolEndorsementStatusTypes.PRECHECKED: {
      return 3 * priority;
    }
    case MempoolEndorsementStatusTypes.DECODED: {
      return 2 * priority;
    }
    case MempoolEndorsementStatusTypes.RECEIVED: {
      return 1 * priority;
    }
    case undefined: {
      return 0;
    }
  }
}

function calculateStatistics(currentStatistics: MempoolEndorsementStatistics, newEndorsements: MempoolEndorsement[], isNewBlock?: boolean): MempoolEndorsementStatistics {
  const valueObject = Object.keys(MempoolEndorsementStatusTypes)
    .reduce((acc: any, curr: MempoolEndorsementStatusTypes) => ({ ...acc, [curr.toLowerCase()]: 0 }), {});

  newEndorsements.forEach(e => {
    const key = e.status ?? MempoolEndorsementStatusTypes.MISSING;
    valueObject[key] = valueObject[key];
    valueObject[key] += e.slotsLength;
  });

  return {
    endorsementTypes: [
      { name: MempoolEndorsementStatusTypes.MISSING, value: valueObject[MempoolEndorsementStatusTypes.MISSING] },
      { name: MempoolEndorsementStatusTypes.BROADCAST, value: valueObject[MempoolEndorsementStatusTypes.BROADCAST] },
      { name: MempoolEndorsementStatusTypes.APPLIED, value: valueObject[MempoolEndorsementStatusTypes.APPLIED] },
      { name: MempoolEndorsementStatusTypes.PRECHECKED, value: valueObject[MempoolEndorsementStatusTypes.PRECHECKED] },
      { name: MempoolEndorsementStatusTypes.DECODED, value: valueObject[MempoolEndorsementStatusTypes.DECODED] },
      { name: MempoolEndorsementStatusTypes.RECEIVED, value: valueObject[MempoolEndorsementStatusTypes.RECEIVED] },
    ],
    previousBlockMissedEndorsements: isNewBlock ? currentStatistics?.endorsementTypes[0].value : currentStatistics.previousBlockMissedEndorsements
  };
}

function valOrUndefined<T = any>(value: T): T | undefined {
  return value ? value : undefined;
}

export const selectMempoolEndorsements = (state: State): MempoolEndorsement[] => state.mempool.endorsementState.endorsements;
export const selectMempoolEndorsementTableAnimate = (state: State): boolean => state.mempool.endorsementState.animateTable;
export const selectMempoolEndorsementStatistics = (state: State): MempoolEndorsementStatistics => state.mempool.endorsementState.statistics;
export const selectMempoolEndorsementCurrentBlock = (state: State): number => state.mempool.endorsementState.currentBlock;
export const selectMempoolEndorsementSorting = (state: State): MempoolEndorsementSort => state.mempool.endorsementState.sort;
export const selectMempoolEndorsementActiveBaker = (state: State): string => state.mempool.endorsementState.activeBaker;
