import { StateMachineDiagramBlock } from './state-machine-diagram-block.type';
import { StateMachineAction } from './state-machine-action.type';
import { StateMachineActionTable } from '@shared/types/state-machine/state-machine-action-table.type';
import { StateMachineActionTypeStatistics } from '@shared/types/state-machine/state-machine-action-type-statistics.type';
import { StateMachineActionStatistics } from '@shared/types/state-machine/state-machine-action-statistics.type';

export interface StateMachine {
  diagramBlocks: StateMachineDiagramBlock[];
  actionStatistics: StateMachineActionStatistics;
  actionTable: StateMachineActionTable;
  activeAction: StateMachineAction;
  isPlaying: boolean;
  collapsedDiagram: boolean;
  diagramHeight: number;
}
