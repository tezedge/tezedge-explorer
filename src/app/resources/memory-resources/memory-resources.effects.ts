import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, ObservedValueOf, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MemoryResourcesActionTypes } from './memory-resources.actions';
import { MemoryResourcesService } from './memory-resources.service';
import { MemoryResource } from '@shared/types/resources/memory/memory-resource.type';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';

@Injectable({ providedIn: 'root' })
export class MemoryResourcesEffects {

  resourcesLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD, MemoryResourcesActionTypes.MEMORY_RESOURCES_CLOSE),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      action.type === MemoryResourcesActionTypes.MEMORY_RESOURCES_CLOSE
        ? EMPTY
        : this.resourcesService.getStorageResources(
          state.settingsNode.activeNode.features.find(f => f.name === 'resources/memory').memoryProfilerUrl,
          action.payload.reversed
        ).pipe(
          map((resource: MemoryResource) => ({
            type: MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS,
            payload: resource
          })),
          catchError(error => of({
            type: ADD_ERROR,
            payload: { title: 'Memory resources error', message: error.message, initiator: MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD }
          }))
        )
    )
  ));

  constructor(private resourcesService: MemoryResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }
}
