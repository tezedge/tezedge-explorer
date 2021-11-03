import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';

export class SmartContractsState {
  contracts: SmartContract[];
  activeContract: SmartContract;
  trace: any;
  debug: boolean;
}
