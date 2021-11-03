export interface MempoolEndorsement {
  slots?: number[];
  status?: string;
  baker?: string;
  bakerName?: string;
  logo?: string;
  receiveTime?: number;
  applyTime?: number;
  precheckTime?: number;
  decodeTime?: number;
  broadcastTime?: number;
  maxTime?: number;
}
