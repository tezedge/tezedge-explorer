import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, ObservedValueOf, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { StorageResourcesActionTypes } from './storage-resources.actions';
import { State } from '../../app.reducers';
import { StorageResourceService } from './storage-resource.service';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';

@Injectable({ providedIn: 'root' })
export class StorageResourcesEffects {

  @Effect()
  ResourcesCheckAvailableContextsEffect$ = this.actions$.pipe(
    ofType(StorageResourcesActionTypes.CHECK_AVAILABLE_CONTEXTS),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      forkJoin(
        action.payload.map((context: string) => this.storageResourcesService.checkStorageResourcesContext(state.settingsNode.activeNode.http, context))
      ).pipe(
        map((result: any[]) => result.map((contextResponse, index: number) => contextResponse.operationsContext.length ? action.payload[index] : null).filter(Boolean))
      )
    ),
    switchMap(availableContexts => [
      { type: StorageResourcesActionTypes.LOAD_RESOURCES, payload: availableContexts[0] },
      { type: StorageResourcesActionTypes.MAP_AVAILABLE_CONTEXTS, payload: availableContexts }
    ])
  );

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(StorageResourcesActionTypes.LOAD_RESOURCES),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.storageResourcesService.getStorageResources(state.settingsNode.activeNode.http, action.payload)
        .pipe(
          map((stats: StorageResourcesStats) => ({ type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS, payload: stats })),
          catchError(error => of({ type: StorageResourcesActionTypes.RESOURCES_LOAD_ERROR, payload: error }))
        ))
  );

  constructor(private storageResourcesService: StorageResourceService,
              private actions$: Actions,
              private store: Store<any>) { }
}
