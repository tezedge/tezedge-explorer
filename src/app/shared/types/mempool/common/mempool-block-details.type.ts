import { MempoolBlockStepTimes } from '@shared/types/mempool/common/mempool-block-step-times.type';

export interface MempoolBlockDetails {
  blockHash: string;
  blockTimestamp: number;
  receiveTimestamp: number;
  baker: string;
  bakerPriority: number;

  value: MempoolBlockStepTimes;
  delta: MempoolBlockStepTimes;
}
