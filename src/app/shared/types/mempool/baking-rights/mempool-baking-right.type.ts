export interface MempoolBakingRight {
  address: string;
  baker: string;
  blockHash: string;
  receivedTime: number;
  sentTime: number;
  delta: number;
  nodeId: string | null;
}
