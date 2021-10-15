import { StateMachineActionTypeStatistics } from '@shared/types/state-machine/state-machine-action-type-statistics.type';

export interface StateMachineActionStatistics {
  totalDuration: number;
  totalCalls: number;
  statistics: StateMachineActionTypeStatistics[];
}
