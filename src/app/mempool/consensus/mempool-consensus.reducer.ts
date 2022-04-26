import { MempoolConsensusState } from '@mempool/consensus/mempool-consensus.index';
import {
  MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_SET_ROUND,
  MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS,
  MEMPOOL_CONSENSUS_STOP,
  MempoolConsensusActions
} from '@mempool/consensus/mempool-consensus.actions';
import { MempoolConstants } from '@shared/types/mempool/common/mempool-constants.type';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

const initialState: MempoolConsensusState = {
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
      const newRounds = addMaxTimeToRounds(action.payload.rounds, state.constants);

      const isOneBlockLevelInState = state.rounds.length > 0 && state.rounds.every(r => r.blockLevel === state.rounds[0].blockLevel);
      const biggestLevel = Math.max(...[...state.rounds, ...newRounds].map(r => r.blockLevel));
      const rounds = [...state.rounds.filter(r => r.blockLevel === (biggestLevel - 1) || r.blockLevel === biggestLevel), ...newRounds]
        .sort((r1, r2) => Number(r1.receiveTimestamp) - Number(r2.receiveTimestamp));
      const activeRound = !isOneBlockLevelInState && rounds.find(r => r.blockLevel === state.activeRound?.blockLevel) ? state.activeRound : rounds[rounds.length - 1];

      return {
        ...state,
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
      const rounds = addMaxTimeToRounds(action.payload.rounds, state.constants);

      return {
        ...state,
        rounds: [...state.rounds, ...rounds]
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

function addMaxTimeToRounds(rounds: MempoolConsensusRound[], constants: MempoolConstants): MempoolConsensusRound[] {
  return rounds.map((round: MempoolConsensusRound) => ({
    ...round,
    maxTime: constants.minimalBlockDelay + (constants.delayIncrementPerRound * round.round)
  }));
}
