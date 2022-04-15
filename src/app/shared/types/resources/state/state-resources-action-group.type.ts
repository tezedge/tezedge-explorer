import { StateResourcesAction } from '@shared/types/resources/state/state-resources-action.type';

export interface StateResourcesActionGroup {
  groupName: string;
  count: number;
  totalTime: number;
  meanTime: number;
  actions: StateResourcesAction[];
}
