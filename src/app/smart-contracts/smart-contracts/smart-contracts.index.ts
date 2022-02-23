import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { SmartContractsDebugConfig } from '@shared/types/smart-contracts/smart-contracts-debug-config.type';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { State } from '@app/app.reducers';

export class SmartContractsState {
  contracts: SmartContract[];
  activeContract: SmartContract;
  trace: SmartContractTrace[];
  gasTrace: number[];
  isDebugging: boolean;
  debugConfig: SmartContractsDebugConfig;
  result: SmartContractResult;
  blockLevel: number;
  blockHashContext: {
    hashes: string[];
    activeIndex: number;
  };
}

export const selectSmartContracts = (state: State): SmartContract[] => state.smartContracts.contracts;
export const selectSmartContractsActiveContract = (state: State): SmartContract => state.smartContracts.activeContract;
export const selectSmartContractsTrace = (state: State): SmartContractTrace[] => state.smartContracts.trace;
export const selectSmartContractsGasTrace = (state: State): number[] => state.smartContracts.gasTrace;
export const selectSmartContractsResult = (state: State): SmartContractResult => state.smartContracts.result;
export const selectSmartContractsDebugConfig = (state: State): SmartContractsDebugConfig => state.smartContracts.debugConfig;
export const selectSmartContractsIsDebugging = (state: State): boolean => state.smartContracts.isDebugging;
export const selectSmartContractsBlockHashContext = (state: State): { hashes: string[]; activeIndex: number; } => state.smartContracts.blockHashContext;
