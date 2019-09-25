import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';
import { webSocket } from "rxjs/webSocket";

import { environment } from '../../environments/environment';

@Injectable()
export class SettingsEffects {

    @Effect()
    SettingsInitEffect$ = this.actions$.pipe(
        ofType('SETTINGS_INIT'),

        // connect to ws
        // switchMap(() => webSocket(environment.api.ws).pipe(
        //     // tap(data => console.log('[METRICS_SUBSCRIBE][ws] payload: ', data)),
        // )),

        // // TODO: handle errors
        // // TODO: map ws to redux actions
        // // dispatch action from ws 
        // map((data) => ({ ...data })),

        // tap(() => console.log('[MetricsSubscribeEffect]')),

        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'SETTINGS_INIT_ERROR',
                payload: error,
            });
            return caught;
        })

    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}