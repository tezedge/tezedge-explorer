import { SystemResourcesSubcategoryRunner } from './system-resources-subcategory-runner.type';

export interface SystemResourcesSubcategoryRunnerGroup {
  property: string;
  label: string;
  total: number;
  values: SystemResourcesSubcategoryRunner[];
}
