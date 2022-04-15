import { StorageResourcesActions, StorageResourcesActionTypes } from '@resources/storage-resource/storage-resources/storage-resources.actions';
import { State } from '@app/app.index';
import { StorageResourcesState } from '@shared/types/resources/storage/storage-resources-state.type';

const initialState: StorageResourcesState = {
  storageResources: null,
  availableContexts: []
};

export function reducer(state: StorageResourcesState = initialState, action: StorageResourcesActions): StorageResourcesState {
  switch (action.type) {

    case StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        storageResources: { ...action.payload }
      };
    }

    case StorageResourcesActionTypes.STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS: {
      return {
        ...state,
        availableContexts: action.payload
      };
    }

    case StorageResourcesActionTypes.STORAGE_RESOURCES_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}

export const storageResources = (state: State) => state.resources.storageResourcesState;
