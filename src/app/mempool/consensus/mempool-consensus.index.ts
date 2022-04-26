import { MempoolConsensusBlock } from '@shared/types/mempool/consensus/mempool-consensus-block.type';
import { State } from '@app/app.index';
import { MempoolConstants } from '@shared/types/mempool/common/mempool-constants.type';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

export interface MempoolConsensusState {
  blocks: MempoolConsensusBlock[];
  activeBlock: MempoolConsensusBlock;
  constants: MempoolConstants;
  lastAppliedBlock: number;
  blockToRecheck: number;
  rounds: MempoolConsensusRound[];
  activeRound: MempoolConsensusRound;
  activeRoundIndex: number;
}

export const selectMempoolConsensusState = (state: State): MempoolConsensusState => state.mempool.consensusState;
export const selectMempoolConsensusConstants = (state: State): MempoolConstants => state.mempool.consensusState.constants;
export const selectMempoolConsensusLastBlock = (state: State): MempoolConsensusBlock => {
  const consensusState = state.mempool.consensusState;
  return consensusState.blocks.length === 2 ? consensusState.blocks[consensusState.blocks.length - 1] : null;
};
export const selectMempoolConsensusRounds = (state: State): MempoolConsensusRound[] => state.mempool.consensusState.rounds;
export const selectMempoolConsensusActiveBlockLevel = (state: State): number => state.mempool.consensusState.activeBlock?.level;
export const selectMempoolConsensusActiveBlockRound = (state: State): MempoolConsensusRound => {
  const activeBlock = state.mempool.consensusState.activeBlock;
  return activeBlock?.rounds[activeBlock?.activeRoundIndex];
};
