import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionsFilter } from '@shared/types/state-machine/state-machine-actions-filter.type';

export interface StateMachineActionTable {
  ids: number[];
  entities: { [id: string]: StateMachineAction };
  activePage: VirtualScrollActivePage;
  pages: number[];
  lastCursorId: number;
  stream: boolean;
  filter: StateMachineActionsFilter;
  autoScroll: StateMachineActionTableAutoscrollType;
}

export type StateMachineActionTableAutoscrollType =  'up' | 'down' | 'any' | undefined;
