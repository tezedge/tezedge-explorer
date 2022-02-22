export interface MempoolBakingRight {
  address: string;
  blockHash: string;
  nodeId: string;
  receivedTime: number;
  sentTime: number;
  getOperationsRecvStartTime: number;
  getOperationsRecvEndTime: number;
  getOperationsRecvNum: number;
  operationsSendStartTime: number;
  operationsSendEndTime: number;
  operationsSendNum: number;
  responseRate: string;
}
