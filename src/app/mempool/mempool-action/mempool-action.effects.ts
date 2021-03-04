import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError, tap, filter, takeUntil } from 'rxjs/operators';
import { of, Subject, empty, timer } from 'rxjs';

const mempoolActionDestroy$ = new Subject();

@Injectable()
export class MempoolActionEffects {

    @Effect()
    MempoolActionLoad$ = this.actions$.pipe(
        ofType('MEMPOOL_ACTION_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(state.settingsNode.activeNode.http + '/chains/main/mempool/pending_operations' );
        }),

        // dispatch action
        map((payload) => ({ type: 'MEMPOOL_ACTION_LOAD_SUCCESS', payload })),
        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'MEMPOOL_ACTION_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    );

    // load mempool actions
    @Effect()
    MempoolActionStartEffect$ = this.actions$.pipe(
        ofType('MEMPOOL_ACTION_START'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) =>

            // get header data every second
            timer(0, 1000).pipe(
                takeUntil(mempoolActionDestroy$),
                switchMap(() =>
                    this.http.get(state.settingsNode.activeNode.mempool + '/chains/main/mempool/pending_operations').pipe(
                        map(response => ({ type: 'MEMPOOL_ACTION_START_SUCCESS', payload: response })),
                        catchError(error => of({ type: 'MEMPOOL_ACTION_START_ERROR', payload: error })),
                    )
                )
            )
        ),
    );

    // stop mempool action download
    @Effect({ dispatch: false })
    MempoolActionStopEffect$ = this.actions$.pipe(
        ofType('MEMPOOL_ACTION_STOP'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            // console.log('[LOGS_ACTION_STOP] stream', state.logsAction.stream);
            // close all open observables
            mempoolActionDestroy$.next();
        }),
    );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
