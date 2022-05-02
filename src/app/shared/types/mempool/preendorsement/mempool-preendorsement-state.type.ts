import { MempoolPreEndorsementSort } from '@shared/types/mempool/preendorsement/mempool-preendorsement-sort.type';
import { MempoolPreEndorsement } from '@shared/types/mempool/preendorsement/mempool-preendorsement.type';
import { MempoolPreEndorsementStatistics } from '@shared/types/mempool/preendorsement/mempool-preendorsement-statistics.type';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

export interface MempoolPreEndorsementState {
  statistics: MempoolPreEndorsementStatistics;
  endorsements: MempoolPreEndorsement[];
  animateTable: boolean;
  isLoadingNewBlock: boolean;
  currentRound: MempoolConsensusRound;
  // rounds: MempoolPartialRound[];
  activeBaker: string;
  sort: MempoolPreEndorsementSort;
}
