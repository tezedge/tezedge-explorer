import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';
import { MempoolBlockApplicationAverage } from '@shared/types/mempool/block-application/mempool-block-application-average.type';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';

export interface MempoolBlockApplicationState {
  chartLines: MempoolBlockApplicationChartLine[];
  xTicksValues: string[];
  xTicksValuesLength: number;
  averageValues: MempoolBlockApplicationAverage[];
  noOfBlocks: number;
  activeBlockLevel: number;
  bakingDetails: MempoolBlockDetails[];
  delta: boolean;
  colorScheme: string[];
}
