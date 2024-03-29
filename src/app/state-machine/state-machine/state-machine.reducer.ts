import { State } from '@app/app.index';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { StateMachineActions, StateMachineActionTypes } from './state-machine.actions';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionsFilter } from '@shared/types/state-machine/state-machine-actions-filter.type';

const NO_FILTERS: StateMachineActionsFilter = {
  limit: 20,
  cursor: null,
  queryFilters: [],
  rev: false
};

const initialState: StateMachine = {
  diagramBlocks: [],
  actionStatistics: {
    statistics: [],
    totalCalls: 0,
    totalDuration: 0
  },
  actionTable: {
    ids: [],
    entities: {},
    lastCursorId: 0,
    filter: NO_FILTERS,
    stream: false,
    autoScroll: undefined,
  },
  activeAction: null,
  isPlaying: false,
  collapsedDiagram: JSON.parse(localStorage.getItem('collapsedDiagram')) || false,
  diagramHeight: JSON.parse(localStorage.getItem('diagramHeight')),
};

export function reducer(state: StateMachine = initialState, action: StateMachineActions): StateMachine {
  switch (action.type) {

    case StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS: {
      return {
        ...state,
        diagramBlocks: [...action.payload]
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD_SUCCESS: {
      return {
        ...state,
        actionStatistics: { ...action.payload }
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD: {
      return {
        ...state,
        actionTable: {
          ...state.actionTable,
          stream: true,
          filter: NO_FILTERS
        }
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_STOP_STEAM: {
      return {
        ...state,
        actionTable: {
          ...state.actionTable,
          stream: false
        }
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD_SUCCESS: {
      const entities = setEntities(action, state);
      const ids = setIds(action);

      return {
        ...state,
        actionTable: {
          ...state.actionTable,
          ids,
          entities,
          lastCursorId: setLastCursorId(action)
        }
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION: {
      return {
        ...state,
        activeAction: action.payload.action,
        actionTable: {
          ...state.actionTable,
          autoScroll: action.payload.autoScroll
        },
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD: {
      return {
        ...state,
        actionTable: {
          ...state.actionTable,
          filter: {
            ...state.actionTable.filter,
            cursor: action.payload.cursor,
            rev: action.payload.rev,
            queryFilters: action.payload.queryFilters || []
          }
        }
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING: {
      return {
        ...state,
        isPlaying: false
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_START_PLAYING: {
      return {
        ...state,
        isPlaying: true
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_COLLAPSE_DIAGRAM: {
      localStorage.setItem('collapsedDiagram', JSON.stringify(!state.collapsedDiagram));
      return {
        ...state,
        collapsedDiagram: !state.collapsedDiagram
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_RESIZE_DIAGRAM: {
      localStorage.setItem('diagramHeight', JSON.stringify(action.payload));
      return {
        ...state,
        diagramHeight: action.payload
      };
    }


    case StateMachineActionTypes.STATE_MACHINE_CLOSE: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}


function setIds(action): number[] {
  if (!action.payload.length) {
    return [];
  }

  return action.payload
    .map((item, index) => index)
    .sort((a, b) => a - b);
}

function setEntities(action, state): { [id: string]: StateMachineAction } {
  return action.payload.length === 0
    ? {}
    : action.payload.reduce((accumulator, act) => {
      const virtualScrollId = setVirtualScrollId(action, state, accumulator);

      return {
        ...accumulator,
        [virtualScrollId]: {
          ...act,
          id: virtualScrollId,
          originalId: act.id,
        }
      };
    }, {});
}

function setLastCursorId(action): number {
  return action.payload.length - 1;
}

function setVirtualScrollId(action, state, accumulator): number {
  const alreadySetRecords = Object.keys(accumulator);
  return action.payload.length - (alreadySetRecords.length + 1);
}

export const selectStateMachine = (state: State) => state.stateMachine;
export const selectStateMachineDiagramBlocks = (state: State) => state.stateMachine.diagramBlocks;
export const selectStateMachineDiagramHeight = (state: State) => state.stateMachine.diagramHeight;
export const selectStateMachineCollapsedDiagram = (state: State) => state.stateMachine.collapsedDiagram;
export const selectStateMachineActiveAction = (state: State) => state.stateMachine.activeAction;
export const selectStateMachineStatistics = (state: State) => state.stateMachine.actionStatistics;
