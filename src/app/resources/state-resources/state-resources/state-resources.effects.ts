import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, repeat, switchMap, withLatestFrom } from 'rxjs/operators';
import { empty, Observable, ObservedValueOf, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { ADD_ERROR, ErrorAdd } from '@app/layout/error-popup/error-popup.actions';
import {
  STATE_RESOURCES_CLOSE,
  STATE_RESOURCES_LOAD,
  STATE_RESOURCES_LOAD_SUCCESS,
  StateResourcesClose,
  StateResourcesLoad
} from '@resources/state-resources/state-resources/state-resources.actions';
import { StateResourcesService } from '@resources/state-resources/state-resources/state-resources.service';
import { StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';


@Injectable({ providedIn: 'root' })
export class StateResourcesEffects {

  stateResourcesLoad$ = createEffect(() => this.actions$.pipe(
    ofType(STATE_RESOURCES_LOAD, STATE_RESOURCES_CLOSE),
    withLatestFrom(this.store, (action: StateResourcesLoad | StateResourcesClose, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return action.type === STATE_RESOURCES_CLOSE
        ? empty()
        : this.stateResourcesService.getStateResources(state.settingsNode.activeNode.http)
          .pipe(
            map((stats: StateResourcesActionGroup[]) => ({ type: STATE_RESOURCES_LOAD_SUCCESS, payload: stats })),
            catchError(err => throwError(err))
          );
    }),
    catchError(err => this.catchError(err)),
    repeat()
  ));

  constructor(private stateResourcesService: StateResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }

  catchError = (error): Observable<ErrorAdd> => of({
    type: ADD_ERROR,
    payload: { title: 'State resources error', message: error.message, initiator: STATE_RESOURCES_LOAD }
  });

}
