import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { empty, ObservedValueOf, of } from 'rxjs';
import { State } from '@app/app.index';
import { APP_INIT, APP_INIT_DEFAULT, APP_INIT_SUCCESS, APP_REFRESH } from '@app/app.actions';


@Injectable({ providedIn: 'root' })
export class AppEffects {

  ngrxEffectsInit$ = createEffect(() => this.actions$.pipe(
    ofType('@ngrx/effects/init'),
    map(() => ({ type: 'SETTINGS_NODE_LOAD', payload: window.location.hostname }))
  ));

  appInitEffect$ = createEffect(() => this.actions$.pipe(
    ofType(APP_INIT),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => state.app.initialized ? empty() : of({ type: APP_INIT_SUCCESS }))
  ));

  appNodeChangeEffect$ = createEffect(() => this.actions$.pipe(
    ofType('APP_NODE_CHANGE'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    map(({ action, state }) => ({ type: 'SETTINGS_NODE_CHANGE', payload: state.settingsNode }))
  ));

  appInitDefaultEffect$ = createEffect(() => this.actions$.pipe(
    ofType(APP_INIT_DEFAULT),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate([''])
      );
    }),
    map(() => ({ type: 'SETTINGS_NODE_LOAD' }))
  ));

  appRefreshEffect$ = createEffect(() => this.actions$.pipe(
    ofType(APP_REFRESH),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      const activePage = this.router.url.slice(1);
      const features = state.settingsNode.activeNode.features;
      if (!features.some(feature => feature.name === activePage)) {
        this.router.navigate(['']);
      }
    })
  ), { dispatch: false });

  constructor(private actions$: Actions,
              private store: Store<State>,
              private router: Router) { }

}
