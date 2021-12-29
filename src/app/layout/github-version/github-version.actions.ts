import { Action } from '@ngrx/store';

enum GithubVersionActionTypes {
  GITHUB_VERSION_EXPLORER_LOAD = 'GITHUB_VERSION_EXPLORER_LOAD',
  GITHUB_VERSION_EXPLORER_LOAD_SUCCESS = 'GITHUB_VERSION_EXPLORER_LOAD_SUCCESS',
  GITHUB_VERSION_NODE_LOAD = 'GITHUB_VERSION_NODE_LOAD',
  GITHUB_VERSION_NODE_LOAD_SUCCESS = 'GITHUB_VERSION_NODE_LOAD_SUCCESS',
  GITHUB_VERSION_NODE_TAG_LOAD = 'GITHUB_VERSION_NODE_TAG_LOAD',
  GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS = 'GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS',
  GITHUB_VERSION_DEBUGGER_LOAD = 'GITHUB_VERSION_DEBUGGER_LOAD',
  GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS = 'GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS',
}

export const GITHUB_VERSION_EXPLORER_LOAD = GithubVersionActionTypes.GITHUB_VERSION_EXPLORER_LOAD;
export const GITHUB_VERSION_EXPLORER_LOAD_SUCCESS = GithubVersionActionTypes.GITHUB_VERSION_EXPLORER_LOAD_SUCCESS;
export const GITHUB_VERSION_NODE_LOAD = GithubVersionActionTypes.GITHUB_VERSION_NODE_LOAD;
export const GITHUB_VERSION_NODE_LOAD_SUCCESS = GithubVersionActionTypes.GITHUB_VERSION_NODE_LOAD_SUCCESS;
export const GITHUB_VERSION_NODE_TAG_LOAD = GithubVersionActionTypes.GITHUB_VERSION_NODE_TAG_LOAD;
export const GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS = GithubVersionActionTypes.GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS;
export const GITHUB_VERSION_DEBUGGER_LOAD = GithubVersionActionTypes.GITHUB_VERSION_DEBUGGER_LOAD;
export const GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS = GithubVersionActionTypes.GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS;

export class GithubVersionExplorerLoad implements Action {
  readonly type = GITHUB_VERSION_EXPLORER_LOAD;

  constructor(public payload: string) { }
}

export class GithubVersionExplorerLoadSuccess implements Action {
  readonly type = GITHUB_VERSION_EXPLORER_LOAD_SUCCESS;

  constructor(public payload: string) { }
}

export class GithubVersionNodeLoad implements Action {
  readonly type = GITHUB_VERSION_NODE_LOAD;
}

export class GithubVersionNodeLoadSuccess implements Action {
  readonly type = GITHUB_VERSION_NODE_LOAD_SUCCESS;

  constructor(public payload: string) { }
}

export class GithubVersionNodeTagLoad implements Action {
  readonly type = GITHUB_VERSION_NODE_TAG_LOAD;
}

export class GithubVersionNodeTagLoadSuccess implements Action {
  readonly type = GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS;

  constructor(public payload: string) { }
}

export class GithubVersionDebuggerLoad implements Action {
  readonly type = GITHUB_VERSION_DEBUGGER_LOAD;
}

export class GithubVersionDebuggerLoadSuccess implements Action {
  readonly type = GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS;

  constructor(public payload: string) { }
}

export type GithubVersionActions = GithubVersionExplorerLoad
  | GithubVersionExplorerLoadSuccess
  | GithubVersionNodeLoad
  | GithubVersionNodeLoadSuccess
  | GithubVersionNodeTagLoad
  | GithubVersionNodeTagLoadSuccess
  | GithubVersionDebuggerLoad
  | GithubVersionDebuggerLoadSuccess
  ;
