import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { MemoryResourcesActionTypes } from './memory-resources.actions';
import { MemoryResourcesService } from './memory-resources.service';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';

@Injectable({ providedIn: 'root' })
export class MemoryResourcesEffects {

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(MemoryResourcesActionTypes.LoadResources),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.resourcesService.getStorageResources(state.settingsNode.memoryProfiler, action.payload.reversed)
        .pipe(
          map((resource: MemoryResource) => ({
            type: MemoryResourcesActionTypes.ResourcesLoadSuccess,
            payload: resource
          })),
          catchError(error => of({ type: MemoryResourcesActionTypes.ResourcesLoadError, payload: error }))
        )
    )
  );

  constructor(private resourcesService: MemoryResourcesService,
              private actions$: Actions,
              private store: Store<any>) { }
}
