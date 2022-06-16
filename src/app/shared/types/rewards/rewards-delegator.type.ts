import { RewardsPaymentStatus } from '@shared/types/rewards/rewards-payment-status.type';

export interface RewardsDelegator {
  hash: string;
  name: string;
  logo: string;
  reward: number;
  rewardAfterFee: number;
  fee: number;
  balance: number;
  batch: number;
  status: RewardsPaymentStatus;
}
