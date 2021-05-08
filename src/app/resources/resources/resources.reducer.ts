import { ResourcesActions, ResourcesActionTypes } from './resources.actions';
import { Resource } from '../../shared/types/resources/resource.type';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { ResourcesStorageActions, StorageResourcesActionTypes } from '../resources-storage/resources-storage.actions';

export interface ResourcesState {
  resources: Resource[];
  storageResources: StorageResourcesStats;
}

const initialState: ResourcesState = {
  resources: [],
  storageResources: null
};

export function reducer(state: ResourcesState = initialState, action: ResourcesActions | ResourcesStorageActions): ResourcesState {
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
    default:
      return state;
  }
}

