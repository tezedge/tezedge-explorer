import { SystemResourcesPanelBlock } from './system-resources-panel-block.type';
import { SystemResourcesSubcategoryRunnerGroup } from './system-resources-subcategory-runner-group.type';

export interface SystemResourcesPanel {
  blocks: SystemResourcesPanelBlock[];
  runnerGroups: SystemResourcesSubcategoryRunnerGroup[];
  timestamp: string;
  resourceType: SystemResourcesResourceType;
  type: 'recently' | 'runnerGroups';
  sortBy: SystemResourcesSortBy;
}

export type SystemResourcesResourceType = 'cpu' | 'memory' | 'storage' | 'network' | 'io';
export type SystemResourcesSortBy =  'name' | 'size';
