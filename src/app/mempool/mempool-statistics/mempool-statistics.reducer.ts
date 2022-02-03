import { State } from '@app/app.reducers';
import { MempoolStatisticsState } from '@shared/types/mempool/statistics/mempool-statistics-state.type';
import {
  MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION,
  MEMPOOL_STATISTICS_DETAILS_SORT,
  MEMPOOL_STATISTICS_LOAD_SUCCESS,
  MEMPOOL_STATISTICS_SORT,
  MEMPOOL_STATISTICS_STOP,
  MempoolStatisticsActions
} from '@mempool/mempool-statistics/mempool-statistics.actions';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolStatisticsOperationNode } from '@shared/types/mempool/statistics/mempool-statistics-operation-node.type';

const initialState: MempoolStatisticsState = {
  operations: [],
  activeOperation: null,
  sort: {
    sortBy: 'delta',
    sortDirection: SortDirection.DSC
  },
  detailsSort: {
    sortBy: 'received',
    sortDirection: SortDirection.ASC
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
      let operation;
      if (typeof action.payload === 'string') {
        operation = state.operations.find(op => op.hash === action.payload);
      } else {
        operation = action.payload;
      }
      const nodes = sortNodes([...operation.nodes], state.detailsSort);

      return {
        ...state,
        activeOperation: {
          ...operation,
          nodes
        }
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

    case MEMPOOL_STATISTICS_DETAILS_SORT: {
      const nodes = sortNodes([...state.activeOperation.nodes], action.payload);

      return {
        ...state,
        detailsSort: { ...action.payload },
        activeOperation: {
          ...state.activeOperation,
          nodes
        }
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
  const isStringSorting = ['dateTime', 'hash', 'kind'].includes(sortProperty);

  const numberSort = (o1: MempoolStatisticsOperation, o2: MempoolStatisticsOperation): number => {
    const o2Sort = o2[sortProperty] ?? Number.MAX_VALUE;
    const o1Sort = o1[sortProperty] ?? Number.MAX_VALUE;
    return sort.sortDirection === SortDirection.DSC
      ? o2Sort - o1Sort
      : o1Sort - o2Sort;
  };

  if (isStringSorting) {
    operations.sort((o1, o2) =>
      sort.sortDirection === SortDirection.DSC
        ? o2[sortProperty] > o1[sortProperty] ? 1 : -1
        : o1[sortProperty] > o2[sortProperty] ? 1 : -1
    );
  } else {
    operations.sort(numberSort);
  }
  return operations;
}

function sortNodes(nodes: MempoolStatisticsOperationNode[], sort: TableSort): MempoolStatisticsOperationNode[] {
  const sortProperty = sort.sortBy;
  const sortFunction = (o1: MempoolStatisticsOperationNode, o2: MempoolStatisticsOperationNode): number => {
    let o2Sort;
    let o1Sort;
    if (sortProperty === 'content_received') {
      o2Sort = o2[sortProperty][0] ?? Number.MAX_VALUE;
      o1Sort = o1[sortProperty][0] ?? Number.MAX_VALUE;
    } else {
      o2Sort = o2[sortProperty][0]?.latency ?? Number.MAX_VALUE;
      o1Sort = o1[sortProperty][0]?.latency ?? Number.MAX_VALUE;
    }
    return sort.sortDirection === SortDirection.DSC
      ? o2Sort - o1Sort
      : o1Sort - o2Sort;
  };

  nodes.sort(sortFunction);
  return nodes;
}

export const selectMempoolStatisticsOperations = (state: State): MempoolStatisticsOperation[] => state.mempool.statisticsState.operations;
export const selectMempoolStatisticsActiveOperation = (state: State): MempoolStatisticsOperation => state.mempool.statisticsState.activeOperation;
export const selectMempoolStatisticsSorting = (state: State): TableSort => state.mempool.statisticsState.sort;
export const selectMempoolStatisticsDetailsSorting = (state: State): TableSort => state.mempool.statisticsState.detailsSort;
