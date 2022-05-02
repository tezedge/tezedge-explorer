import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';

export interface MempoolConsensusRound extends MempoolBlockRound {
  maxTime: number;
}
