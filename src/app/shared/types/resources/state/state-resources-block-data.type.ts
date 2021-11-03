import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';

export interface StateResourcesBlockData {
  time: number;
  blockLevel: number;
  blockHash: string;
  blockFitness: string[];
  blockRound: number;
  cpuIdle: number;
  cpuBusy: number;
  groups: StateResourcesActionGroup[];
}
