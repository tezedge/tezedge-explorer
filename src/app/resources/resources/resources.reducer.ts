import { SystemResourcesActions, SystemResourcesActionTypes } from '../system-resources/system-resources.actions';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { StorageResourcesActions, StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActions, MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';
import { StorageResourcesState } from '../../shared/types/resources/storage/storage-resources-state.type';
import { State } from '../../app.reducers';

export interface ResourcesState {
  systemResources: SystemResources;
  storageResourcesState: StorageResourcesState;
  memoryResources: MemoryResource;
}

const initialState: ResourcesState = {
  systemResources: null,
  storageResourcesState: { storageResources: null, availableContexts: [] },
  memoryResources: null,
};

export function reducer(state: ResourcesState = initialState, action: SystemResourcesActions | StorageResourcesActions | MemoryResourcesActions): ResourcesState {
  switch (action.type) {
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        systemResources: { ...action.payload }
      };
    }
    case StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        storageResourcesState: {
          availableContexts: state.storageResourcesState.availableContexts,
          storageResources: action.payload
        }
      };
    }
    case MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        memoryResources: action.payload
      };
    }
    case StorageResourcesActionTypes.STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS: {
      return {
        ...state,
        storageResourcesState: {
          ...state.storageResourcesState,
          availableContexts: action.payload,
        }
      };
    }
    default:
      return state;
  }
}

export const systemResources = (state: State) =>  state.resources.systemResources;
export const storageResources = (state: State) =>  state.resources.storageResourcesState;
export const memoryResources = (state: State) =>  state.resources.memoryResources;
