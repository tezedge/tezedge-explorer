export interface TableSort {
  sortBy: string;
  sortDirection: SortDirection.ASC | SortDirection.DSC;
}

export enum SortDirection {
  ASC = 'ascending',
  DSC = 'descending'
}
