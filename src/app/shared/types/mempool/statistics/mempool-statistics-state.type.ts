import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

export interface MempoolStatisticsState {
  operations: MempoolStatisticsOperation[];
  activeOperation: MempoolStatisticsOperation;
  sort: TableSort;
  detailsSort: TableSort;
}
