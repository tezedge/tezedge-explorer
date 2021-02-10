import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { of, Subject, timer } from 'rxjs';

@Injectable()
export class CommitNumberEffects {

  @Effect()
  VersionNodeLoad$ = this.actions$.pipe(
    ofType('VERSION_NODE_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    switchMap(({ action, state }) => {
      return this.http.get(setNodeCommitUrl(state));
    }),

    // dispatch action
    map((payload) => ({ type: 'VERSION_NODE_LOAD_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'VERSION_NODE_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  VersionDebuggerLoad$ = this.actions$.pipe(
    ofType('VERSION_DEBUGGER_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    switchMap(({ action, state }) => {
      return this.http.get(setDebuggerCommitUrl(state));
    }),

    // dispatch action
    map((payload) => ({ type: 'VERSION_DEBUGGER_LOAD_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'VERSION_DEBUGGER_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  VersionNodeTagLoad$ = this.actions$.pipe(
    ofType('VERSION_NODE_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    switchMap(({ action, state }) => {
      return this.http.get(setNodeTagUrl(state));
    }),

    // dispatch action
    map((payload) => ({ type: 'VERSION_NODE_TAG_LOAD_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'VERSION_NODE_TAG_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>
  ) {
  }

}

export function setNodeCommitUrl(state) {
  return state.settingsNode.api.http + '/monitor/commit_hash/';
}

export function setNodeTagUrl(state) {
  return state.settingsNode.api.http + '/dev/version/';
}

export function setDebuggerCommitUrl(state) {
  return state.settingsNode.api.debugger + '/v2/version/';
}
