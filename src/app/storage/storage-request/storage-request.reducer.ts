import { State } from '@app/app.reducers';
import { StorageRequestState } from '@storage/storage-request/storage-request.index';
import {
  STORAGE_REQUESTS_LOAD_SUCCESS,
  STORAGE_REQUESTS_STOP,
  STORAGE_REQUESTS_STREAM_CHANGE,
  StorageRequestAction
} from '@storage/storage-request/storage-request.actions';

const initialState: StorageRequestState = {
  requests: [],
  errors: 0,
  success: 0,
  pending: 0,
  stream: true,
};

export function reducer(state: StorageRequestState = initialState, action: StorageRequestAction): StorageRequestState {
  switch (action.type) {

    case STORAGE_REQUESTS_LOAD_SUCCESS: {
      return {
        ...state,
        requests: action.payload,
        errors: action.payload.filter(r => r.status === 'Error').length,
        success: action.payload.filter(r => r.status === 'Success').length,
        pending: action.payload.filter(r => !r.status).length,
      };
    }

    case STORAGE_REQUESTS_STREAM_CHANGE: {
      return {
        ...state,
        stream: action.payload.stream
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

export const selectStorageRequestState = (state: State): StorageRequestState => state.storage.requestState;
