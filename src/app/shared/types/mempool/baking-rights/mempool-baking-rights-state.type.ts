import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { MempoolBakingRightsBlockHashPagination } from '@shared/types/mempool/baking-rights/mempool-baking-rights-block-hash-pagination.type';
import { MempoolBakingRightsConstants } from '@shared/types/mempool/baking-rights/mempool-baking-rights-constants.type';

export interface MempoolBakingRightsState {
  bakingRights: MempoolBakingRight[];
  filteredBakingRights: MempoolBakingRight[];
  bakingDetails: MempoolBlockRound[];
  activeRoundIndex: number;
  sort: TableSort;
  delta: boolean;
  blockHashPagination: MempoolBakingRightsBlockHashPagination;
  stream: boolean;
  lastAppliedBlock: number;
  currentDisplayedBlock: number;
  constants: MempoolBakingRightsConstants;
}
