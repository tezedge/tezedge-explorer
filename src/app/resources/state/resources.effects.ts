import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { of, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { ResourcesActionTypes } from './resources.actions';
import { ResourcesService } from '../services/resources.service';
import { Resource } from '../models/resource';

@Injectable({ providedIn: 'root' })
export class ResourcesEffects {

  private resourcesDestroy$ = new Subject();

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(ResourcesActionTypes.LoadResources),
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),
    switchMap(({ action, state }) => {
      this.resourcesDestroy$ = new Subject();

      return timer(0, 30000).pipe(
        takeUntil(this.resourcesDestroy$),
        switchMap(() => {
          return this.resourcesService.getResources(state.settingsNode.api.monitoring)
            .pipe(
              map((resources: Resource[]) => ({ type: ResourcesActionTypes.ResourcesLoadSuccess, payload: resources })),
              catchError(error => of({ type: ResourcesActionTypes.ResourcesLoadError, payload: error }))
            );
        })
      );
    })
  );

  @Effect({ dispatch: false })
  MonitoringCloseEffect$ = this.actions$.pipe(
    ofType(ResourcesActionTypes.ResourcesClose),
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),
    tap(({ action, state }) => {
      this.resourcesDestroy$.next();
      this.resourcesDestroy$.complete();
    })
  );

  constructor(private resourcesService: ResourcesService,
              private actions$: Actions,
              private store: Store<any>) { }
}
