import { BakingPaymentStatus } from '@shared/types/bakings/baking-payment-status.type';

export interface BakingDelegator {
  hash: string;
  name: string;
  logo: string;
  reward: number;
  rewardAfterFee: number;
  fee: number;
  balance: number;
  batch: number;
  status: BakingPaymentStatus;
}
