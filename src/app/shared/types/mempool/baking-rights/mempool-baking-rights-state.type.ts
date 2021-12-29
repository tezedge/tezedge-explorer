import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

export interface MempoolBakingRightsState {
  blockLevel: number;
  currentHeads: MempoolBakingRight[];
  sort: TableSort;
}
