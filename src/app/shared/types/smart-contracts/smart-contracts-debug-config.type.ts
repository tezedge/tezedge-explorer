import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';

export interface SmartContractsDebugConfig {
  previousStep: SmartContractTrace;
  currentStep: SmartContractTrace;
  nextStep: SmartContractTrace;
  stepIn: SmartContractTrace;
  stepOut: SmartContractTrace;
}
