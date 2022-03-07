import { State } from '@app/app.reducers';
import { StorageRequestState } from '@storage/storage-request/storage-request.index';
import { STORAGE_REQUESTS_LOAD_SUCCESS, STORAGE_REQUESTS_STOP, StorageRequestAction } from '@storage/storage-request/storage-request.actions';
import { StorageRequest } from '@shared/types/storage/request/storage-request.type';

const initialState: StorageRequestState = {
  requests: [],
};

export function reducer(state: StorageRequestState = initialState, action: StorageRequestAction): StorageRequestState {

  switch (action.type) {
    case STORAGE_REQUESTS_LOAD_SUCCESS: {
      return {
        ...state,
        requests: action.payload ? [...state.requests, ...action.payload] : state.requests
      };
    }

    case STORAGE_REQUESTS_STOP: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export const selectStorageRequests = (state: State): StorageRequest[] => state.storage.requestState.requests;
