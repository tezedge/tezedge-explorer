import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { empty, of } from 'rxjs';
import { catchError, flatMap, map, withLatestFrom } from 'rxjs/operators';
import { SettingsNodeEntityHeader } from '../../shared/types/settings-node/settings-node-entity-header.type';
import { SettingsNodeService } from './settings-node.service';

@Injectable()
export class SettingsNodeEffects {

  // check node availability
  @Effect()
  SettingsNodeLoadEffect$ = this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD'),
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),
    flatMap(({ action, state }) => state.settingsNode.ids.map(id => state.settingsNode.entities[id])),
    flatMap((api: any) =>
      this.settingsNodeService.getSettingsHeader(api.http).pipe(
        map((response: SettingsNodeEntityHeader) => ({ type: 'SETTINGS_NODE_LOAD_SUCCESS', payload: { api, response } })),
        catchError((error) => of({ type: 'SETTINGS_NODE_LOAD_ERROR', payload: { api, response: error } })),
      )
    ),
  );

  @Effect()
  SettingsNodeInitEffect$ = this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD_SUCCESS'),

    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    flatMap(({ action, state }) =>
      state.settingsNode && state.settingsNode.api && action.payload && action.payload.api.id === state.settingsNode.api.id
        ? of({ type: 'APP_INIT', payload: state.settingsNode.api })
        : empty()
    ),
  );

  @Effect()
  SettingsNodeChangeEffect$ = this.actions$.pipe(
    ofType('SETTINGS_NODE_CHANGE'),

    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    flatMap(({ action, state }) => of({ type: 'APP_INIT', payload: state.settingsNode.api })),
  );

  @Effect()
  SettingsNodeLoadSandboxEffect$ = this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD_SANDBOX'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    // check if api is available
    flatMap(({ action, state }) => {
      const sandbox = state.settingsNode.entities['sandbox-carthage-tezedge'];
      return this.http.get(sandbox.http + '/chains/main/blocks/head/header').pipe(
        // dispatch action
        map((response) => ({ type: 'SETTINGS_NODE_LOAD_SANDBOX_SUCCESS', payload: { api: sandbox, response } })),
        // dispatch error
        catchError((error) => of({ type: 'SETTINGS_NODE_LOAD_SANDBOX_ERROR', payload: { api: sandbox, response: error } })),
      );
    }),
  );

  @Effect()
  SettingsNodeSandboxSuccessEffect$ = this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD_SANDBOX_SUCCESS'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    flatMap(({ action, state }) => {
      return of({ type: 'APP_INIT', payload: state.settingsNode.entities['sandbox-carthage-tezedge'] });
    }),
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>,
    private settingsNodeService: SettingsNodeService
  ) { }

}
