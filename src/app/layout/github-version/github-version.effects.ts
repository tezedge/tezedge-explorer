import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { State } from '@app/app.reducers';
import { ADD_ERROR } from '@shared/components/error-popup/error-popup.actions';
import { ObservedValueOf } from 'rxjs';
import {
  GITHUB_VERSION_DEBUGGER_LOAD,
  GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS,
  GITHUB_VERSION_NODE_LOAD,
  GITHUB_VERSION_NODE_LOAD_SUCCESS,
  GITHUB_VERSION_NODE_TAG_LOAD,
  GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS
} from '@app/layout/github-version/github-version.actions';

@Injectable({ providedIn: 'root' })
export class GithubVersionEffects {

  versionNodeLoad$ = createEffect(() => this.actions$.pipe(
    ofType(GITHUB_VERSION_NODE_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.http.get(state.settingsNode.activeNode.http + '/monitor/commit_hash/')),
    map((payload) => ({ type: GITHUB_VERSION_NODE_LOAD_SUCCESS, payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ADD_ERROR,
        payload: { title: 'Node version HTTP error:', message: error.message }
      });
      return caught;
    })
  ));

  versionDebuggerLoad$ = createEffect(() => this.actions$.pipe(
    ofType(GITHUB_VERSION_DEBUGGER_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const debuggerUrl = state.settingsNode.activeNode.features.find(f => f.name === 'debugger').url;
      return this.http.get(`${debuggerUrl}/v2/version/`);
    }),
    map((payload) => ({ type: GITHUB_VERSION_DEBUGGER_LOAD_SUCCESS, payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ADD_ERROR,
        payload: { title: 'Debugger version HTTP error:', message: error.message }
      });
      return caught;
    })
  ));

  versionNodeTagLoad$ = createEffect(() => this.actions$.pipe(
    ofType(GITHUB_VERSION_NODE_TAG_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const url = state.settingsNode.activeNode.type === 'octez'
        ? state.settingsNode.activeNode.http + '/version/'
        : state.settingsNode.activeNode.http + '/dev/version/';
      return this.http.get(url);
    }),
    map((payload) => ({ type: GITHUB_VERSION_NODE_TAG_LOAD_SUCCESS, payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: ADD_ERROR,
        payload: { title: 'Node tag version HTTP error:', message: error.message }
      });
      return caught;
    })
  ));

  constructor(private http: HttpClient,
              private actions$: Actions,
              private store: Store<State>) { }

}
