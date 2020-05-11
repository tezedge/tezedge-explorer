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
            return this.http.get(environment.api.default.http + '/p2p/0/500' + action.payload)
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


    // @Effect()
    // NetworkActionFilter$ = this.actions$.pipe(
    //     ofType('NETWORK_ACTION_FILTER'),

    //     // dispatch action
    //     map((payload) => ({ type: 'NETWORK_ACTION_LOAD_SUCCESS', payload: payload })),
    //     catchError((error, caught) => {
    //         console.error(error)
    //         this.store.dispatch({
    //             type: 'NETWORK_ACTION_LOAD_ERROR',
    //             payload: error,
    //         });
    //         return caught;
    //     })

    // )

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}