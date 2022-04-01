import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';
import { MempoolBlockApplicationAverage } from '@shared/types/mempool/block-application/mempool-block-application-average.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';

export interface MempoolBlockApplicationState {
  chartLines: MempoolBlockApplicationChartLine[];
  markIndexes: number[];
  xTicksValues: string[];
  xTicksValuesLength: number;
  averageValues: MempoolBlockApplicationAverage[];
  noOfBlocks: number;
  activeBlockLevel: number;
  bakingDetails: MempoolBlockRound[];
  delta: boolean;
  colorScheme: string[];
}
