import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject, timer } from 'rxjs';

const storageBlockDestroy$ = new Subject();

@Injectable()
export class StorageBlockEffects {

  @Effect()
  StorageBlockReset$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_RESET'),
    // dispatch action
    map((payload) => ({ type: 'STORAGE_BLOCK_RESET_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_RESET_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  StorageBlockLoad$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.http.get(setUrl(action, state));
    }),

    // dispatch action
    map((payload) => ({ type: 'STORAGE_BLOCK_LOAD_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  StorageBlockStartEffect$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_START'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    switchMap(({ action, state }) =>

      // get header data every 30 seconds
      timer(0, 30000).pipe(
        takeUntil(storageBlockDestroy$),
        switchMap(() =>
          this.http.get(setUrl(action, state)).pipe(
            map(response => ({ type: 'STORAGE_BLOCK_START_SUCCESS', payload: response })),
            catchError(error => of({ type: 'STORAGE_BLOCK_START_ERROR', payload: error }))
          )
        )
      )
    )
  );

  // stop storage block download
  @Effect({ dispatch: false })
  StorageBlockStopEffect$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_STOP'),
    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),
    // init app modules
    tap(({ action, state }) => {
      storageBlockDestroy$.next();
    })
  );

  @Effect()
  StorageBlockDetailsLoad$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_DETAILS_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.http.get(setDetailsUrl(action, state));
    }),

    // dispatch action
    map((payload) => ({ type: 'STORAGE_BLOCK_DETAILS_LOAD_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_DETAILS_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>
  ) {
  }

}

export function setUrl(action, state) {
  const url = state.settingsNode.api.http + '/dev/chains/main/blocks/?';
  const cursor = storageBlockCursor(action);
  const filters = ''; // use it when we need to filter the list
  const limit = storageBlockLimit(action);

  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${limit}`;
}

// use limit to load just the necessary number of records
export function storageBlockLimit(action) {
  const limitNr = action.payload && action.payload.limit ?
    action.payload.limit :
    '60';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
export function storageBlockCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `from_block_id=${action.payload.cursor_id}` :
    '';
}

export function setDetailsUrl(action, state) {
  return state.settingsNode.api.http + '/chains/main/blocks/' + action.payload.hash;
}
