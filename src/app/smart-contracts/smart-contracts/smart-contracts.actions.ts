import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { FeatureAction } from '@shared/types/shared/store/feature-action.type';

enum SmartContractsActionTypes {
  SMART_CONTRACTS_LOAD = 'SMART_CONTRACTS_LOAD',
  SMART_CONTRACTS_LOAD_SUCCESS = 'SMART_CONTRACTS_LOAD_SUCCESS',
  SMART_CONTRACTS_RESET_BLOCKS = 'SMART_CONTRACTS_RESET_BLOCKS',
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT = 'SMART_CONTRACTS_SET_ACTIVE_CONTRACT',
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS = 'SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS',
  SMART_CONTRACTS_EXECUTE_CONTRACT = 'SMART_CONTRACTS_EXECUTE_CONTRACT',
  SMART_CONTRACTS_EXECUTE_CONTRACT_SUCCESS = 'SMART_CONTRACTS_EXECUTE_CONTRACT_SUCCESS',
  SMART_CONTRACTS_START_DEBUGGING = 'SMART_CONTRACTS_START_DEBUGGING',
  SMART_CONTRACTS_STOP_DEBUGGING = 'SMART_CONTRACTS_STOP_DEBUGGING',
  SMART_CONTRACTS_DEBUG_STEP = 'SMART_CONTRACTS_DEBUG_STEP',
  SMART_CONTRACTS_TRACE_DIFFS_LOAD_SUCCESS = 'SMART_CONTRACTS_TRACE_DIFFS_LOAD_SUCCESS',
  SMART_CONTRACTS_STOP = 'SMART_CONTRACTS_STOP',
}

export const SMART_CONTRACTS_LOAD = SmartContractsActionTypes.SMART_CONTRACTS_LOAD;
export const SMART_CONTRACTS_LOAD_SUCCESS = SmartContractsActionTypes.SMART_CONTRACTS_LOAD_SUCCESS;
export const SMART_CONTRACTS_RESET_BLOCKS = SmartContractsActionTypes.SMART_CONTRACTS_RESET_BLOCKS;
export const SMART_CONTRACTS_SET_ACTIVE_CONTRACT = SmartContractsActionTypes.SMART_CONTRACTS_SET_ACTIVE_CONTRACT;
export const SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS = SmartContractsActionTypes.SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS;
export const SMART_CONTRACTS_EXECUTE_CONTRACT = SmartContractsActionTypes.SMART_CONTRACTS_EXECUTE_CONTRACT;
export const SMART_CONTRACTS_EXECUTE_CONTRACT_SUCCESS = SmartContractsActionTypes.SMART_CONTRACTS_EXECUTE_CONTRACT_SUCCESS;
export const SMART_CONTRACTS_START_DEBUGGING = SmartContractsActionTypes.SMART_CONTRACTS_START_DEBUGGING;
export const SMART_CONTRACTS_STOP_DEBUGGING = SmartContractsActionTypes.SMART_CONTRACTS_STOP_DEBUGGING;
export const SMART_CONTRACTS_DEBUG_STEP = SmartContractsActionTypes.SMART_CONTRACTS_DEBUG_STEP;
export const SMART_CONTRACTS_TRACE_DIFFS_LOAD_SUCCESS = SmartContractsActionTypes.SMART_CONTRACTS_TRACE_DIFFS_LOAD_SUCCESS;
export const SMART_CONTRACTS_STOP = SmartContractsActionTypes.SMART_CONTRACTS_STOP;

interface SmartContractsAction extends FeatureAction<SmartContractsActionTypes> {
  readonly type: SmartContractsActionTypes;
}

export class SmartContractsLoadAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_LOAD;

  constructor(public payload: { blockHash: string }) { }
}

export class SmartContractsLoadSuccessAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_LOAD_SUCCESS;

  constructor(public payload: { contracts: SmartContract[], previousBlockHash: string }) { }
}

export class SmartContractsResetBlocksAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_RESET_BLOCKS;

  constructor(public payload: { blocks: string[], activeIndex: number }) { }
}

export class SmartContractsSetActiveContractAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_SET_ACTIVE_CONTRACT;

  constructor(public payload: SmartContract) { }
}

export class SmartContractsSetActiveContractSuccessAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS;

  constructor(public payload: { contract: SmartContract, execution: { trace: SmartContractTrace[], gasTrace: number[], result: SmartContractResult } }) { }
}

export class SmartContractsExecuteContractAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_EXECUTE_CONTRACT;

  constructor(public payload: SmartContract) { }
}

export class SmartContractsExecuteContractSuccessAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_EXECUTE_CONTRACT_SUCCESS;

  constructor(public payload: { trace: SmartContractTrace[], gasTrace: number[], result: SmartContractResult }) { }
}

export class SmartContractsStartDebuggingAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_START_DEBUGGING;
}

export class SmartContractsStopDebuggingAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_STOP_DEBUGGING;
}

export class SmartContractsDebugStepAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_DEBUG_STEP;

  constructor(public payload: SmartContractTrace) { }
}

export class SmartContractsStopAction implements SmartContractsAction {
  readonly type = SMART_CONTRACTS_STOP;
}

export type SmartContractActions = SmartContractsLoadAction
  | SmartContractsLoadSuccessAction
  | SmartContractsSetActiveContractAction
  | SmartContractsSetActiveContractSuccessAction
  | SmartContractsExecuteContractAction
  | SmartContractsExecuteContractSuccessAction
  | SmartContractsStartDebuggingAction
  | SmartContractsStopDebuggingAction
  | SmartContractsDebugStepAction
  | SmartContractsStopAction
  | any
  ;
