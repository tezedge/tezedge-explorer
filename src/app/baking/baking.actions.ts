import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { BakingBaker } from '@shared/types/bakings/baking-baker.type';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { BakingBatch } from '@shared/types/bakings/baking-batch.type';
import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';

enum BakingActionTypes {
  BAKING_INIT = 'BAKING_INIT',
  BAKING_GET_CYCLE = 'BAKING_GET_CYCLE',
  BAKING_GET_BAKERS = 'BAKING_GET_BAKERS',
  BAKING_GET_BAKERS_SUCCESS = 'BAKING_GET_BAKERS_SUCCESS',
  BAKING_GET_DELEGATORS = 'BAKING_GET_DELEGATORS',
  BAKING_GET_DELEGATORS_SUCCESS = 'BAKING_GET_DELEGATORS_SUCCESS',
  BAKING_GET_CYCLE_SUCCESS = 'BAKING_GET_CYCLE_SUCCESS',
  BAKING_SET_ACTIVE_BAKER = 'BAKING_SET_ACTIVE_BAKER',
  BAKING_LEDGER_CONNECTED = 'BAKING_LEDGER_CONNECTED',
  BAKING_SORT_DELEGATES = 'BAKING_SORT_DELEGATES',
  BAKING_SORT_DELEGATORS = 'BAKING_SORT_DELEGATORS',
  BAKING_ADD_DISTRIBUTED_REWARD = 'BAKING_ADD_DISTRIBUTED_REWARD',
  BAKING_GET_TRANSACTION_STATUSES = 'BAKING_GET_TRANSACTION_STATUSES',
  BAKING_UPDATE_TRANSACTION_STATUSES = 'BAKING_UPDATE_TRANSACTION_STATUSES',
  BAKING_STOP_GETTING_TRANSACTION_STATUSES = 'BAKING_STOP_GETTING_TRANSACTION_STATUSES',
  BAKING_APPLY_COMMISSION_FEE = 'BAKING_APPLY_COMMISSION_FEE',
  BAKING_APPLY_TRANSACTION_FEE = 'BAKING_APPLY_TRANSACTION_FEE',
  BAKING_STOP = 'BAKING_STOP',
}

export const BAKING_INIT = BakingActionTypes.BAKING_INIT;
export const BAKING_GET_CYCLE = BakingActionTypes.BAKING_GET_CYCLE;
export const BAKING_GET_CYCLE_SUCCESS = BakingActionTypes.BAKING_GET_CYCLE_SUCCESS;
export const BAKING_GET_BAKERS = BakingActionTypes.BAKING_GET_BAKERS;
export const BAKING_GET_BAKERS_SUCCESS = BakingActionTypes.BAKING_GET_BAKERS_SUCCESS;
export const BAKING_GET_DELEGATORS = BakingActionTypes.BAKING_GET_DELEGATORS;
export const BAKING_GET_DELEGATORS_SUCCESS = BakingActionTypes.BAKING_GET_DELEGATORS_SUCCESS;
export const BAKING_SET_ACTIVE_BAKER = BakingActionTypes.BAKING_SET_ACTIVE_BAKER;
export const BAKING_LEDGER_CONNECTED = BakingActionTypes.BAKING_LEDGER_CONNECTED;
export const BAKING_SORT_DELEGATES = BakingActionTypes.BAKING_SORT_DELEGATES;
export const BAKING_SORT_DELEGATORS = BakingActionTypes.BAKING_SORT_DELEGATORS;
export const BAKING_ADD_DISTRIBUTED_REWARD = BakingActionTypes.BAKING_ADD_DISTRIBUTED_REWARD;
export const BAKING_GET_TRANSACTION_STATUSES = BakingActionTypes.BAKING_GET_TRANSACTION_STATUSES;
export const BAKING_UPDATE_TRANSACTION_STATUSES = BakingActionTypes.BAKING_UPDATE_TRANSACTION_STATUSES;
export const BAKING_STOP_GETTING_TRANSACTION_STATUSES = BakingActionTypes.BAKING_STOP_GETTING_TRANSACTION_STATUSES;
export const BAKING_APPLY_COMMISSION_FEE = BakingActionTypes.BAKING_APPLY_COMMISSION_FEE;
export const BAKING_APPLY_TRANSACTION_FEE = BakingActionTypes.BAKING_APPLY_TRANSACTION_FEE;
export const BAKING_STOP = BakingActionTypes.BAKING_STOP;

export interface BakingAction extends FeatureAction<BakingActionTypes> {
  readonly type: BakingActionTypes;
}

export class BakingInit implements BakingAction {
  readonly type = BAKING_INIT;
}

export class BakingGetCycle implements BakingAction {
  readonly type = BAKING_GET_CYCLE;
}

export class BakingGetCycleSuccess implements BakingAction {
  readonly type = BAKING_GET_CYCLE_SUCCESS;

  constructor(public payload: { cycle: number }) { }
}

export class BakingGetBakers implements BakingAction {
  readonly type = BAKING_GET_BAKERS;

  constructor(public payload: { cycle: number }) { }
}

export class BakingGetBakersSuccess implements BakingAction {
  readonly type = BAKING_GET_BAKERS_SUCCESS;

  constructor(public payload: { bakers: BakingBaker[] }) { }
}

export class BakingGetDelegators implements BakingAction {
  readonly type = BAKING_GET_DELEGATORS;

  constructor(public payload: { cycle: number, bakerHash: string }) { }
}

export class BakingGetDelegatorsSuccess implements BakingAction {
  readonly type = BAKING_GET_DELEGATORS_SUCCESS;

  constructor(public payload: BakingDelegator[]) { }
}

export class BakingSetActiveBaker implements BakingAction {
  readonly type = BAKING_SET_ACTIVE_BAKER;

  constructor(public payload: { hash: string, ledger?: BakingLedger }) { }
}

export class BakingSortDelegates implements BakingAction {
  readonly type = BAKING_SORT_DELEGATES;

  constructor(public payload: TableSort) { }
}

export class BakingSortDelegators implements BakingAction {
  readonly type = BAKING_SORT_DELEGATORS;

  constructor(public payload: TableSort) { }
}

export class BakingLedgerConnected implements BakingAction {
  readonly type = BAKING_LEDGER_CONNECTED;

  constructor(public payload: { ledger: BakingLedger }) { }
}

export class BakingAddDistributedReward implements BakingAction {
  readonly type = BAKING_ADD_DISTRIBUTED_REWARD;

  constructor(public payload: { batch: BakingBatch }) { }
}

export class BakingGetTransactionStatuses implements BakingAction {
  readonly type = BAKING_GET_TRANSACTION_STATUSES;
}

export class BakingUpdateTransactionStatuses implements BakingAction {
  readonly type = BAKING_UPDATE_TRANSACTION_STATUSES;

  constructor(public payload: { source: string, destination: string, status: string, operation: string }[]) { }
}

export class BakingApplyCommissionFee implements BakingAction {
  readonly type = BAKING_APPLY_COMMISSION_FEE;

  constructor(public payload: number) { }
}

export class BakingApplyTransactionFee implements BakingAction {
  readonly type = BAKING_APPLY_TRANSACTION_FEE;

  constructor(public payload: number) { }
}

export class BakingStopGettingTransactionStatuses implements BakingAction {
  readonly type = BAKING_STOP_GETTING_TRANSACTION_STATUSES;
}

export class BakingStop implements BakingAction {
  readonly type = BAKING_STOP;
}

export type BakingActions =
  | BakingInit
  | BakingGetCycle
  | BakingGetCycleSuccess
  | BakingGetBakers
  | BakingGetBakersSuccess
  | BakingGetDelegators
  | BakingGetDelegatorsSuccess
  | BakingSetActiveBaker
  | BakingLedgerConnected
  | BakingSortDelegates
  | BakingSortDelegators
  | BakingAddDistributedReward
  | BakingGetTransactionStatuses
  | BakingUpdateTransactionStatuses
  | BakingStopGettingTransactionStatuses
  | BakingApplyCommissionFee
  | BakingApplyTransactionFee
  | BakingStop
  ;
