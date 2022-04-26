import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { MempoolConsensusBlock } from '@shared/types/mempool/consensus/mempool-consensus-block.type';
import { MempoolConstants } from '@shared/types/mempool/common/mempool-constants.type';

enum MempoolConsensusActionTypes {
  MEMPOOL_CONSENSUS_INIT = 'MEMPOOL_CONSENSUS_INIT',
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS = 'MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS',
  MEMPOOL_CONSENSUS_GET_BLOCKS_ROUNDS_SUCCESS = 'MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS',
  MEMPOOL_CONSENSUS_SET_BLOCK = 'MEMPOOL_CONSENSUS_SET_BLOCK',
  MEMPOOL_CONSENSUS_SET_ROUND = 'MEMPOOL_CONSENSUS_SET_ROUND',
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD = 'MEMPOOL_CONSENSUS_CONSTANTS_LOAD',
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS = 'MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS',
  MEMPOOL_CONSENSUS_STOP = 'MEMPOOL_CONSENSUS_STOP',
  MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS = 'MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS',
  MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS = 'MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS',
  MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS = 'MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS',
}

export const MEMPOOL_CONSENSUS_INIT = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_INIT;
export const MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS;
export const MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_GET_BLOCKS_ROUNDS_SUCCESS;
export const MEMPOOL_CONSENSUS_SET_BLOCK = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_SET_BLOCK;
export const MEMPOOL_CONSENSUS_SET_ROUND = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_SET_ROUND;
export const MEMPOOL_CONSENSUS_CONSTANTS_LOAD = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_CONSTANTS_LOAD;
export const MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS;
export const MEMPOOL_CONSENSUS_STOP = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_STOP;
export const MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS;
export const MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS;
export const MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS = MempoolConsensusActionTypes.MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS;

export interface MempoolConsensusAction extends FeatureAction<MempoolConsensusActionTypes> {}

export class MempoolConsensusInit implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_INIT;
}

export class MempoolConsensusGetBlockRounds implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS;

  constructor(public payload: { blockLevel: number, isLastAppliedBlock?: boolean }) { }
}

export class MempoolConsensusGetBlockRoundsSuccess implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS;

  constructor(public payload: MempoolConsensusBlock) { }
}

export class MempoolConsensusSetBlock implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_SET_BLOCK;

  constructor(public payload: MempoolConsensusBlock) { }
}

export class MempoolConsensusSetRound implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_SET_ROUND;

  constructor(public payload: number) { }
}

export class MempoolConsensusConstantsLoad implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_CONSTANTS_LOAD;
}

export class MempoolConsensusConstantsLoadSuccess implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS;

  constructor(public payload: MempoolConstants) { }
}

export class MempoolConsensusStop implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_STOP;
}

export class MempoolConsensusStartSearchingRounds implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS;

  constructor(public payload: { blockLevel: number }) { }
}

export class MempoolConsensusCheckNewRounds implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS;
}

export class MempoolConsensusCheckNewRoundsSuccess implements MempoolConsensusAction {
  readonly type = MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS;

  constructor(public payload: MempoolConsensusBlock) { }
}

export type MempoolConsensusActions =
  | MempoolConsensusInit
  | MempoolConsensusGetBlockRounds
  | MempoolConsensusGetBlockRoundsSuccess
  | MempoolConsensusSetBlock
  | MempoolConsensusSetRound
  | MempoolConsensusConstantsLoad
  | MempoolConsensusConstantsLoadSuccess
  | MempoolConsensusStop
  | MempoolConsensusStartSearchingRounds
  | MempoolConsensusCheckNewRounds
  | MempoolConsensusCheckNewRoundsSuccess
  ;
