import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

// import { environment } from '../../environments/environment';

@Injectable()
export class StorageActionEffects {

    @Effect()
    StorageActionBlock$ = this.actions$.pipe(
        ofType('STORAGE_ACTION_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get('http://195.201.111.145:18732/dev/chains/main/blocks/' + action.payload.blockId + '/actions')
        }),

        // dispatch action
        map((payload) => ({ type: 'STORAGE_ACTION_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'STORAGE_ACTION_LOAD_ERROR',
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