import { StateResourcesActionDetails } from '@shared/types/resources/state/state-resources-action-details.type';

export interface StateResourcesAction {
  actionName: string;
  totalTime: number;
  count: number;
  columns: StateResourcesActionDetails[];
}
