import { MempoolConsensusState } from '@mempool/consensus/mempool-consensus.index';
import {
  MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_SET_BLOCK,
  MEMPOOL_CONSENSUS_SET_ROUND,
  MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS,
  MEMPOOL_CONSENSUS_STOP,
  MempoolConsensusActions
} from '@mempool/consensus/mempool-consensus.actions';
import { MempoolConsensusBlock } from '@shared/types/mempool/consensus/mempool-consensus-block.type';
import { MempoolConstants } from '@shared/types/mempool/common/mempool-constants.type';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

const initialState: MempoolConsensusState = {
  blocks: [],
  activeBlock: null,
  constants: null,
  lastAppliedBlock: 0,
  blockToRecheck: null,
  rounds: [],
  activeRound: null,
  activeRoundIndex: 0,
};

export function reducer(state: MempoolConsensusState = initialState, action: MempoolConsensusActions): MempoolConsensusState {
  switch (action.type) {

    case MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS: {
      return {
        ...state,
        lastAppliedBlock: action.payload.isLastAppliedBlock ? action.payload.blockLevel : state.lastAppliedBlock
      };
    }

    case MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS: {
      const newBlock = addMaxTimeToRounds(action.payload, state.constants);
      const isInitialLoad = state.blocks.length === 1;
      let blocks = [...state.blocks, newBlock];

      if (blocks.length >= 2) {
        blocks = blocks.slice(-2).sort((b1, b2) => b1.level - b2.level);
      }

      const roundIsInitialLoad = state.rounds.length > 0 && state.rounds.every(r => r.blockLevel === state.rounds[0].blockLevel);
      const biggestLevel = Math.max(...[...state.rounds, ...newBlock.rounds].map(r => r.blockLevel));
      const rounds = [...state.rounds.filter(r => r.blockLevel === (biggestLevel - 1) || r.blockLevel === biggestLevel), ...newBlock.rounds]
        .sort((r1, r2) => r1.blockLevel - r2.blockLevel);
      const activeRound = !roundIsInitialLoad && rounds.find(r => r.blockLevel === state.activeRound?.blockLevel) ? state.activeRound : rounds[rounds.length - 1];

      return {
        ...state,
        blocks,
        activeBlock: !isInitialLoad && blocks.find(b => b.level === state.activeBlock?.level) ? state.activeBlock : blocks[blocks.length - 1],
        rounds,
        activeRound,
        activeRoundIndex: rounds.indexOf(activeRound)
      };
    }

    case MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS: {
      return {
        ...state,
        constants: action.payload
      };
    }

    case MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS: {
      return {
        ...state,
        blockToRecheck: action.payload.blockLevel
      };
    }

    case MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS: {
      const newBlock = addMaxTimeToRounds(action.payload, state.constants);

      return {
        ...state,
        blocks: [state.blocks[0], newBlock],
        activeBlock: state.activeBlock.level === newBlock.level ? newBlock : state.activeBlock,
        rounds: [...state.rounds, ...newBlock.rounds]
      };
    }

    case MEMPOOL_CONSENSUS_SET_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload
      };
    }

    case MEMPOOL_CONSENSUS_SET_ROUND: {
      return {
        ...state,
        activeRoundIndex: action.payload,
        activeRound: state.rounds[action.payload]
      };
    }

    case MEMPOOL_CONSENSUS_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function addMaxTimeToRounds(block: MempoolConsensusBlock, constants: MempoolConstants): MempoolConsensusBlock {
  const rounds = block.rounds.map((round: MempoolConsensusRound) => ({
    ...round,
    maxTime: constants.minimalBlockDelay + (constants.delayIncrementPerRound * round.round)
  }));
  return { ...block, rounds };
}
