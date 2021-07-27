import { Action } from '@ngrx/store';
import { StateMachineDiagramBlock } from '../../shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineProposal } from '../../shared/types/state-machine/state-machine-proposal.type';

export enum StateMachineActionTypes {
  STATE_MACHINE_DIAGRAM_LOAD = 'STATE_MACHINE_DIAGRAM_LOAD',
  STATE_MACHINE_DIAGRAM_LOAD_SUCCESS = 'STATE_MACHINE_DIAGRAM_LOAD_SUCCESS',
  STATE_MACHINE_PROPOSALS_LOAD = 'STATE_MACHINE_PROPOSALS_LOAD',
  STATE_MACHINE_PROPOSALS_LOAD_SUCCESS = 'STATE_MACHINE_PROPOSALS_LOAD_SUCCESS',
  STATE_MACHINE_SET_ACTIVE_PROPOSAL = 'STATE_MACHINE_SET_ACTIVE_PROPOSAL',
  STATE_MACHINE_STOP_PLAYING = 'STATE_MACHINE_STOP_PLAYING',
  STATE_MACHINE_START_PLAYING = 'STATE_MACHINE_START_PLAYING',
  STATE_MACHINE_CLOSE = 'STATE_MACHINE_CLOSE',
}

export class StateMachineDiagramLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD;

  constructor(public payload: any) { }
}

export class StateMachineDiagramLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS;

  constructor(public payload: StateMachineDiagramBlock[]) { }
}

export class StateMachineProposalsLoad implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD;

  constructor(public payload: any) { }
}

export class StateMachineProposalsLoadSuccess implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD_SUCCESS;

  constructor(public payload: StateMachineProposal[]) { }
}

export class StateMachineSetActiveProposal implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_PROPOSAL;

  constructor(public payload: StateMachineProposal) { }
}

export class StateMachineStopPlaying implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_STOP_PLAYING;
}

export class StateMachineStartPlaying implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_START_PLAYING;
}

export class StateMachineClose implements Action {
  readonly type = StateMachineActionTypes.STATE_MACHINE_CLOSE;
}

export type StateMachineActions = StateMachineDiagramLoad
  | StateMachineDiagramLoadSuccess
  | StateMachineProposalsLoad
  | StateMachineProposalsLoadSuccess
  | StateMachineSetActiveProposal
  | StateMachineStopPlaying
  | StateMachineStartPlaying
  | StateMachineClose
  ;