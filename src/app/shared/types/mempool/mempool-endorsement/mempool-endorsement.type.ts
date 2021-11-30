export interface MempoolEndorsement {
  slot: number;
  status?: string;
  baker?: string;
  logo?: string;
  receiveTime?: number;
  applyTime?: number;
  precheckTime?: number;
  decodeTime?: number;
  broadcastTime?: number;
  totalTime?: number;
}
