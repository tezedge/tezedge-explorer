import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { ResourcesActionTypes } from './resources.actions';
import { ResourcesService } from './resources.service';
import { Resource } from '../../shared/types/resources/resource.type';
import { State } from '../../app.reducers';

@Injectable({ providedIn: 'root' })
export class ResourcesEffects {

  private resourcesDestroy$ = new Subject<void>();

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(ResourcesActionTypes.LoadResources),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const resourcesData$ = this.resourcesService.getResources(state.settingsNode.activeNode.monitoring)
        .pipe(
          map((resources: Resource[]) => ({ type: ResourcesActionTypes.ResourcesLoadSuccess, payload: resources })),
          catchError(error => of({ type: ResourcesActionTypes.ResourcesLoadError, payload: error }))
        );

      if (action.payload && action.payload.initialLoad) {
        return resourcesData$;
      }

      this.resourcesDestroy$ = new Subject<void>();

      return timer(0, 120000)
        .pipe(
          takeUntil(this.resourcesDestroy$),
          switchMap(() => resourcesData$)
        );
    })
  );

  @Effect({ dispatch: false })
  ResourcesCloseEffect$ = this.actions$.pipe(
    ofType(ResourcesActionTypes.ResourcesClose),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      this.resourcesDestroy$.next();
      this.resourcesDestroy$.complete();
    })
  );

  constructor(private resourcesService: ResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }
}
