import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { State } from '@app/app.index';

export interface MempoolBakingRightsState {
  bakingRights: MempoolBakingRight[];
  filteredBakingRights: MempoolBakingRight[];
  rounds: MempoolBlockRound[];
  activeRoundIndex: number;
  sort: TableSort;
  delta: boolean;
  stream: boolean;
  currentDisplayedBlock: number;
}

export const mempoolBakingRightsState = (state: State): MempoolBakingRightsState => state.mempool.bakingRightsState;
export const mempoolBakingRights = (state: State): MempoolBakingRight[] => state.mempool.bakingRightsState.bakingRights;
export const mempoolBakingRightsDetails = (state: State): MempoolBlockRound[] => state.mempool.bakingRightsState.rounds;
export const mempoolBakingRightsDelta = (state: State): boolean => state.mempool.bakingRightsState.delta;
export const mempoolBakingRightsActiveRoundIndex = (state: State): number => state.mempool.bakingRightsState.activeRoundIndex;
// export const mempoolBakingRightsCurrentDisplayedBlock = (state: State): number => state.mempool.bakingRightsState.currentDisplayedBlock;
