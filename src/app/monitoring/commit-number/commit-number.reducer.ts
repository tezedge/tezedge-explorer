import { environment } from '../../../environments/environment';
import { CommitNumber } from '../../shared/types/commit-number/commit-number.type';

const initialState: CommitNumber = {
  explorerCommit: environment.commit,
  nodeCommit: '',
  debuggerCommit: '',
  nodeTag: ''
};

export function reducer(state: CommitNumber = initialState, action): CommitNumber {
  switch (action.type) {

    // initialize or reset state
    case 'VERSION_INIT': {
      return initialState;
    }

    case 'VERSION_NODE_LOAD_SUCCESS': {
      return {
        ...state,
        nodeCommit: action.payload
      };
    }

    case 'VERSION_DEBUGGER_LOAD_SUCCESS': {
      return {
        ...state,
        debuggerCommit: action.payload
      };
    }

    case 'VERSION_NODE_TAG_LOAD_SUCCESS': {
      return {
        ...state,
        nodeTag: action.payload
      };
    }

    default:
      return state;
  }
}
