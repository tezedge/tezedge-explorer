import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

@Injectable()
export class EndpointsActionEffects {

    @Effect()
    EndpointsActionLoad$ = this.actions$.pipe(
        ofType('ENDPOINTS_ACTION_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(state.settingsNode.api.http + '/rpc/0/500' + action.payload)
        }),

        // dispatch action
        map((payload) => ({ type: 'ENDPOINTS_ACTION_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'ENDPOINTS_ACTION_LOAD_ERROR',
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