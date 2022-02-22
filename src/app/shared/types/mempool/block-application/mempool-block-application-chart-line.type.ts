import { MempoolBlockApplicationChartPoint } from '@shared/types/mempool/block-application/mempool-block-application-chart-point.type';

export interface MempoolBlockApplicationChartLine {
  name: string;
  series: MempoolBlockApplicationChartPoint[];
}
