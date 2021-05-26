import { ResourcesActions, ResourcesActionTypes } from './resources.actions';
import { Resource } from '../../shared/types/resources/resource.type';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { StorageResourcesActions, StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActions, MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';

export interface ResourcesState {
  resources: Resource[];
  storageResources: StorageResourcesStats;
  memoryResources: MemoryResource;
  reversedMemoryResources: boolean;
}

const initialState: ResourcesState = {
  resources: [],
  storageResources: null,
  memoryResources: null,
  reversedMemoryResources: false
};

export function reducer(state: ResourcesState = initialState, action: ResourcesActions | StorageResourcesActions | MemoryResourcesActions): ResourcesState {
  switch (action.type) {
    case ResourcesActionTypes.ResourcesLoadSuccess: {
      return {
        ...state,
        resources: [...action.payload]
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

