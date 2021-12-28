import { TableSort } from '@shared/types/shared/table-sort.type';

export interface MempoolEndorsementSort extends TableSort {
  sortBy: string;
  sortDirection: 'ascending' | 'descending';
}
