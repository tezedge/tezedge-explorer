export interface MempoolStatisticsOperationNode {
  id: string;
  received: MempoolStatisticsOperationNodeStep[];
  sent: MempoolStatisticsOperationNodeStep[];
  content_requested: MempoolStatisticsOperationNodeStep[];
  content_received: number[];
  content_requested_remote: MempoolStatisticsOperationNodeStep[];
  content_sent: MempoolStatisticsOperationNodeStep[];
}

export interface MempoolStatisticsOperationNodeStep {
  latency: number;
  block_level: number;
  block_timestamp: number;
}
