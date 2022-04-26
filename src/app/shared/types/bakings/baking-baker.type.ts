import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';

export interface BakingBaker {
  hash: string;
  logo: string;
  bakerName: string;
  reward: number;
  rewardAfterFee: number;
  rewardToDistribute: number;
  balance: number;
  delegators: BakingDelegator[];
  sortedDelegators: BakingDelegator[];
}
