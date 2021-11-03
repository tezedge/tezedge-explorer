import { Action } from '@ngrx/store';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';

enum MempoolEndorsementActionTypes {
  MEMPOOL_ENDORSEMENTS_INIT = 'MEMPOOL_ENDORSEMENTS_INIT',
  MEMPOOL_ENDORSEMENT_LOAD = 'MEMPOOL_ENDORSEMENT_LOAD',
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS = 'MEMPOOL_ENDORSEMENT_LOAD_SUCCESS',
  MEMPOOL_ENDORSEMENT_STOP = 'MEMPOOL_ENDORSEMENT_STOP',
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES = 'MEMPOOL_ENDORSEMENT_UPDATE_STATUSES',
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS = 'MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS',
  MEMPOOL_ENDORSEMENT_SORT = 'MEMPOOL_ENDORSEMENT_SORT',
}

export const MEMPOOL_ENDORSEMENTS_INIT = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENTS_INIT;
export const MEMPOOL_ENDORSEMENT_STOP = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_STOP;
export const MEMPOOL_ENDORSEMENT_LOAD = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_LOAD;
export const MEMPOOL_ENDORSEMENT_LOAD_SUCCESS = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_LOAD_SUCCESS;
export const MEMPOOL_ENDORSEMENT_UPDATE_STATUSES = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_UPDATE_STATUSES;
export const MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS;
export const MEMPOOL_ENDORSEMENT_SORT = MempoolEndorsementActionTypes.MEMPOOL_ENDORSEMENT_SORT;

export class MempoolEndorsementsInit implements Action {
  readonly type = MEMPOOL_ENDORSEMENTS_INIT;
}

export class MempoolEndorsementLoad implements Action {
  readonly type = MEMPOOL_ENDORSEMENT_LOAD;

  constructor(public payload: { currentBlock: number }) { }
}

export class MempoolEndorsementLoadSuccess implements Action {
  readonly type = MEMPOOL_ENDORSEMENT_LOAD_SUCCESS;

  constructor(public payload: { endorsements: MempoolEndorsement[] }) { }
}

export class MempoolEndorsementUpdateStatuses implements Action {
  readonly type = MEMPOOL_ENDORSEMENT_UPDATE_STATUSES;
}

export class MempoolEndorsementUpdateStatusesSuccess implements Action {
  readonly type = MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS;

  constructor(public payload: { [slot: string]: MempoolEndorsement }[]) { }
}

export class MempoolEndorsementSorting implements Action {
  readonly type = MEMPOOL_ENDORSEMENT_SORT;

  constructor(public payload: MempoolEndorsementSort) { }
}

export class MempoolEndorsementStop implements Action {
  readonly type = MEMPOOL_ENDORSEMENT_STOP;
}

export type MempoolEndorsementActions = MempoolEndorsementsInit
  | MempoolEndorsementLoad
  | MempoolEndorsementLoadSuccess
  | MempoolEndorsementUpdateStatuses
  | MempoolEndorsementUpdateStatusesSuccess
  | MempoolEndorsementSorting
  | MempoolEndorsementStop
  ;
