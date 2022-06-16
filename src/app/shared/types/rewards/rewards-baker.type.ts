export interface RewardsBaker {
  hash: string;
  logo: string;
  bakerName: string;
  reward: number;
  rewardAfterFee: number;
  rewardToDistribute: number;
  balance: number;
  delegatorsLength: number;
}
