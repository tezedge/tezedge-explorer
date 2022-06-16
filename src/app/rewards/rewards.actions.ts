import { FeatureAction } from '@shared/types/shared/store/feature-action.type';
import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';
import { RewardsLedger } from '@shared/types/rewards/rewards-ledger.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { RewardsBatch } from '@shared/types/rewards/rewards-batch.type';
import { RewardsDelegator } from '@shared/types/rewards/rewards-delegator.type';

enum RewardsActionTypes {
  REWARDS_INIT = 'REWARDS_INIT',
  REWARDS_GET_CYCLE = 'REWARDS_GET_CYCLE',
  REWARDS_GET_BAKERS = 'REWARDS_GET_BAKERS',
  REWARDS_GET_BAKERS_SUCCESS = 'REWARDS_GET_BAKERS_SUCCESS',
  REWARDS_GET_DELEGATORS = 'REWARDS_GET_DELEGATORS',
  REWARDS_GET_DELEGATORS_SUCCESS = 'REWARDS_GET_DELEGATORS_SUCCESS',
  REWARDS_GET_CYCLE_SUCCESS = 'REWARDS_GET_CYCLE_SUCCESS',
  REWARDS_SET_ACTIVE_BAKER = 'REWARDS_SET_ACTIVE_BAKER',
  REWARDS_LEDGER_CONNECTED = 'REWARDS_LEDGER_CONNECTED',
  REWARDS_SORT_DELEGATES = 'REWARDS_SORT_DELEGATES',
  REWARDS_SORT_DELEGATORS = 'REWARDS_SORT_DELEGATORS',
  REWARDS_ADD_DISTRIBUTED_REWARD = 'REWARDS_ADD_DISTRIBUTED_REWARD',
  REWARDS_GET_TRANSACTION_STATUSES = 'REWARDS_GET_TRANSACTION_STATUSES',
  REWARDS_UPDATE_TRANSACTION_STATUSES = 'REWARDS_UPDATE_TRANSACTION_STATUSES',
  REWARDS_STOP_GETTING_TRANSACTION_STATUSES = 'REWARDS_STOP_GETTING_TRANSACTION_STATUSES',
  REWARDS_APPLY_COMMISSION_FEE = 'REWARDS_APPLY_COMMISSION_FEE',
  REWARDS_APPLY_TRANSACTION_FEE = 'REWARDS_APPLY_TRANSACTION_FEE',
  REWARDS_STOP = 'REWARDS_STOP',
}

export const REWARDS_INIT = RewardsActionTypes.REWARDS_INIT;
export const REWARDS_GET_CYCLE = RewardsActionTypes.REWARDS_GET_CYCLE;
export const REWARDS_GET_CYCLE_SUCCESS = RewardsActionTypes.REWARDS_GET_CYCLE_SUCCESS;
export const REWARDS_GET_BAKERS = RewardsActionTypes.REWARDS_GET_BAKERS;
export const REWARDS_GET_BAKERS_SUCCESS = RewardsActionTypes.REWARDS_GET_BAKERS_SUCCESS;
export const REWARDS_GET_DELEGATORS = RewardsActionTypes.REWARDS_GET_DELEGATORS;
export const REWARDS_GET_DELEGATORS_SUCCESS = RewardsActionTypes.REWARDS_GET_DELEGATORS_SUCCESS;
export const REWARDS_SET_ACTIVE_BAKER = RewardsActionTypes.REWARDS_SET_ACTIVE_BAKER;
export const REWARDS_LEDGER_CONNECTED = RewardsActionTypes.REWARDS_LEDGER_CONNECTED;
export const REWARDS_SORT_DELEGATES = RewardsActionTypes.REWARDS_SORT_DELEGATES;
export const REWARDS_SORT_DELEGATORS = RewardsActionTypes.REWARDS_SORT_DELEGATORS;
export const REWARDS_ADD_DISTRIBUTED_REWARD = RewardsActionTypes.REWARDS_ADD_DISTRIBUTED_REWARD;
export const REWARDS_GET_TRANSACTION_STATUSES = RewardsActionTypes.REWARDS_GET_TRANSACTION_STATUSES;
export const REWARDS_UPDATE_TRANSACTION_STATUSES = RewardsActionTypes.REWARDS_UPDATE_TRANSACTION_STATUSES;
export const REWARDS_STOP_GETTING_TRANSACTION_STATUSES = RewardsActionTypes.REWARDS_STOP_GETTING_TRANSACTION_STATUSES;
export const REWARDS_APPLY_COMMISSION_FEE = RewardsActionTypes.REWARDS_APPLY_COMMISSION_FEE;
export const REWARDS_APPLY_TRANSACTION_FEE = RewardsActionTypes.REWARDS_APPLY_TRANSACTION_FEE;
export const REWARDS_STOP = RewardsActionTypes.REWARDS_STOP;

export interface RewardsAction extends FeatureAction<RewardsActionTypes> {
  readonly type: RewardsActionTypes;
}

export class RewardsInit implements RewardsAction {
  readonly type = REWARDS_INIT;
}

export class RewardsGetCycle implements RewardsAction {
  readonly type = REWARDS_GET_CYCLE;
}

export class RewardsGetCycleSuccess implements RewardsAction {
  readonly type = REWARDS_GET_CYCLE_SUCCESS;

  constructor(public payload: { cycle: number }) { }
}

export class RewardsGetBakers implements RewardsAction {
  readonly type = REWARDS_GET_BAKERS;

  constructor(public payload: { cycle: number }) { }
}

export class RewardsGetBakersSuccess implements RewardsAction {
  readonly type = REWARDS_GET_BAKERS_SUCCESS;

  constructor(public payload: { bakers: RewardsBaker[] }) { }
}

export class RewardsGetDelegators implements RewardsAction {
  readonly type = REWARDS_GET_DELEGATORS;

  constructor(public payload: { cycle: number, bakerHash: string }) { }
}

export class RewardsGetDelegatorsSuccess implements RewardsAction {
  readonly type = REWARDS_GET_DELEGATORS_SUCCESS;

  constructor(public payload: RewardsDelegator[]) { }
}

export class RewardsSetActiveBaker implements RewardsAction {
  readonly type = REWARDS_SET_ACTIVE_BAKER;

  constructor(public payload: { hash: string, ledger?: RewardsLedger }) { }
}

export class RewardsSortDelegates implements RewardsAction {
  readonly type = REWARDS_SORT_DELEGATES;

  constructor(public payload: TableSort) { }
}

export class RewardsSortDelegators implements RewardsAction {
  readonly type = REWARDS_SORT_DELEGATORS;

  constructor(public payload: TableSort) { }
}

export class RewardsLedgerConnected implements RewardsAction {
  readonly type = REWARDS_LEDGER_CONNECTED;

  constructor(public payload: { ledger: RewardsLedger }) { }
}

export class RewardsAddDistributedReward implements RewardsAction {
  readonly type = REWARDS_ADD_DISTRIBUTED_REWARD;

  constructor(public payload: { batch: RewardsBatch }) { }
}

export class RewardsGetTransactionStatuses implements RewardsAction {
  readonly type = REWARDS_GET_TRANSACTION_STATUSES;
}

export class RewardsUpdateTransactionStatuses implements RewardsAction {
  readonly type = REWARDS_UPDATE_TRANSACTION_STATUSES;

  constructor(public payload: { source: string, destination: string, status: string, operation: string }[]) { }
}

export class RewardsApplyCommissionFee implements RewardsAction {
  readonly type = REWARDS_APPLY_COMMISSION_FEE;

  constructor(public payload: number) { }
}

export class RewardsApplyTransactionFee implements RewardsAction {
  readonly type = REWARDS_APPLY_TRANSACTION_FEE;

  constructor(public payload: number) { }
}

export class RewardsStopGettingTransactionStatuses implements RewardsAction {
  readonly type = REWARDS_STOP_GETTING_TRANSACTION_STATUSES;
}

export class RewardsStop implements RewardsAction {
  readonly type = REWARDS_STOP;
}

export type RewardsActions =
  | RewardsInit
  | RewardsGetCycle
  | RewardsGetCycleSuccess
  | RewardsGetBakers
  | RewardsGetBakersSuccess
  | RewardsGetDelegators
  | RewardsGetDelegatorsSuccess
  | RewardsSetActiveBaker
  | RewardsLedgerConnected
  | RewardsSortDelegates
  | RewardsSortDelegators
  | RewardsAddDistributedReward
  | RewardsGetTransactionStatuses
  | RewardsUpdateTransactionStatuses
  | RewardsStopGettingTransactionStatuses
  | RewardsApplyCommissionFee
  | RewardsApplyTransactionFee
  | RewardsStop
  ;
