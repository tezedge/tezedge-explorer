import { State } from '@app/app.reducers';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { StateMachineActions, StateMachineActionTypes } from './state-machine.actions';
import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';

const initialState: StateMachine = {
  state: null,
  diagramBlocks: [],
  actionTable: {
    ids: [],
    entities: {},
    lastCursorId: 0,
    filter: {
      limit: 300,
      cursor: null
    },
    stream: false,
    activePage: {},
    pages: [],
    autoScroll: undefined
  },
  activeAction: null,
  isPlaying: false,
  collapsedDiagram: JSON.parse(localStorage.getItem('collapsedDiagram')),
};

export function reducer(state: StateMachine = initialState, action: StateMachineActions): StateMachine {
  switch (action.type) {

    case StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS: {
      return {
        ...state,
        diagramBlocks: [...action.payload]
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_STATE_LOAD_SUCCESS: {
      return {
        ...state,
        state: { ...action.payload }
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD: {
      return {
        ...state,
        actionTable: {
          ...state.actionTable,
          stream: true,
          filter: {
            ...state.actionTable.filter,
            cursor: null
          }
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
      // const activeBlock = state.diagramBlocks.find(b => b.status === 'active');
      // const activeProposalPosition = activeBlock ? action.payload.findIndex(p => p.stateId === activeBlock.id) : -1;
      const entities = setEntities(action, state);
      const activePage = setActivePage(entities, action);

      return {
        ...state,
        actionTable: {
          ...state.actionTable,
          ids: setIds(action),
          entities,
          activePage,
          lastCursorId: setLastCursorId(action),
          pages: setPages(activePage, state),
        }
        // activeProposal: activeProposalPosition === -1 ? null : action.payload[activeProposalPosition],
        // activeProposalPosition
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION: {
      // const diagramBlocks = state.diagramBlocks.map(block => ({ ...block }));
      // const nextActiveBlockId = diagramBlocks.findIndex(block => block.id === action.payload.stateId);

      // const previousBlockIds = state.proposals
      //   .slice(0, state.proposals.findIndex(p => p.stateId === action.payload.stateId))
      //   .map(p => p.stateId);
      // diagramBlocks
      //   .forEach(block => {
      //     block.status = previousBlockIds.includes(block.id) ? 'completed' : 'pending';
      //   });
      // diagramBlocks[nextActiveBlockId].status = 'active';

      return {
        ...state,
        activeAction: action.payload.action,
        actionTable: {
          ...state.actionTable,
          autoScroll: action.payload.autoScroll
        }
        // diagramBlocks
      };
    }

    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD: {
      return {
        ...state,
        actionTable: {
          ...state.actionTable,
          filter: {
            ...state.actionTable.filter,
            cursor: action.payload.cursor
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

function setActivePage(entities, action): VirtualScrollActivePage {
  if (!action.payload.length) {
    return null;
  }

  return {
    id: entities[action.payload.length - 1].originalId,
    start: entities[0],
    end: entities[action.payload.length - 1],
    numberOfRecords: action.payload.length
  };
}

function setPages(activePage, state): number[] {
  if (!activePage) {
    return [];
  }

  const pagesArray = [...state.actionTable.pages];

  if (pagesArray.indexOf(activePage.id) !== -1) {
    return [...state.actionTable.pages];
  }

  if (Number(pagesArray[pagesArray.length - 1]) < activePage.id) {
    return [activePage.id].sort((a, b) => a - b);
  } else {
    return [...state.actionTable.pages, activePage.id].sort((a, b) => a - b);
  }

}


export const selectStateMachine = (state: State) => state.stateMachine;
export const selectStateMachineState = (state: State) => state.stateMachine.state;
export const selectStateMachineDiagram = (state: State) => state.stateMachine.diagramBlocks;
