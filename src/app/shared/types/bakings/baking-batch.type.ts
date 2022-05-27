import { BakingPaymentStatus } from '@shared/types/bakings/baking-payment-status.type';

export interface BakingBatch {
  index: number;
  transactions: number;
  reward: number;
  rewardAfterFee: number;
  operationHash?: string;
  status: undefined | BakingPaymentStatus;
}
