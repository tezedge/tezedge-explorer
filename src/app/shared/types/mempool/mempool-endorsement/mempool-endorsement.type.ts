export interface MempoolEndorsement {
  slots?: number[];
  slotsLength?: number;
  status?: MempoolEndorsementStatusTypes;
  bakerName?: string;
  logo?: string;
  receiveHashTime?: number;
  receiveContentsTime?: number;
  decodeTime?: number;
  precheckTime?: number;
  applyTime?: number;
  broadcastTime?: number;
  delta?: number;
  receiveContentsTimeDelta?: number;
  decodeTimeDelta?: number;
  precheckTimeDelta?: number;
  applyTimeDelta?: number;
  broadcastTimeDelta?: number;
}

export enum MempoolEndorsementStatusTypes {
  BROADCAST = 'broadcast',
  APPLIED = 'applied',
  PRECHECKED = 'prechecked',
  DECODED = 'decoded',
  RECEIVED = 'received',
  MISSING = 'missing'
}