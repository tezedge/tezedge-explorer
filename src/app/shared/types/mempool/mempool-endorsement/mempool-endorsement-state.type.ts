import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';

export interface MempoolEndorsementState {
  statistics: MempoolEndorsementStatistics;
  endorsements: MempoolEndorsement[];
  animateTable: boolean;
  isLoadingNewBlock: boolean;
  currentBlock: number;
  activeBaker: string;
  sort: MempoolEndorsementSort;
}
