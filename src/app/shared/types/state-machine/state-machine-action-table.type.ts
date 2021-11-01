import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionsFilter } from '@shared/types/state-machine/state-machine-actions-filter.type';

export interface StateMachineActionTable {
  ids: number[];
  entities: { [id: string]: StateMachineAction };
  lastCursorId: number;
  stream: boolean;
  filter: StateMachineActionsFilter;
  autoScroll: StateMachineActionTableAutoscrollType;
  mostRecentKnownActionId: string;
}

export type StateMachineActionTableAutoscrollType =  'up' | 'down' | 'any' | undefined;
