export interface MempoolBakingRight {
  address: string;
  baker: string;
  blockHash: string;
  bakerPriority: number;
  receivedTime: number;
  precheckedTime: number;
  sentTime: number;
  delta: number;
  nodeId: string | null;
}
