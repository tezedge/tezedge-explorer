import { MempoolBlockStepTimes } from '@shared/types/mempool/common/mempool-block-step-times.type';

export interface MempoolBlockRound {
  blockHash: string;
  blockLevel: number;
  round: number;
  blockTimestamp: string;
  receiveTimestamp: string;
  baker: string;
  bakerPriority: number;

  value: MempoolBlockStepTimes;
  delta: MempoolBlockStepTimes;
}
