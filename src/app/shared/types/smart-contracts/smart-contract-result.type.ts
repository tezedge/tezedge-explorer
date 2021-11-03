export interface SmartContractResult {
  executionInfo: any[] | any;
  consumedGas?: number;
  kind?: string;
  paidStorageSizeDiff?: string;
  status?: string;
  storageSize?: string;
  message?: string;
}
