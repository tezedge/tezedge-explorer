export interface MempoolEndorsement {
  slots?: number[];
  slotsLength?: number;
  status?: MempoolEndorsementStatusTypes;
  bakerName?: string;
  logo?: string;
  receiveTime?: number;
  applyTime?: number;
  precheckTime?: number;
  decodeTime?: number;
  broadcastTime?: number;
  delta?: number;
}

export enum MempoolEndorsementStatusTypes {
  BROADCAST = 'broadcast',
  APPLIED = 'applied',
  PRECHECKED = 'prechecked',
  DECODED = 'decoded',
  RECEIVED = 'received',
  MISSING = 'missing'
}
