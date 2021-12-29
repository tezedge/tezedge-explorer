export interface MempoolBlockApplication {
  blockLevel: number;
  totalTime?: number;
  blockFirstSeen?: string;
  dataReady?: number;
  loadData?: number;
  applyBlock?: number;
  storeResult?: number;
}
