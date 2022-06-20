import { RewardsBatch } from '@shared/types/rewards/rewards-batch.type';
import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';

export interface RewardsActiveBaker extends RewardsBaker {
  batches: RewardsBatch[];
}
