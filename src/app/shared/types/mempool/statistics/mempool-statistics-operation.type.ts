import { MempoolStatisticsOperationNode } from '@shared/types/mempool/statistics/mempool-statistics-operation-node.type';

export interface MempoolStatisticsOperation {
  hash: string;
  dateTime: string;
  // validationResultLatency: number;
  // validationResultType: string;
  nodes: MempoolStatisticsOperationNode[];
  nodesLength: number;
  maxReceived: number;
  maxSent: number;
}
