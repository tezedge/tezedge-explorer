import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';
import { MempoolBlockApplicationAverage } from '@shared/types/mempool/block-application/mempool-block-application-average.type';

export interface MempoolBlockApplicationState {
  chartLines: MempoolBlockApplicationChartLine[];
  xTicksValues: string[];
  xTicksValuesLength: number;
  averageValues: MempoolBlockApplicationAverage[];
  noOfBlocks: number;
}
