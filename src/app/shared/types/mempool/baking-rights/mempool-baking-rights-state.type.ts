import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';

export interface MempoolBakingRightsState {
  bakingRights: MempoolBakingRight[];
  bakingDetails: MempoolBlockDetails[];
  sort: TableSort;
  delta: boolean;
}
