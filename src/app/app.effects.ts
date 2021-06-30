import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { empty, ObservedValueOf, of } from 'rxjs';
import { State } from './app.reducers';

@Injectable()
export class AppEffects {

  @Effect()
  SettingsNodeLoadEffect$ = this.actions$.pipe(
    ofType('@ngrx/effects/init'),
    map(() => ({ type: 'SETTINGS_NODE_LOAD', payload: window.location.hostname }))
  );

  @Effect()
  AppInitEffect$ = this.actions$.pipe(
    ofType('APP_INIT'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    flatMap(({ action, state }) => state.app.initialized ? empty() : of({ type: 'APP_INIT_SUCCESS' }))
  );

  @Effect()
  AppNodeChangeEffect$ = this.actions$.pipe(
    ofType('APP_NODE_CHANGE'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    map(({ action, state }) => ({ type: 'SETTINGS_NODE_CHANGE', payload: state.settingsNode }))
  );

  @Effect()
  AppInitDefaultEffect$ = this.actions$.pipe(
    ofType('APP_INIT_DEFAULT'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
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

  @Effect({ dispatch: false })
  AppRefreshEffect$ = this.actions$.pipe(
    ofType('APP_REFRESH'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      const activePage = this.router.url.slice(1);
      const features = state.settingsNode.activeNode.features;
      if (!features.some(feature => feature.name === activePage)) {
        this.router.navigate(['']);
      }
    })
  );

  @Effect()
  AppInitSuccessEffect$ = this.actions$.pipe(
    ofType('APP_INIT_SUCCESS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return [];
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private router: Router,
  ) { }

}
