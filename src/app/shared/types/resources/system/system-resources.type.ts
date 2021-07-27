import { SystemResourcesPanel } from './system-resources-panel.type';
import { SystemResourceCategory } from './system-resource-category.type';

export interface SystemResources {
  cpu: SystemResourceCategory;
  memory: SystemResourceCategory;
  storage: SystemResourceCategory;
  io: SystemResourceCategory;
  network: SystemResourceCategory;
  xTicksValues: string[];
  resourcesPanel: SystemResourcesPanel;
  colorScheme: { domain: string[] };
}
