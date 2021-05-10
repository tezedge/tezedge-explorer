import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { StorageResourcesActionTypes } from './resources-storage.actions';
import { State } from '../../app.reducers';
import { StorageResourceService } from './storage-resource.service';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';

@Injectable({ providedIn: 'root' })
export class StorageResourcesEffects {

  private resourcesDestroy$ = new Subject<void>();

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(StorageResourcesActionTypes.LoadResources),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.storageResourcesService.getStorageResources(state.settingsNode.activeNode.http)
        .pipe(
          map((stats: StorageResourcesStats) => ({ type: StorageResourcesActionTypes.ResourcesLoadSuccess, payload: stats })),
          catchError(error => of({ type: StorageResourcesActionTypes.ResourcesLoadError, payload: error }))
        ))
  );

  @Effect({ dispatch: false })
  ResourcesCloseEffect$ = this.actions$.pipe(
    ofType(StorageResourcesActionTypes.ResourcesClose),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      this.resourcesDestroy$.next();
      this.resourcesDestroy$.complete();
    })
  );

  constructor(private storageResourcesService: StorageResourceService,
              private actions$: Actions,
              private store: Store<any>) { }
}
