import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { State, Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';

const mempoolActionDestroy$ = new Subject();

@Injectable({ providedIn: 'root' })
export class MempoolActionEffects {

  MempoolActionLoad$ = createEffect(() => this.actions$.pipe(
    ofType('MEMPOOL_ACTION_LOAD'),

    withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),

    switchMap(({ action, state }) =>
      this.http.get(state.settingsNode.activeNode.http + '/chains/main/mempool/pending_operations')
    ),

    map((payload) => ({ type: 'MEMPOOL_ACTION_LOAD_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'MEMPOOL_ACTION_LOAD_ERROR',
        payload: error,
      });
      return caught;
    })
  ));

  // load mempool actions
  MempoolActionStartEffect$ = createEffect(() => this.actions$.pipe(
    ofType('MEMPOOL_ACTION_START'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),

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
  ));

  // stop mempool action download
  MempoolActionStopEffect$ = createEffect(() => this.actions$.pipe(
    ofType('MEMPOOL_ACTION_STOP'),
    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),
    // init app modules
    tap(({ action, state }) => {
      // console.log('[LOGS_ACTION_STOP] stream', state.logsAction.stream);
      // close all open observables
      mempoolActionDestroy$.next(null);
    }),
  ), { dispatch: false });

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>,
  ) { }

}
