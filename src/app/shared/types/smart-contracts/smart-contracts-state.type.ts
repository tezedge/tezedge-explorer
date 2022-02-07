import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';

export class SmartContractsState {
  contracts: SmartContract[];
  activeContract: SmartContract;
  trace: any;
  debug: boolean;
  result: SmartContractResult;
}
