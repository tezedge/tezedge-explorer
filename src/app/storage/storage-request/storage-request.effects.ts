import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, Subject, timer } from 'rxjs';
import { State } from '@app/app.reducers';
import { StorageRequestService } from '@storage/storage-request/storage-request.service';
import {
  STORAGE_REQUESTS_INIT,
  STORAGE_REQUESTS_LOAD,
  STORAGE_REQUESTS_LOAD_SUCCESS,
  STORAGE_REQUESTS_STOP,
  STORAGE_REQUESTS_STREAM_CHANGE,
  StorageRequestInitAction,
  StorageRequestLoadAction,
  StorageRequestStreamChangeAction
} from '@storage/storage-request/storage-request.actions';
import { StorageRequest } from '@shared/types/storage/request/storage-request.type';


@Injectable({ providedIn: 'root' })
export class StorageRequestEffects {

  private storageRequestDestroy$ = new Subject();
  private stream: boolean;

  storageRequestInitEffect$ = createEffect(() => this.actions$.pipe(
    ofType(STORAGE_REQUESTS_INIT),
    withLatestFrom(this.store, (action: StorageRequestInitAction, state: ObservedValueOf<Store<State>>) => state),
    tap((state: State) => this.stream = state.storage.requestState.stream),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(this.storageRequestDestroy$),
        filter(() => this.stream),
        map(() => ({ type: STORAGE_REQUESTS_LOAD }))
      )
    )
  ));

  storageRequestLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(STORAGE_REQUESTS_LOAD),
    withLatestFrom(this.store, (action: StorageRequestLoadAction, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    mergeMap(({ action, state }) => this.storageRequestService.getStorageRequests(state.settingsNode.activeNode.http)),
    map((payload: StorageRequest[]) => ({ type: STORAGE_REQUESTS_LOAD_SUCCESS, payload }))
  ));

  storageRequestStreamChangeEffect$ = createEffect(() => this.actions$.pipe(
    ofType(STORAGE_REQUESTS_STREAM_CHANGE),
    withLatestFrom(this.store, (action: StorageRequestStreamChangeAction, state: ObservedValueOf<Store<State>>) => action),
    tap((action: StorageRequestStreamChangeAction) => this.stream = action.payload.stream),
  ), { dispatch: false });

  storageRequestStopEffect$ = createEffect(() => this.actions$.pipe(
    ofType(STORAGE_REQUESTS_STOP),
    tap(() => this.storageRequestDestroy$.next(null))
  ), { dispatch: false });

  constructor(private actions$: Actions,
              private store: Store<State>,
              private storageRequestService: StorageRequestService) { }

}
