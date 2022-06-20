import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';
import { State } from '@app/app.index';
import { RewardsLedger } from '@shared/types/rewards/rewards-ledger.type';
import { RewardsActiveBaker } from '@shared/types/rewards/rewards-active-baker.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { RewardsDelegator } from '@shared/types/rewards/rewards-delegator.type';

export interface RewardsState {
  cycle: number;
  bakers: RewardsBaker[];
  ledger: RewardsLedger;
  activeBaker: RewardsActiveBaker;
  delegators: RewardsDelegator[];
  sortedDelegators: RewardsDelegator[];
  activeBakerHash: string;
  commissionFee: number;
  transactionFee: number;
  sort: TableSort;
}

export const selectRewardsCycle = (state: State): number => state.rewards.cycle;
export const selectRewardsBakers = (state: State): RewardsBaker[] => state.rewards.bakers;
export const selectRewardsLedger = (state: State): RewardsLedger => state.rewards.ledger;
export const selectRewardsActiveBaker = (state: State): RewardsActiveBaker => state.rewards.activeBaker;
export const selectRewardsSortedDelegators = (state: State): RewardsDelegator[] => state.rewards.sortedDelegators;
export const selectRewardsInitialDelegators = (state: State): RewardsDelegator[] => state.rewards.delegators;
export const selectRewardsSort = (state: State): TableSort => state.rewards.sort;
export const selectRewardsFees = (state: State): { commissionFee: number, transactionFee: number } => ({
  commissionFee: state.rewards.commissionFee,
  transactionFee: state.rewards.transactionFee,
});
