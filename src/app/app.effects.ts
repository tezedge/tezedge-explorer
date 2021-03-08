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
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

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
    AppInitSuccessEffect$ = this.actions$.pipe(
        ofType('APP_INIT_SUCCESS'),
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        switchMap(({ action, state }) => {
            const appFeaturesActions = [];

            appFeaturesActions.push({ type: 'MONITORING_LOAD' });
            appFeaturesActions.push({ type: 'MEMPOOL_INIT' });
            appFeaturesActions.push({ type: 'MEMPOOL_ACTION_LOAD' });
            appFeaturesActions.push({ type: 'NETWORK_INIT' });
            appFeaturesActions.push({ type: 'RESOURCES_STATS_LOAD' });
            appFeaturesActions.push({ type: 'VERSION_NODE_LOAD' });
            appFeaturesActions.push({ type: 'LOGS_ACTION_LOAD' });

            return appFeaturesActions;
        })
    );

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
    ) { }

}
