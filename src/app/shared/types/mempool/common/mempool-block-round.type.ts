import { MempoolBlockStepTimes } from '@shared/types/mempool/common/mempool-block-step-times.type';

export interface MempoolBlockRound {
  blockHash: string;
  round: number;
  blockTimestamp: number;
  receiveTimestamp: number;
  baker: string;
  bakerPriority: number;

  value: MempoolBlockStepTimes;
  delta: MempoolBlockStepTimes;
}
