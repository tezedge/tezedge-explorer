import { GithubVersion } from '@shared/types/github-version/github-version.type';

const initialState: GithubVersion = {
  explorerCommit: '',
  nodeCommit: '',
  debuggerCommit: '',
  nodeTag: ''
};

export function reducer(state: GithubVersion = initialState, action): GithubVersion {
  switch (action.type) {

    case 'VERSION_INIT': {
      return initialState;
    }

    case 'VERSION_EXPLORER_LOAD': {
      return {
        ...state,
        explorerCommit: action.payload
      };
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
