import { SystemResourcesActions, SystemResourcesActionTypes } from '../system-resources/system-resources.actions';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { StorageResourcesActions, StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActions, MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';
import { StorageResourcesState } from '../../shared/types/resources/storage/storage-resources-state.type';

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
    case SystemResourcesActionTypes.ResourcesLoadSuccess: {
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
    case MemoryResourcesActionTypes.ResourcesLoadSuccess: {
      return {
        ...state,
        memoryResources: action.payload
      };
    }
    case StorageResourcesActionTypes.MAP_AVAILABLE_CONTEXTS: {
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
