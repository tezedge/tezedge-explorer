import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/endorsement/mempool-endorsement-sort.type';
import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';

enum MempoolEndorsementActionTypes {
  MEMPOOL_ENDORSEMENTS_INIT = 'MEMPOOL_ENDORSEMENTS_INIT',
  MEMPOOL_ENDORSEMENT_SET_ROUND = 'MEMPOOL_ENDORSEMENT_SET_ROUND',
  MEMPOOL_ENDORSEMENT_LOAD = 'MEMPOOL_ENDORSEMENT_LOAD',
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS = 'MEMPOOL_ENDORSEMENT_LOAD_SUCCESS',
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES = 'MEMPOOL_ENDORSEMENT_UPDATE_STATUSES',
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS = 'MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS',
  MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER = 'MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER',
  MEMPOOL_ENDORSEMENT_SORT = 'MEMPOOL_ENDORSEMENT_SORT',
  MEMPOOL_ENDORSEMENT_STOP = 'MEMPOOL_ENDORSEMENT_STOP',
}

export const MEMPOOL_ENDORSEMENTS_INIT = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENTS_INIT;
export const MEMPOOL_ENDORSEMENT_SET_ROUND = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_SET_ROUND;
export const MEMPOOL_ENDORSEMENT_LOAD = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_LOAD;
export const MEMPOOL_ENDORSEMENT_LOAD_SUCCESS = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_LOAD_SUCCESS;
export const MEMPOOL_ENDORSEMENT_UPDATE_STATUSES = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_UPDATE_STATUSES;
export const MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS;
export const MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER;
export const MEMPOOL_ENDORSEMENT_SORT = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_SORT;
export const MEMPOOL_ENDORSEMENT_STOP = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_STOP;

interface MempoolEndorsementsAction extends FeatureAction<MempoolEndorsementActionTypes> {}

export class MempoolEndorsementsInit implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENTS_INIT;
}

export class MempoolEndorsementSetRound implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_SET_ROUND;

  constructor(public payload: { round: MempoolConsensusRound }) { }
}

export class MempoolEndorsementLoad implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_LOAD;

  constructor(public payload: { blockLevel: number }) { }
}

export class MempoolEndorsementLoadSuccess implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_LOAD_SUCCESS;

  constructor(public payload: { endorsements: MempoolEndorsement[] }) { }
}

export class MempoolEndorsementUpdateStatuses implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_UPDATE_STATUSES;
}

export class MempoolEndorsementUpdateStatusesSuccess implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS;

  constructor(public payload: { [slot: string]: MempoolEndorsement }[]) { }
}

export class MempoolEndorsementSorting implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_SORT;

  constructor(public payload: MempoolEndorsementSort) { }
}

export class MempoolEndorsementSetActiveBaker implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER;

  constructor(public payload: string) { }
}

export class MempoolEndorsementStop implements MempoolEndorsementsAction {
  readonly type = MEMPOOL_ENDORSEMENT_STOP;
}

export type MempoolEndorsementActions =
  | MempoolEndorsementsInit
  | MempoolEndorsementSetRound
  | MempoolEndorsementLoad
  | MempoolEndorsementLoadSuccess
  | MempoolEndorsementUpdateStatuses
  | MempoolEndorsementUpdateStatusesSuccess
  | MempoolEndorsementSorting
  | MempoolEndorsementSetActiveBaker
  | MempoolEndorsementStop
  ;
