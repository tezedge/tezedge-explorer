import { RewardsPaymentStatus } from '@shared/types/rewards/rewards-payment-status.type';

export interface RewardsBatch {
  index: number;
  transactions: number;
  reward: number;
  rewardAfterFee: number;
  operationHash?: string;
  status: undefined | RewardsPaymentStatus;
}
