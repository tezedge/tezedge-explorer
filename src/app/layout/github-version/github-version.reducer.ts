import { GithubVersion } from '@shared/types/github-version/github-version.type';
import {
  GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS,
  GITHUB_VERSION_EXPLORER_LOAD,
  GITHUB_VERSION_NODE_LOAD_SUCCESS,
  GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS,
  GithubVersionActions
} from '@app/layout/github-version/github-version.actions';

const initialState: GithubVersion = {
  explorerCommit: '',
  nodeCommit: '',
  debuggerCommit: '',
  nodeTag: ''
};

export function reducer(state: GithubVersion = initialState, action: GithubVersionActions): GithubVersion {
  switch (action.type) {

    case GITHUB_VERSION_EXPLORER_LOAD: {
      return {
        ...state,
        explorerCommit: action.payload
      };
    }

    case GITHUB_VERSION_NODE_LOAD_SUCCESS: {
      return {
        ...state,
        nodeCommit: action.payload
      };
    }

    case GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS: {
      return {
        ...state,
        nodeTag: action.payload
      };
    }

    case GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS: {
      return {
        ...state,
        debuggerCommit: action.payload
      };
    }

    default:
      return state;
  }
}
