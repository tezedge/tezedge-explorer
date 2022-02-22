import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { combineLatest, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '@app/app.reducers';
import { StorageBlockService } from './storage-block.service';
import { ADD_ERROR } from '@shared/components/error-popup/error-popup.actions';
import { STORAGE_BLOCK_CHECK_AVAILABLE_CONTEXTS, STORAGE_BLOCK_LOAD_ROUTED_BLOCK, STORAGE_BLOCK_MAP_AVAILABLE_CONTEXTS } from './storage-block.actions';


@Injectable({ providedIn: 'root' })
export class StorageBlockEffects {

  private storageBlockDestroy$ = new Subject();

  storageBlockLoad$ = createEffect(() => this.actions$.pipe(
    ofType('STORAGE_BLOCK_FETCH'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.http.get(setUrl(action, state));
    }),
    map((payload) => ({ type: 'STORAGE_BLOCK_FETCH_SUCCESS', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_FETCH_ERROR',
        payload: error
      });
      return caught;
    })
  ));

  storageBlockStartEffect$ = createEffect(() => this.actions$.pipe(
    ofType('STORAGE_BLOCK_START'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      timer(0, 30000).pipe(
        takeUntil(this.storageBlockDestroy$),
        switchMap(() =>
          this.http.get(setUrl(action, state)).pipe(
            map(response => ({ type: 'STORAGE_BLOCK_START_SUCCESS', payload: response })),
            catchError(error => of({ type: 'STORAGE_BLOCK_START_ERROR', payload: error }))
          )
        )
      )
    )
  ));

  storageBlockLoadRoutedBlockEffect$ = createEffect(() => this.actions$.pipe(
    ofType(STORAGE_BLOCK_LOAD_ROUTED_BLOCK),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.http.get(setUrl(action, state))
    ),
    switchMap((response: any[]) => [
      { type: 'STORAGE_BLOCK_STOP' },
      { type: 'STORAGE_BLOCK_START_SUCCESS', payload: response }
    ]),
  ));

  storageBlockStartSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType('STORAGE_BLOCK_START_SUCCESS', 'STORAGE_BLOCK_FETCH_SUCCESS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    map(({ action, state }) => ({ type: STORAGE_BLOCK_CHECK_AVAILABLE_CONTEXTS }))
  ));

  storageBlockGetNextBlockDetailsEffect$ = createEffect(() => this.actions$.pipe(
    ofType('STORAGE_BLOCK_NEIGHBOUR_BLOCK_DETAILS'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    map(({ action, state }) => {
      const currentHash = state.storageBlock.selected.hash;
      const entities = Object.keys(state.storageBlock.entities).map(key => state.storageBlock.entities[key]);
      const currentBlockIndex = entities.findIndex(block => block.hash === currentHash);
      if (currentBlockIndex !== -1) {
        return {
          type: 'STORAGE_BLOCK_DETAILS_LOAD',
          payload: {
            hash: entities[currentBlockIndex + action.payload.neighbourIndex].hash,
            context: 'tezedge'
          }
        };
      }
      return;
    })
  ));

  storageBlockCheckAvailableContextsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(STORAGE_BLOCK_CHECK_AVAILABLE_CONTEXTS),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.storageBlockService.checkStorageBlockAvailableContexts(state.settingsNode.activeNode.http, state.storageBlock.entities[0].hash)
    ),
    map((contexts: string[]) => ({ type: STORAGE_BLOCK_MAP_AVAILABLE_CONTEXTS, payload: contexts })),
    catchError(error => of({ type: ADD_ERROR, payload: { title: 'Storage block details error', message: error.message } }))
  ));

  storageBlockMapAvailableContextsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(STORAGE_BLOCK_MAP_AVAILABLE_CONTEXTS),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.storageBlock.routedBlock),
    map(({ action, state }) => ({ type: 'STORAGE_BLOCK_DETAILS_LOAD', payload: { hash: state.storageBlock.entities[state.storageBlock.ids.length - 1].hash } })),
    catchError(error => of({ type: ADD_ERROR, payload: { title: 'Storage block details error', message: error.message } }))
  ));

  storageBlockDetailsLoad$ = createEffect(() => this.actions$.pipe(
    ofType('STORAGE_BLOCK_DETAILS_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return combineLatest(
        this.http.get(setDetailsUrl(action, state)),
        this.storageBlockService.getStorageBlockContextDetails(
          state.settingsNode.activeNode.http,
          action.payload.hash,
          action.payload.context || state.storageBlock.availableContexts[0]
        ),
      );
    }),
    map((response) => {
      const payload = {
        selected: response[0],
        blockDetails: response[1]
      };
      return ({ type: 'STORAGE_BLOCK_DETAILS_LOAD_SUCCESS', payload });
    }),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_DETAILS_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  ));

  storageBlockStopEffect$ = createEffect(() => this.actions$.pipe(
    ofType('STORAGE_BLOCK_STOP', 'STORAGE_BLOCK_RESET'),
    tap(() => this.storageBlockDestroy$.next(null))
  ), { dispatch: false });

  constructor(private http: HttpClient,
              private actions$: Actions,
              private store: Store<State>,
              private storageBlockService: StorageBlockService) { }

}

export function setUrl(action, state) {
  const url = state.settingsNode.activeNode.http + '/dev/chains/main/blocks/?';
  const cursor = storageBlockCursor(action);
  const filters = ''; // use it when we need to filter the list
  const limit = storageBlockLimit(action);

  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${limit}`;
}

// use limit to load just the necessary number of records
export function storageBlockLimit(action) {
  const limitNr = action.payload && action.payload.limit ?
    action.payload.limit :
    '100';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
export function storageBlockCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `from_block_id=${action.payload.cursor_id}` :
    '';
}

export function setDetailsUrl(action, state) {
  return state.settingsNode.activeNode.http + '/chains/main/blocks/' + action.payload.hash;
}
