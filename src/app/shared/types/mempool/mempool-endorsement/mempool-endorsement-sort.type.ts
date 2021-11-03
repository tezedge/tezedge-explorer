import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';

export interface MempoolEndorsementSort extends TableSort {
  sortBy: string;
  sortDirection: SortDirection.ASC | SortDirection.DSC;
}
