import { SystemResourcesPanelBlock } from './system-resources-panel-block.type';
import { SystemResourcesSubcategoryRunnerGroup } from './system-resources-subcategory-runner-group.type';

export interface SystemResourcesPanel {
  blocks: SystemResourcesPanelBlock[];
  runnerGroups: SystemResourcesSubcategoryRunnerGroup[];
  timestamp: string;
  type: 'recently' | 'runnerGroups';
  resourceType: ResourceType;
}

export type ResourceType = 'cpu' | 'memory' | 'storage' | 'network' | 'io';
