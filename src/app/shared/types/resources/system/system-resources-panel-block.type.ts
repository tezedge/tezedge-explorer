import { SystemResourcesFormattingType } from './system-resource-category.type';

export interface SystemResourcesPanelBlock {
  name: string;
  value: number;
  formattingType: SystemResourcesFormattingType;
}
