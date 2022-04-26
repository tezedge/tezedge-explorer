import { BakingBaker } from '@shared/types/bakings/baking-baker.type';
import { State } from '@app/app.index';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import { ActiveBaker } from '@shared/types/bakings/active-baker.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';

export interface BakingState {
  cycle: number;
  bakers: BakingBaker[];
  ledger: BakingLedger;
  activeBaker: ActiveBaker;
  delegators: BakingDelegator[];
  sortedDelegators: BakingDelegator[];
  activeBakerHash: string;
  commissionFee: number;
  transactionFee: number;
  sort: TableSort;
}

export const selectBakingCycle = (state: State): number => state.baking.cycle;
export const selectBakingBakers = (state: State): BakingBaker[] => state.baking.bakers;
export const selectBakingLedger = (state: State): BakingLedger => state.baking.ledger;
export const selectBakingActiveBaker = (state: State): ActiveBaker => state.baking.activeBaker;
export const selectSortedDelegators = (state: State): BakingDelegator[] => state.baking.sortedDelegators;
export const selectInitialDelegators = (state: State): BakingDelegator[] => state.baking.delegators;
export const selectBakingSort = (state: State): TableSort => state.baking.sort;
export const selectFees = (state: State): { commissionFee: number, transactionFee: number } => ({
  commissionFee: state.baking.commissionFee,
  transactionFee: state.baking.transactionFee,
});
