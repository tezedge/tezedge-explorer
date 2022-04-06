import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/endorsement/mempool-endorsement-sort.type';
import { MempoolPartialRound } from '../common/mempool-partial-round.type';

export interface MempoolEndorsementState {
  statistics: MempoolEndorsementStatistics;
  endorsements: MempoolEndorsement[];
  animateTable: boolean;
  isLoadingNewBlock: boolean;
  currentBlockLevel: number;
  currentRound: MempoolPartialRound;
  rounds: MempoolPartialRound[];
  activeBaker: string;
  sort: MempoolEndorsementSort;
}
