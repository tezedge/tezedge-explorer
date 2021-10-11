import { Action } from '@ngrx/store';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionsFilter } from '@shared/types/state-machine/state-machine-actions-filter.type';
import { StateMachineActionTableAutoscrollType } from '@shared/types/state-machine/state-machine-action-table.type';
import { StateMachineActionStatistics } from '@shared/types/state-machine/state-machine-action-statistics.type';

export enum StateMachineActionTypes {
  STATE_MACHINE_DIAGRAM_LOAD = 'STATE_MACHINE_DIAGRAM_LOAD',
  STATE_MACHINE_DIAGRAM_LOAD_SUCCESS = 'STATE_MACHINE_DIAGRAM_LOAD_SUCCESS',
  STATE_MACHINE_ACTIONS_LOAD = 'STATE_MACHINE_ACTIONS_LOAD',
  STATE_MACHINE_ACTIONS_LOAD_SUCCESS = 'STATE_MACHINE_ACTIONS_LOAD_SUCCESS',
  STATE_MACHINE_ACTION_STATISTICS_LOAD = 'STATE_MACHINE_ACTION_STATISTICS_LOAD',
  STATE_MACHINE_ACTION_STATISTICS_LOAD_SUCCESS = 'STATE_MACHINE_ACTION_STATISTICS_LOAD_SUCCESS',
  STATE_MACHINE_SET_ACTIVE_ACTION = 'STATE_MACHINE_SET_ACTIVE_ACTION',
  STATE_MACHINE_PAUSE_PLAYING = 'STATE_MACHINE_PAUSE_PLAYING',
  STATE_MACHINE_START_PLAYING = 'STATE_MACHINE_START_PLAYING',
  STATE_MACHINE_CLOSE = 'STATE_MACHINE_CLOSE',
  STATE_MACHINE_ACTIONS_STOP_STEAM = 'STATE_MACHINE_ACTIONS_STOP_STEAM',
  STATE_MACHINE_ACTIONS_FILTER_LOAD = 'STATE_MACHINE_ACTIONS_FILTER_LOAD',
  STATE_MACHINE_COLLAPSE_DIAGRAM = 'STATE_MACHINE_COLLAPSE_DIAGRAM',
  STATE_MACHINE_RESIZE_DIAGRAM = 'STATE_MACHINE_RESIZE_DIAGRAM',
}

export class StateMachineDiagramLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD;
}

export class StateMachineDiagramLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS;

  constructor(public payload: StateMachineDiagramBlock[]) { }
}

export class StateMachineActionsLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD;
}

export class StateMachineActionsLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD_SUCCESS;

  constructor(public payload: StateMachineAction[]) { }
}

export class StateMachineActionStatisticsLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD;
}

export class StateMachineActionStatisticsLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD_SUCCESS;

  constructor(public payload: StateMachineActionStatistics) { }
}

export class StateMachineFilterActions implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD;

  constructor(public payload: StateMachineActionsFilter) { }
}

export class StateMachineSetActiveAction implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION;

  constructor(public payload: { action: StateMachineAction, autoScroll?: StateMachineActionTableAutoscrollType }) { }
}

export class StateMachineStopPlaying implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING;
}

export class StateMachineStartPlaying implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_START_PLAYING;
}

export class StateMachineActionsStopStream implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_ACTIONS_STOP_STEAM;
}

export class StateMachineCollapseDiagram implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_COLLAPSE_DIAGRAM;
}

export class StateMachineResizeDiagram implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_RESIZE_DIAGRAM;

  constructor(public payload: number) { }
}

export class StateMachineClose implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_CLOSE;
}

export type StateMachineActions = StateMachineDiagramLoad
  | StateMachineDiagramLoadSuccess
  | StateMachineActionsLoad
  | StateMachineActionsLoadSuccess
  | StateMachineActionStatisticsLoad
  | StateMachineActionStatisticsLoadSuccess
  | StateMachineFilterActions
  | StateMachineSetActiveAction
  | StateMachineStopPlaying
  | StateMachineStartPlaying
  | StateMachineActionsStopStream
  | StateMachineCollapseDiagram
  | StateMachineResizeDiagram
  | StateMachineClose
  ;
