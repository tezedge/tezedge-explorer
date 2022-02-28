export interface SmartContractResult {
  executionInfo: any[] | any;
  consumedGas?: number;
  status?: string;
  message?: string;
}
