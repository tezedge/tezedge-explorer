export interface MempoolEndorsement {
  slots?: number[];
  slotsLength?: number;
  operationHashes?: string[];
  status?: MempoolEndorsementStatusTypes;
  bakerName?: string;
  bakerHash?: string;
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
  BRANCH_DELAYED = 'branch_delayed',
  MISSING = 'missing'
}
