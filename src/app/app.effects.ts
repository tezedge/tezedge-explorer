import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, map, switchMap,  withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
        tap(({ action, state }) => {

            let redirectUrl = '';
            if (action.payload.connected) {
                if (action.payload.ws === false) {
                    redirectUrl = 'monitoring';
                    // redirectUrl = 'mempool';
                } else {
                    redirectUrl = 'monitoring';
                    // redirectUrl = 'mempool';
                }
            } else {
                redirectUrl = '';
            }

            // force url reload
            this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
                this.router.navigate([redirectUrl])
            );

        }),
        map(() => ({ type: 'APP_INIT_SUCCESS' }))
    );

    // initialize app features
    @Effect()
    AppInitSuccessEffect$ = this.actions$.pipe(
        ofType('APP_INIT_SUCCESS'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        switchMap(({ action, state }) => {
            const appFeaturesActions = [];

            // appFeaturesActions.push({ type: 'MONITORING_INIT' });
            // appFeaturesActions.push({ type: 'NETWORK_INIT' });
            // appFeaturesActions.push({ type: 'STORAGE_INIT' });
            // appFeaturesActions.push({ type: 'RPC_INIT' });
            // appFeaturesActions.push({ type: 'LOGS_INIT' });

            return appFeaturesActions;
        })
    );

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private http: HttpClient,
    ) { }

}
