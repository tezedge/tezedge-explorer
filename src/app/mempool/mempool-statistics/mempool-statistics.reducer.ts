import { State } from '@app/app.reducers';
import { MempoolStatisticsState } from '@shared/types/mempool/statistics/mempool-statistics-state.type';
import {
  MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION,
  MEMPOOL_STATISTICS_LOAD_SUCCESS,
  MEMPOOL_STATISTICS_SORT,
  MEMPOOL_STATISTICS_STOP,
  MempoolStatisticsActions
} from '@mempool/mempool-statistics/mempool-statistics.action';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

const initialState: MempoolStatisticsState = {
  operations: [],
  activeOperation: null,
  sort: {
    sortBy: 'maxReceived',
    sortDirection: 'ascending'
  }
};

export function reducer(state: MempoolStatisticsState = initialState, action: MempoolStatisticsActions): MempoolStatisticsState {

  switch (action.type) {

    case MEMPOOL_STATISTICS_LOAD_SUCCESS: {
      const operations = sortOperations([...action.payload], state.sort);
      return {
        ...state,
        operations
      };
    }

    case MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION: {
      return {
        ...state,
        activeOperation: action.payload
      };
    }

    case MEMPOOL_STATISTICS_SORT: {
      const operations = sortOperations([...state.operations], action.payload);

      return {
        ...state,
        operations,
        sort: { ...action.payload }
      };
    }

    case MEMPOOL_STATISTICS_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function sortOperations(operations: MempoolStatisticsOperation[], sort: TableSort): MempoolStatisticsOperation[] {
  const sortProperty = sort.sortBy;
  const sortFunction = (e1: MempoolStatisticsOperation, e2: MempoolStatisticsOperation): number => {
    if (sortProperty === 'dateTime' || sortProperty === 'hash') {
      return sort.sortDirection === 'ascending'
        ? e2[sortProperty].localeCompare(e1[sortProperty])
        : e1[sortProperty].localeCompare(e2[sortProperty]);
    }
    return sort.sortDirection === 'ascending'
      ? (e2[sortProperty] ?? Number.MIN_VALUE) - (e1[sortProperty] ?? Number.MIN_VALUE)
      : (e1[sortProperty] ?? Number.MAX_VALUE) - (e2[sortProperty] ?? Number.MAX_VALUE);
  };

  operations.sort(sortFunction);
  return operations;
}

export const selectMempoolStatisticsOperations = (state: State): MempoolStatisticsOperation[] => state.mempool.statisticsState.operations;
export const selectMempoolStatisticsActiveOperation = (state: State): MempoolStatisticsOperation => state.mempool.statisticsState.activeOperation;
export const selectMempoolStatisticsSorting = (state: State): TableSort => state.mempool.statisticsState.sort;
