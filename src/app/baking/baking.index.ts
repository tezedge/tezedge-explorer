import { BakingBaker } from '@shared/types/bakings/baking-baker.type';
import { State } from '@app/app.index';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import { ActiveBaker } from '@shared/types/bakings/active-baker.type';
import { TableSort } from '@shared/types/shared/table-sort.type';

export interface BakingState {
  cycle: number;
  bakers: BakingBaker[];
  ledger: BakingLedger;
  activeBaker: ActiveBaker;
  activeBakerHash: string;
  commissionFee: number;
  transactionFee: number;
  sort: TableSort;
}

export const selectBakingState = (state: State): BakingState => state.baking;
export const selectBakingBakers = (state: State): BakingBaker[] => state.baking.bakers;
export const selectBakingLedger = (state: State): BakingLedger => state.baking.ledger;
export const selectBakingActiveBaker = (state: State): ActiveBaker => state.baking.activeBaker;
export const selectBakingSort = (state: State): TableSort => state.baking.sort;
export const selectFees = (state: State): { commissionFee: number, transactionFee: number } => ({
  commissionFee: state.baking.commissionFee,
  transactionFee: state.baking.transactionFee,
});
