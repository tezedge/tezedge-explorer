import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { empty, forkJoin, ObservedValueOf, of } from 'rxjs';
import { catchError, flatMap, map, withLatestFrom } from 'rxjs/operators';
import { SettingsNodeService } from './settings-node.service';
import { State } from '@app/app.reducers';
import { SettingsNodeEntity } from '@shared/types/settings-node/settings-node-entity.type';

@Injectable({ providedIn: 'root' })
export class SettingsNodeEffects {

  settingsNodeLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    flatMap(({ action, state }: { action: any, state: State }) =>
      state.settingsNode.ids
        .map(id => state.settingsNode.entities[id])
        .map(activeNode => ({ action, activeNode }))),
    flatMap(({ action, activeNode }: { action: any, activeNode: SettingsNodeEntity }) => {
      return forkJoin([
        this.settingsNodeService.getSettingsHeader(activeNode.http),
        this.settingsNodeService.getNodeFeatures(activeNode.http, activeNode.id),
      ]).pipe(
        map(([header, features]) => ({
          type: 'SETTINGS_NODE_LOAD_SUCCESS',
          payload: { activeNode, header, features, checkOnly: action.payload.checkOnly }
        })),
        catchError((error) => of({ type: 'SETTINGS_NODE_LOAD_ERROR', payload: { activeNode, response: error } })),
      );
    }),
  ));

  settingsNodeInitEffect$ = createEffect(() => this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD_SUCCESS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    flatMap(({ action, state }) => {
        return (
          state.settingsNode && state.settingsNode.activeNode
          && action.payload && action.payload.activeNode.id === state.settingsNode.activeNode.id
          && !action.payload.checkOnly
        )
          ? of({ type: 'APP_INIT', payload: state.settingsNode.activeNode })
          : empty();
      }
    ),
  ));

  settingsNodeChangeEffect$ = createEffect(() => this.actions$.pipe(
    ofType('SETTINGS_NODE_CHANGE'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    flatMap(({ action, state }) => of({ type: 'APP_REFRESH', payload: state.settingsNode.activeNode })),
  ));

  settingsNodeLoadSandboxEffect$ = createEffect(() => this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD_SANDBOX'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    flatMap(({ action, state }) => {
      const sandbox = state.settingsNode.entities['sandbox-carthage-tezedge'];
      return this.http.get(sandbox.http + '/chains/main/blocks/head/header').pipe(
        // dispatch action
        map((response) => ({ type: 'SETTINGS_NODE_LOAD_SANDBOX_SUCCESS', payload: { api: sandbox, response } })),
        // dispatch error
        catchError((error) => of({
          type: 'SETTINGS_NODE_LOAD_SANDBOX_ERROR',
          payload: { api: sandbox, response: error }
        })),
      );
    }),
  ));

  settingsNodeSandboxSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType('SETTINGS_NODE_LOAD_SANDBOX_SUCCESS'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    flatMap(({ action, state }) => {
      return of({ type: 'APP_INIT', payload: state.settingsNode.entities['sandbox-carthage-tezedge'] });
    }),
  ));

  constructor(private http: HttpClient,
              private actions$: Actions,
              private store: Store<State>,
              private settingsNodeService: SettingsNodeService) { }

}
