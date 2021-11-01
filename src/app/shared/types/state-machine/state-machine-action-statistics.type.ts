import { StateMachineActionKindStatistics } from '@shared/types/state-machine/state-machine-action-kind-statistics.type';

export interface StateMachineActionStatistics {
  totalDuration: number;
  totalCalls: number;
  statistics: StateMachineActionKindStatistics[];
}
