import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject, empty, timer } from 'rxjs';

const storageActionDestroy$ = new Subject();

@Injectable()
export class StorageBlockEffects {

    @Effect()
    StorageBlock$ = this.actions$.pipe(
        ofType('STORAGE_BLOCK_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        switchMap(({ action, state }) => {
            return this.http.get(state.settingsNode.api.http + '/dev/chains/main/blocks?limit=30');
        }),

        // dispatch action
        map((payload) => ({ type: 'STORAGE_BLOCK_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'STORAGE_BLOCK_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    );


    // load storage actions
    @Effect()
    NetworkActionStartEffect$ = this.actions$.pipe(
        ofType('STORAGE_BLOCK_START'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        switchMap(({ action, state }) =>

            // get header data every second
            timer(0, 15000).pipe(
                takeUntil(storageActionDestroy$),
                switchMap(() =>
                    this.http.get(state.settingsNode.api.http + '/dev/chains/main/blocks?' + 'limit=30').pipe(
                        map(response => ({ type: 'STORAGE_BLOCK_START_SUCCESS', payload: response })),
                        catchError(error => of({ type: 'STORAGE_BLOCK_START_ERROR', payload: error })),
                    )
                )
            )
        ),
    );


    // stop storage action download
    @Effect({ dispatch: false })
    StorageBlockStopEffect$ = this.actions$.pipe(
        ofType('STORAGE_BLOCK_STOP'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            storageActionDestroy$.next();
        }),
    );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
