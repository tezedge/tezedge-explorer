import { MempoolStatisticsOperationNode } from '@shared/types/mempool/statistics/mempool-statistics-operation-node.type';

export interface MempoolStatisticsOperation {
  hash: string;
  dateTime: string;
  kind: string | null;
  nodes: MempoolStatisticsOperationNode[];
  nodesLength: number;
  validationsLength: number;

  firstReceived: number | undefined;
  contentReceived: number | undefined;
  validationStarted: number | undefined;
  preApplyStarted: number | undefined;
  preApplyEnded: number | undefined;
  validationResult: number | undefined;
  firstSent: number | undefined;

  delta: number | undefined;
  contentReceivedDelta: number | undefined;
  validationStartedDelta: number | undefined;
  preApplyStartedDelta: number | undefined;
  preApplyEndedDelta: number | undefined;
  validationResultDelta: number | undefined;
  firstSentDelta: number | undefined;
}
