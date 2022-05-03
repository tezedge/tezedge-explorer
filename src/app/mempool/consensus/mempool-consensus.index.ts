import { State } from '@app/app.index';
import { MempoolConstants } from '@shared/types/mempool/common/mempool-constants.type';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

export interface MempoolConsensusState {
  constants: MempoolConstants;
  lastAppliedBlock: number;
  blockToRecheck: number;
  rounds: MempoolConsensusRound[];
  activeRound: MempoolConsensusRound;
  activeRoundIndex: number;
}

export const selectMempoolConsensusState = (state: State): MempoolConsensusState => state.mempool.consensusState;
export const selectMempoolConsensusConstants = (state: State): MempoolConstants => state.mempool.consensusState.constants;
export const selectMempoolConsensusRounds = (state: State): MempoolConsensusRound[] => state.mempool.consensusState.rounds;
export const selectMempoolConsensusActiveRound = (state: State): MempoolConsensusRound => state.mempool.consensusState.activeRound;
