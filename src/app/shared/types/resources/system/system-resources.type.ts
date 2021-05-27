import { SystemResourcesSeries } from './system-resources-series.type';
import { SystemResourcesSummary } from './system-resources-summary.type';

export class SystemResources {
  cpu: SystemResourcesSeries[];
  memory: SystemResourcesSeries[];
  disk: SystemResourcesSeries[];
  xTicksValues: string[];
  resourcesSummary: SystemResourcesSummary;
  colorScheme: { domain: string[] };
}
