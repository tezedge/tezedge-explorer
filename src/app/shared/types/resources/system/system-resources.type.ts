import { SystemResourcesPanel } from './system-resources-panel.type';
import { SystemResourceCategory } from './system-resource-category.type';

export class SystemResources {
  cpu: SystemResourceCategory;
  memory: SystemResourceCategory;
  storage: SystemResourceCategory;
  io: SystemResourceCategory;
  network: SystemResourceCategory;
  xTicksValues: string[];
  resourcesSummary: SystemResourcesPanel;
  colorScheme: { domain: string[] };
}
