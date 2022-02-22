export interface SmartContract {
  id?: number;
  hash: string;
  source?: string;
  code?: string;
  parameter?: string;
  storage?: string;
  entrypoint?: string;
  chainId?: string;
  amount?: string;
  gasLimit?: string;
  balance?: string;

  codeObj?: object;
  parameterObj?: object;
  storageObj?: object;

  blockStorage?: object;
  traceStorage?: object;
  isSameStorage?: boolean;

  blockBigMaps?: object;
  traceBigMaps?: object;
  isSameBigMaps?: boolean;

  totalConsumedGas?: number;
  traceConsumedGas?: number;
  blockExecutionStatus?: string;
  traceExecutionStatus?: string;
}
