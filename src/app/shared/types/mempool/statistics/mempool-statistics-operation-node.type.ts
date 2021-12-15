export interface MempoolStatisticsOperationNode {
  id: string;
  received: number[];
  sent: number[];
  maxReceived: number;
  maxSent: number;
}
