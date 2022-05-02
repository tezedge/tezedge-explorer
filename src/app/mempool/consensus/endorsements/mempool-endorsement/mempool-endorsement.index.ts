import { MempoolEndorsementStatistics } from '@shared/types/mempool/endorsement/mempool-endorsement-statistics.type';
import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/endorsement/mempool-endorsement-sort.type';
import { State } from '@app/app.index';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

export interface MempoolEndorsementState {
  statistics: MempoolEndorsementStatistics;
  endorsements: MempoolEndorsement[];
  animateTable: boolean;
  isLoadingNewBlock: boolean;
  currentRound: MempoolConsensusRound;
  // rounds: MempoolPartialRound[];
  activeBaker: string;
  sort: MempoolEndorsementSort;
}

export const selectMempoolEndorsementState = (state: State): MempoolEndorsementState => state.mempool.endorsementState;
export const selectMempoolEndorsements = (state: State): MempoolEndorsement[] => state.mempool.endorsementState.endorsements;
export const selectMempoolEndorsementTableAnimate = (state: State): boolean => state.mempool.endorsementState.animateTable;
export const selectMempoolEndorsementStatistics = (state: State): MempoolEndorsementStatistics => state.mempool.endorsementState.statistics;
export const selectMempoolEndorsementCurrentRound = (state: State): MempoolConsensusRound => state.mempool.endorsementState.currentRound;
export const selectMempoolEndorsementSorting = (state: State): MempoolEndorsementSort => state.mempool.endorsementState.sort;
export const selectMempoolEndorsementActiveBaker = (state: State): string => state.mempool.endorsementState.activeBaker;
