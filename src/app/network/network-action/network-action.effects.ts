import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class NetworkActionEffects {

    @Effect()
    NetworkActionLoad$ = this.actions$.pipe(
        ofType('NETWORK_ACTION_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(environment.api.mock + '/p2p/')
        }),

        // dispatch action
        map((payload) => ({ type: 'NETWORK_ACTION_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'NETWORK_ACTION_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    )

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}