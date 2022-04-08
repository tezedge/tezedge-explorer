import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/endorsement/mempool-endorsement-sort.type';
import { MempoolPartialRound } from '../common/mempool-partial-round.type';
import { NetworkStatsLastAppliedBlock } from '@shared/types/network/network-stats-last-applied-block.type';

export interface MempoolEndorsementState {
  statistics: MempoolEndorsementStatistics;
  endorsements: MempoolEndorsement[];
  animateTable: boolean;
  isLoadingNewBlock: boolean;
  currentRound: MempoolPartialRound;
  rounds: MempoolPartialRound[];
  activeBaker: string;
  sort: MempoolEndorsementSort;
}
