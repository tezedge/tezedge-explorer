import { SystemResourcesActions, SystemResourcesActionTypes } from '../system-resources/system-resources.actions';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { StorageResourcesActions, StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActions, MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';

export interface ResourcesState {
  systemResources: SystemResources;
  storageResources: StorageResourcesStats;
  memoryResources: MemoryResource;
}

const initialState: ResourcesState = {
  systemResources: null,
  storageResources: null,
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
    case StorageResourcesActionTypes.ResourcesLoadSuccess: {
      return {
        ...state,
        storageResources: action.payload
      };
    }
    case MemoryResourcesActionTypes.ResourcesLoadSuccess: {
      return {
        ...state,
        memoryResources: action.payload
      };
    }
    default:
      return state;
  }
}

