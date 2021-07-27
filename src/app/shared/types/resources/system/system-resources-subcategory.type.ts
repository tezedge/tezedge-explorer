import { SystemResourcesSubcategoryRunnerGroup } from './system-resources-subcategory-runner-group.type';

export interface SystemResourcesSubcategory {
  name: string;
  series: {
    name: string;
    value: number;
    runnerGroups?: SystemResourcesSubcategoryRunnerGroup[];
  }[];
}
