import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

// import { environment } from '../../environments/environment';

@Injectable()
export class StorageBlockEffects {

    @Effect()
    StorageBlock$ = this.actions$.pipe(
        ofType('STORAGE_BLOCK_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get('http://babylon.tezedge.com:18732/dev/chains/main/blocks')
        }),

        // tap((payload) => console.log("[STORAGE_BLOCK_LOAD_SUCCESS]", payload)),

        // dispatch action
        map((payload) => ({ type: 'STORAGE_BLOCK_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'STORAGE_BLOCK_LOAD_ERROR',
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