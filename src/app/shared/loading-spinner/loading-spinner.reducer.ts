import { SystemResourcesActionTypes } from '@resources/system-resources/system-resources.actions';
import { LoadingSpinner } from '@shared/types/shared/loading-spinner/loading-spinner.type';
import { State } from '@app/app.reducers';
import { StateMachineActionTypes } from '@state-machine/state-machine/state-machine.actions';
import { StorageResourcesActionTypes } from '@resources/storage-resources/storage-resources.actions';
import { MemoryResourcesActionTypes } from '@resources/memory-resources/memory-resources.actions';
import { ADD_ERROR } from '@shared/error-popup/error-popup.actions';
import { MEMPOOL_ENDORSEMENT_LOAD, MEMPOOL_ENDORSEMENT_LOAD_SUCCESS } from '@mempool/mempool.action';

export interface LoadingSpinnerState {
  pendingValues: LoadingSpinner[];
}

const initialState: LoadingSpinnerState = {
  pendingValues: []
};

export function reducer(state: LoadingSpinnerState = initialState, action: any): LoadingSpinnerState {
  switch (action.type) {
    case ADD_ERROR: {
      if (action.payload.initiator) {
        return {
          pendingValues: state.pendingValues.filter(v => v.type !== action.payload.initiator)
        };
      }
      return { ...state };
    }
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD: {
      return {
        pendingValues: [systemResourcesLoad, ...state.pendingValues]
      };
    }
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_CLOSE:
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS: {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD)
      };
    }
    case StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD: {
      return {
        pendingValues: [storageResourcesLoad, ...state.pendingValues]
      };
    }
    case StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS:
    case StorageResourcesActionTypes.STORAGE_RESOURCES_CLOSE: {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD)
      };
    }
    case MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD: {
      return {
        pendingValues: [memoryResourcesLoad, ...state.pendingValues]
      };
    }
    case MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS:
    case MemoryResourcesActionTypes.MEMORY_RESOURCES_CLOSE: {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD)
      };
    }
    case 'STORAGE_BLOCK_ACTION_LOAD': {
      return {
        pendingValues: [storageBlockActionLoad, ...state.pendingValues]
      };
    }
    case 'STORAGE_BLOCK_ACTION_RESET':
    case 'STORAGE_BLOCK_ACTION_LOAD_SUCCESS': {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== 'STORAGE_BLOCK_ACTION_LOAD')
      };
    }
    case 'STORAGE_BLOCK_START': {
      return {
        pendingValues: [storageBlocksLoad, ...state.pendingValues]
      };
    }
    case 'STORAGE_BLOCK_START_SUCCESS': {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== 'STORAGE_BLOCK_START')
      };
    }
    case 'NETWORK_ACTION_START':
    case 'NETWORK_ACTION_LOAD':
    case 'NETWORK_ACTION_TIME_LOAD': {
      return {
        pendingValues: [networkActionLoad, ...state.pendingValues]
      };
    }
    case 'NETWORK_ACTION_START_SUCCESS':
    case 'NETWORK_ACTION_LOAD_SUCCESS': {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== 'NETWORK_ACTION_LOAD')
      };
    }
    case 'LOGS_ACTION_START':
    case 'LOGS_ACTION_LOAD':
    case 'LOGS_ACTION_TIME_LOAD': {
      return {
        pendingValues: [logsActionLoad, ...state.pendingValues]
      };
    }
    case 'LOGS_ACTION_LOAD_SUCCESS':
    case 'LOGS_ACTION_START_SUCCESS': {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== 'LOGS_ACTION_LOAD')
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD: {
      return {
        pendingValues: [stateMachineStatisticsLoad, ...state.pendingValues]
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD_SUCCESS: {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD)
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD: {
      return {
        pendingValues: [stateMachineDiagramLoad, ...state.pendingValues]
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS: {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD)
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD: {
      return {
        pendingValues: [stateMachineActionsLoad, ...state.pendingValues]
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD_SUCCESS: {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD)
      };
    }
    case StateMachineActionTypes.STATE_MACHINE_CLOSE: {
      return {
        pendingValues: state.pendingValues
          .filter(v => v.type !== StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD)
          .filter(v => v.type !== StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD)
          .filter(v => v.type !== StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD)
      };
    }
    case MEMPOOL_ENDORSEMENT_LOAD: {
      return {
        pendingValues: [mempoolEndorsementLoad, ...state.pendingValues]
      };
    }
    case MEMPOOL_ENDORSEMENT_LOAD_SUCCESS: {
      return {
        pendingValues: state.pendingValues.filter(v => v.type !== MEMPOOL_ENDORSEMENT_LOAD)
      };
    }
    default:
      return state;
  }
}

export const spinnerActiveMessage = (state: State) => state.spinner?.pendingValues.length > 1
  ? [...state.spinner.pendingValues].sort((v1, v2) => v1.zIndex - v2.zIndex)[state.spinner.pendingValues.length - 1]
  : state.spinner?.pendingValues[0];

const systemResourcesLoad: LoadingSpinner = {
  type: SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD,
  message: 'Loading system resources...'
};

const storageResourcesLoad: LoadingSpinner = {
  type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD,
  message: 'Loading storage resources...'
};

const memoryResourcesLoad: LoadingSpinner = {
  type: MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD,
  message: 'Loading memory resources...'
};

const storageBlockActionLoad: LoadingSpinner = {
  type: 'STORAGE_BLOCK_ACTION_LOAD',
  message: 'Loading storage action...'
};

const storageBlocksLoad: LoadingSpinner = {
  type: 'STORAGE_BLOCK_START',
  message: 'Loading storage blocks...'
};

const networkActionLoad: LoadingSpinner = {
  type: 'NETWORK_ACTION_LOAD',
  message: 'Loading network...'
};

const logsActionLoad: LoadingSpinner = {
  type: 'LOGS_ACTION_LOAD',
  message: 'Loading logs...'
};

const stateMachineStatisticsLoad: LoadingSpinner = {
  type: StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD,
  message: 'Loading state machine action statistics...',
  zIndex: 3
};

const stateMachineActionsLoad: LoadingSpinner = {
  type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD,
  message: 'Loading state machine actions...',
  zIndex: 2
};

const stateMachineDiagramLoad: LoadingSpinner = {
  type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD,
  message: 'Loading state machine diagram...',
  zIndex: 1
};

const mempoolEndorsementLoad: LoadingSpinner = {
  type: MEMPOOL_ENDORSEMENT_LOAD,
  message: 'Loading mempool endorsements...'
};
