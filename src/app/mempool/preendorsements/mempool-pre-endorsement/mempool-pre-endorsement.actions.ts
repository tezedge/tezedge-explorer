import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { MempoolPreEndorsementSort } from '@shared/types/mempool/preendorsement/mempool-preendorsement-sort.type';
import { MempoolPreEndorsement } from '@shared/types/mempool/preendorsement/mempool-preendorsement.type';

enum MempoolPreEndorsementActionTypes {
  MEMPOOL_PREENDORSEMENT_INIT = 'MEMPOOL_PREENDORSEMENT_INIT',
  MEMPOOL_PREENDORSEMENT_LOAD_ROUND = 'MEMPOOL_PREENDORSEMENT_LOAD_ROUND',
  MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS = 'MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS',
  MEMPOOL_PREENDORSEMENT_LOAD = 'MEMPOOL_PREENDORSEMENT_LOAD',
  MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS = 'MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS',
  MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES = 'MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES',
  MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS = 'MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS',
  MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER = 'MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER',
  MEMPOOL_PREENDORSEMENT_SORT = 'MEMPOOL_PREENDORSEMENT_SORT',
  MEMPOOL_PREENDORSEMENT_STOP = 'MEMPOOL_PREENDORSEMENT_STOP',
}

export const MEMPOOL_PREENDORSEMENT_INIT = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_INIT;
export const MEMPOOL_PREENDORSEMENT_LOAD_ROUND = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_LOAD_ROUND;
export const MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS;
export const MEMPOOL_PREENDORSEMENT_LOAD = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_LOAD;
export const MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS;
export const MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES;
export const MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS;
export const MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER;
export const MEMPOOL_PREENDORSEMENT_SORT = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_SORT;
export const MEMPOOL_PREENDORSEMENT_STOP = MempoolPreEndorsementActionTypes.MEMPOOL_PREENDORSEMENT_STOP;

interface MempoolPreEndorsementsAction extends FeatureAction<MempoolPreEndorsementActionTypes> { }

export class MempoolPreEndorsementsInit implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_INIT;
}

export class MempoolPreEndorsementLoadRound implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_LOAD_ROUND;

  constructor(public payload: { blockLevel: number }) { }
}

export class MempoolPreEndorsementLoadRoundSuccess implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS;

  constructor(public payload: { rounds: MempoolBlockRound[] }) { }
}

export class MempoolPreEndorsementLoad implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_LOAD;

  constructor(public payload: { hash: string, level: number }) { }
}

export class MempoolPreEndorsementLoadSuccess implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS;

  constructor(public payload: { endorsements: MempoolPreEndorsement[] }) { }
}

export class MempoolPreEndorsementUpdateStatuses implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES;
}

export class MempoolPreEndorsementUpdateStatusesSuccess implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS;

  constructor(public payload: { [slot: string]: MempoolPreEndorsement }[]) { }
}

export class MempoolPreEndorsementSorting implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_SORT;

  constructor(public payload: MempoolPreEndorsementSort) { }
}

export class MempoolPreEndorsementSetActiveBaker implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER;

  constructor(public payload: string) { }
}

export class MempoolPreEndorsementStop implements MempoolPreEndorsementsAction {
  readonly type = MEMPOOL_PREENDORSEMENT_STOP;
}

export type MempoolPreEndorsementActions =
  | MempoolPreEndorsementsInit
  | MempoolPreEndorsementLoadRound
  | MempoolPreEndorsementLoadRoundSuccess
  | MempoolPreEndorsementLoad
  | MempoolPreEndorsementLoadSuccess
  | MempoolPreEndorsementUpdateStatuses
  | MempoolPreEndorsementUpdateStatusesSuccess
  | MempoolPreEndorsementSorting
  | MempoolPreEndorsementSetActiveBaker
  | MempoolPreEndorsementStop
  ;
