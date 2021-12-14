export interface MempoolEndorsement {
  slots?: number[];
  slotsLength?: number;
  status?: string;
  bakerName?: string;
  logo?: string;
  receiveTime?: number;
  applyTime?: number;
  precheckTime?: number;
  decodeTime?: number;
  broadcastTime?: number;
  delta?: number;
}
