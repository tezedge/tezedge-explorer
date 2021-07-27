import { SystemResourcesSubcategory } from './system-resources-subcategory.type';

export interface SystemResourceCategory {
  series: SystemResourcesSubcategory[];
  formattingType: SystemResourcesFormattingType;
  labels?: string[];
}

export type SystemResourcesFormattingType = '%' | 'GB' | 'MB' | '';
