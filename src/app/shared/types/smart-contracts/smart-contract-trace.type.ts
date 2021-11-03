import { SmartContractDebugPoint } from '@shared/types/smart-contracts/smart-contract-debug-point.type';

export interface SmartContractTrace {
  gas: number;
  start: SmartContractDebugPoint;
  stop: SmartContractDebugPoint;
  stack: { item: string, annot?: string }[];
}
