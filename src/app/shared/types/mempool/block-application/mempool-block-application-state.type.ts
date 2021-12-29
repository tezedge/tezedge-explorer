import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';

export interface MempoolBlockApplicationState {
  chartLines: MempoolBlockApplicationChartLine[];
  xTicksValues: string[];
  xTicksValuesLength: number;
}
