import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { empty, ObservedValueOf, of } from 'rxjs';
import { State } from './app.reducers';

@Injectable()
export class AppEffects {

  // load node settings
  @Effect()
  SettingsNodeLoadEffect$ = this.actions$.pipe(
    ofType('@ngrx/effects/init'),
    // get current url
    map(() => ({ type: 'SETTINGS_NODE_LOAD', payload: window.location.hostname }))
  );

  // initialize app features
  @Effect()
  AppInitEffect$ = this.actions$.pipe(
    ofType('APP_INIT'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    // TODO: refactor and add checks for every featured api (node, debugger, monitoring )

    flatMap(({ action, state }) => state.app.initialized ? empty() : of({ type: 'APP_INIT_SUCCESS' }))
  );

  @Effect()
  AppNodeChangeEffect$ = this.actions$.pipe(
    ofType('APP_NODE_CHANGE'),

    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    map(({ action, state }) => ({ type: 'SETTINGS_NODE_CHANGE', payload: state.settingsNode }))
  );

  // initialize empty app
  @Effect()
  AppInitDefaultEffect$ = this.actions$.pipe(
    ofType('APP_INIT_DEFAULT'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    // TODO: refactor and add checks for every featured api (node, debugger, monitoring )
    tap(({ action, state }) => {
      // force url reload
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate([''])
      );
    }),
    map(() => ({ type: 'APP_INIT_DEFAULT_SUCCESS' }))
  );

  @Effect()
  AppInitDefaultSuccessEffect$ = this.actions$.pipe(
    ofType('APP_INIT_DEFAULT_SUCCESS'),
    map(() => ({ type: 'SETTINGS_NODE_LOAD' }))
  );

  @Effect()
  AppRefreshEffect$ = this.actions$.pipe(
    ofType('APP_REFRESH'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const activePage = this.router.url.replace('/', '').toUpperCase();

      let featureLoadAction = `${activePage}_LOAD`;

      if (!state.settingsNode.activeNode.features.includes(activePage)) {
        featureLoadAction = `${state.settingsNode.activeNode.features[0]}_LOAD`;
        this.router.navigate([state.settingsNode.activeNode.features[0].toLowerCase()]);
      }
      const featuresToLoad = [{ type: featureLoadAction, payload: null }];
      console.log(featuresToLoad);
      if (featureLoadAction !== 'MONITORING_LOAD') {
        featuresToLoad.push({ type: 'MONITORING_LOAD', payload: { lazyCalls: true } });
      }
      return featuresToLoad;
    })
  );

  @Effect()
  AppInitSuccessEffect$ = this.actions$.pipe(
    ofType('APP_INIT_SUCCESS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {

      const appFeaturesActions = [];
      const activePage = window.location.hash.slice(window.location.hash.indexOf('/') + 1);
      state.settingsNode.activeNode.features
        .filter(feature => !feature.toLowerCase().includes(activePage.toLowerCase()))
        .forEach(feature => {
          appFeaturesActions.push({ type: `${feature}_LOAD`, payload: { initialLoad: true } });
        });

      return appFeaturesActions;
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private router: Router,
  ) { }

}
