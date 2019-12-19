import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class StorageSearchEffects {

    @Effect()
    StorageSearch$ = this.actions$.pipe(
        ofType('STORAGE_SEARCH'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(environment.api.http + '/dev/chains/main/actions/contracts/' + action.payload + '?limit=100&offset=0');
        }),

        // tap((payload) => console.log("[STORAGE_SEARCH_SUCCESS]", payload)),

        // dispatch action
        map((payload) => ({ type: 'STORAGE_SEARCH_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'STORAGE_SEARCH_ERROR',
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