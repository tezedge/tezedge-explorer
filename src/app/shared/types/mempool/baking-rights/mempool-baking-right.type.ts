export interface MempoolBakingRight {
  address: string;
  baker: string;
  blockHash: string;
  bakerPriority: number;
  applyBlockStart: number;
  applyBlockEnd: number;
  downloadDataStart: number;
  downloadDataEnd: number;
  loadDataStart: number;
  loadDataEnd: number;
  storeResultStart: number;
  storeResultEnd: number;
  receivedTime: number;
  precheckedTime: number;
  sentTime: number;
  nodeId: string | null;
}
