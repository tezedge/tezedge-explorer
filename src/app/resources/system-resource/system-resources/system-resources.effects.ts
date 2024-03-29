import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { SYSTEM_RESOURCES_CLOSE, SYSTEM_RESOURCES_LOAD, SYSTEM_RESOURCES_LOAD_SUCCESS } from './system-resources.actions';
import { SystemResourcesService } from './system-resources.service';
import { SystemResourcesState } from '@shared/types/resources/system/system-resources-state.type';
import { State } from '@app/app.index';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';

@Injectable({ providedIn: 'root' })
export class SystemResourcesEffects {

  private resourcesDestroy$ = new Subject<void>();

  resourcesLoadEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SYSTEM_RESOURCES_LOAD, SYSTEM_RESOURCES_CLOSE),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      if (action.type === SYSTEM_RESOURCES_CLOSE) {
        return EMPTY;
      }
      const url = state.settingsNode.activeNode.features
        .find(c => c.name === 'resources/system').monitoringUrl;
      const resourcesData$ = this.resourcesService.getSystemResources(url, action.payload.isSmallDevice)
        .pipe(
          map((resources: SystemResourcesState) => ({
            type: SYSTEM_RESOURCES_LOAD_SUCCESS,
            payload: resources
          })),
          catchError(error => of({
            type: ADD_ERROR,
            payload: { title: 'System resources error', message: error.message, initiator: SYSTEM_RESOURCES_LOAD }
          }))
        );

      if (action.payload && action.payload.initialLoad) {
        return resourcesData$;
      }

      this.resourcesDestroy$ = new Subject<void>();

      return timer(0, 60000)
        .pipe(
          takeUntil(this.resourcesDestroy$),
          switchMap(() => resourcesData$)
        );
    })
  ));

  resourcesCloseEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SYSTEM_RESOURCES_CLOSE),
    tap(() => {
      this.resourcesDestroy$.next(null);
      this.resourcesDestroy$.complete();
    })
  ), { dispatch: false });

  constructor(private resourcesService: SystemResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }
}
