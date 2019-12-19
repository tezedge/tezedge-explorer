import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class StorageActionEffects {

    @Effect()
    StorageBlockAction$ = this.actions$.pipe(
        ofType('STORAGE_BLOCK_ACTION_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(environment.api.http + '/dev/chains/main/blocks/' + action.payload.blockHash + '/actions')
        }),

        // dispatch action
        map((payload) => ({ type: 'STORAGE_BLOCK_ACTION_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'STORAGE_BLOCK_ACTION_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    )
    
    @Effect()
    StorageAddressAction$ = this.actions$.pipe(
        ofType('STORAGE_ADDRESS_ACTION_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(environment.api.http + '/dev/chains/main/actions/contracts/' + action.payload.addressHash + '?limit=100&offset=0');
        }),

        // dispatch action
        map((payload) => ({ type: 'STORAGE_ADDRESS_ACTION_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'STORAGE_ADDRESS_ACTION_LOAD_ERROR',
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