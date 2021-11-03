import { State } from '@app/app.index';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import {
  MEMPOOL_PREENDORSEMENT_LOAD,
  MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS,
  MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER,
  MEMPOOL_PREENDORSEMENT_SORT,
  MEMPOOL_PREENDORSEMENT_STOP,
  MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MempoolPreEndorsementActions
} from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.actions';
import { MempoolPreEndorsementState } from '@shared/types/mempool/preendorsement/mempool-preendorsement-state.type';
import { MempoolPreEndorsement, MempoolPreEndorsementStatusTypes } from '@shared/types/mempool/preendorsement/mempool-preendorsement.type';
import { MempoolPreEndorsementSort } from '@shared/types/mempool/preendorsement/mempool-preendorsement-sort.type';
import { MempoolPreEndorsementStatistics } from '@shared/types/mempool/preendorsement/mempool-preendorsement-statistics.type';

const initialState: MempoolPreEndorsementState = {
  endorsements: [],
  statistics: null,
  animateTable: false,
  isLoadingNewBlock: true,
  currentBlockLevel: 0,
  currentRound: null,
  rounds: [],
  activeBaker: localStorage.getItem('activeBakerPreendorsement'),
  sort: {
    sortBy: 'delta',
    sortDirection: SortDirection.DSC
  }
};

export function reducer(state: MempoolPreEndorsementState = initialState, action: MempoolPreEndorsementActions): MempoolPreEndorsementState {

  switch (action.type) {

    case MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS: {
      const rounds = action.payload.rounds.map(round => ({
        round: round.round,
        blockHash: round.blockHash,
        blockLevel: round.blockLevel,
        blockRecTimestamp: round.receiveTimestamp
      }));
      return {
        ...state,
        rounds,
        currentRound: rounds[rounds.length - 1]
      };
    }

    case MEMPOOL_PREENDORSEMENT_LOAD: {
      return {
        ...state,
        isLoadingNewBlock: true,
        currentBlockLevel: action.payload.level,
      };
    }

    case MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS: {
      const statistics = calculateStatistics(state.statistics, action.payload.endorsements, true);

      return {
        ...state,
        endorsements: bringItemToBeginning(action.payload.endorsements, state.activeBaker),
        animateTable: !state.animateTable,
        isLoadingNewBlock: false,
        statistics
      };
    }

    case MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS: {
      const newEndorsements = state.endorsements.map(endorsement => {
        const slotToUpdate = endorsement.slots.find(slot => action.payload[slot]);
        const operationHashes = Object.keys(action.payload)
          .filter((slot: string) => endorsement.slots?.includes(Number(slot)))
          .map(slot => action.payload[slot].operationHash);
        return { ...endorsement, ...action.payload[slotToUpdate], ...{ operationHashes, operationHash: undefined } };
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

    case MEMPOOL_PREENDORSEMENT_SORT: {
      const endorsements = sortEndorsements([...state.endorsements], action.payload);

      return {
        ...state,
        endorsements: bringItemToBeginning(endorsements, state.activeBaker),
        sort: { ...action.payload }
      };
    }

    case MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER: {
      localStorage.setItem('activeBakerPreendorsement', action.payload);
      return {
        ...state,
        endorsements: bringItemToBeginning(state.endorsements, action.payload),
        activeBaker: action.payload
      };
    }

    case MEMPOOL_PREENDORSEMENT_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function bringItemToBeginning(endorsements: MempoolPreEndorsement[], baker: string): MempoolPreEndorsement[] {
  if (!baker) {
    return endorsements;
  }
  // @ts-ignore
  return [...endorsements].sort((e1, e2) => (e2.bakerHash === baker) - (e1.bakerHash === baker));
}

function sortEndorsements(endorsements: MempoolPreEndorsement[], sort: MempoolPreEndorsementSort): MempoolPreEndorsement[] {
  const sortProperty = sort.sortBy;
  const includeMissingEndorsements = ['slotsLength', 'bakerName', 'status'].includes(sortProperty);
  const updatedEndorsements = includeMissingEndorsements ? endorsements : endorsements.filter(e => e.status);
  const missedEndorsements = includeMissingEndorsements ? [] : endorsements.filter(e => !e.status);

  const sortFunction = (e1: MempoolPreEndorsement, e2: MempoolPreEndorsement): number => {
    if (sortProperty === 'bakerName') {
      return sort.sortDirection === SortDirection.DSC
        ? e2[sortProperty].localeCompare(e1[sortProperty])
        : e1[sortProperty].localeCompare(e2[sortProperty]);
    } else if (sortProperty === 'status') {
      return getSortOrder(e2.status, sort.sortDirection) - getSortOrder(e1.status, sort.sortDirection);
    }
    return sort.sortDirection === SortDirection.DSC
      ? (e2[sortProperty] ?? Number.MAX_VALUE) - (e1[sortProperty] ?? Number.MAX_VALUE)
      : (e1[sortProperty] ?? Number.MAX_VALUE) - (e2[sortProperty] ?? Number.MAX_VALUE);
  };

  updatedEndorsements.sort(sortFunction);
  return [...updatedEndorsements, ...missedEndorsements];
}

function getSortOrder(status: string, direction: SortDirection.ASC | SortDirection.DSC): number {
  const priority = direction === SortDirection.DSC ? 1 : -1;
  switch (status) {
    case MempoolPreEndorsementStatusTypes.BROADCAST: {
      return 6 * priority;
    }
    case MempoolPreEndorsementStatusTypes.APPLIED: {
      return 5 * priority;
    }
    case MempoolPreEndorsementStatusTypes.PRECHECKED: {
      return 4 * priority;
    }
    case MempoolPreEndorsementStatusTypes.DECODED: {
      return 3 * priority;
    }
    case MempoolPreEndorsementStatusTypes.RECEIVED: {
      return 2 * priority;
    }
    case MempoolPreEndorsementStatusTypes.BRANCH_DELAYED: {
      return 1 * priority;
    }
    case undefined: {
      return 0;
    }
  }
}

function calculateStatistics(currentStatistics: MempoolPreEndorsementStatistics, newEndorsements: MempoolPreEndorsement[], isNewBlock?: boolean): MempoolPreEndorsementStatistics {
  const valueObject = Object.keys(MempoolPreEndorsementStatusTypes)
    .reduce((acc: any, curr: MempoolPreEndorsementStatusTypes) => ({ ...acc, [curr.toLowerCase()]: 0 }), {});

  newEndorsements.forEach(e => {
    const key = e.status ?? MempoolPreEndorsementStatusTypes.MISSING;
    valueObject[key] += e.slotsLength;
  });

  return {
    endorsementTypes: [
      { name: MempoolPreEndorsementStatusTypes.MISSING, value: valueObject[MempoolPreEndorsementStatusTypes.MISSING] },
      { name: MempoolPreEndorsementStatusTypes.BROADCAST, value: valueObject[MempoolPreEndorsementStatusTypes.BROADCAST] },
      { name: MempoolPreEndorsementStatusTypes.APPLIED, value: valueObject[MempoolPreEndorsementStatusTypes.APPLIED] },
      { name: MempoolPreEndorsementStatusTypes.PRECHECKED, value: valueObject[MempoolPreEndorsementStatusTypes.PRECHECKED] },
      { name: MempoolPreEndorsementStatusTypes.DECODED, value: valueObject[MempoolPreEndorsementStatusTypes.DECODED] },
      { name: MempoolPreEndorsementStatusTypes.RECEIVED, value: valueObject[MempoolPreEndorsementStatusTypes.RECEIVED] },
      { name: 'Branch delayed', value: valueObject[MempoolPreEndorsementStatusTypes.BRANCH_DELAYED] },
    ],
    totalSlots: newEndorsements.reduce((sum, curr) => sum + curr.slots.length,  0),
    previousBlockMissedEndorsements: isNewBlock ? currentStatistics?.endorsementTypes[0].value : currentStatistics?.previousBlockMissedEndorsements
  };
}

function valOrUndefined<T = any>(value: T): T | undefined {
  return value ? value : undefined;
}

export const selectMempoolPreEndorsements = (state: State): MempoolPreEndorsement[] => state.mempool.preendorsementState.endorsements;
export const selectMempoolPreEndorsementTableAnimate = (state: State): boolean => state.mempool.preendorsementState.animateTable;
export const selectMempoolPreEndorsementStatistics = (state: State): MempoolPreEndorsementStatistics => state.mempool.preendorsementState.statistics;
export const selectMempoolPreEndorsementCurrentBlock = (state: State): number => state.mempool.preendorsementState.currentBlockLevel;
export const selectMempoolPreEndorsementSorting = (state: State): MempoolPreEndorsementSort => state.mempool.preendorsementState.sort;
export const selectMempoolPreEndorsementActiveBaker = (state: State): string => state.mempool.preendorsementState.activeBaker;
