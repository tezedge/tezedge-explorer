import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, repeat, switchMap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, forkJoin, Observable, ObservedValueOf, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { CloseStorageResources, LoadStorageResources, MapAvailableContexts, StorageResourcesActionTypes } from './storage-resources.actions';
import { State } from '@app/app.index';
import { StorageResourcesService } from './storage-resources.service';
import { StorageResourcesStats } from '@shared/types/resources/storage/storage-resources-stats.type';
import { ADD_ERROR, ErrorAdd } from '@app/layout/error-popup/error-popup.actions';


@Injectable({ providedIn: 'root' })
export class StorageResourcesEffects {

  resourcesCheckAvailableContextsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(StorageResourcesActionTypes.STORAGE_RESOURCES_CHECK_AVAILABLE_CONTEXTS),
    withLatestFrom(this.store, (action: MapAvailableContexts, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      forkJoin(
        action.payload.map((context: string) => this.storageResourcesService.checkStorageResourcesContext(state.settingsNode.activeNode.http, context))
      ).pipe(
        map((result: any[]) => result.map((contextResponse, index: number) => contextResponse.operationsContext.length ? action.payload[index] : null).filter(Boolean))
      )
    ),
    switchMap(availableContexts => !availableContexts.length ? [] : [
      { type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD, payload: { context: availableContexts[0] } },
      { type: StorageResourcesActionTypes.STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS, payload: availableContexts }
    ]),
    catchError(err => this.catchStorageResourcesError(err)),
    repeat()
  ));

  resourcesLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD, StorageResourcesActionTypes.STORAGE_RESOURCES_CLOSE),
    withLatestFrom(this.store, (action: LoadStorageResources | CloseStorageResources, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return action.type === StorageResourcesActionTypes.STORAGE_RESOURCES_CLOSE
        ? EMPTY
        : this.storageResourcesService.getStorageResources(state.settingsNode.activeNode.http, action.payload as any)
          .pipe(
            map((stats: StorageResourcesStats) => ({ type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS, payload: stats })),
            catchError(err => throwError(err))
          );
    }),
    catchError(err => this.catchStorageResourcesError(err)),
    repeat()
  ));

  constructor(private storageResourcesService: StorageResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }

  catchStorageResourcesError = (error): Observable<ErrorAdd> => of({
    type: ADD_ERROR,
    payload: { title: 'Storage resources error', message: error.message, initiator: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD }
  });

}
