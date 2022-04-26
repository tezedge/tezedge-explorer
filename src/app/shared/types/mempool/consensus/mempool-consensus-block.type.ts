import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

export interface MempoolConsensusBlock {
  level: number;
  rounds: MempoolConsensusRound[];
  activeRoundIndex: number;
}
