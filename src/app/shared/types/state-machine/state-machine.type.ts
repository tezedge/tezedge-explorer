import { StateMachineDiagramBlock } from './state-machine-diagram-block.type';
import { StateMachineAction } from './state-machine-action.type';
import { StateMachineActionTable } from '@shared/types/state-machine/state-machine-action-table.type';

export interface StateMachine {
  diagramBlocks: StateMachineDiagramBlock[];
  actionTable: StateMachineActionTable;
  activeAction: StateMachineAction;
  isPlaying: boolean;
  collapsedDiagram: boolean;
  diagramHeight: number;
}
