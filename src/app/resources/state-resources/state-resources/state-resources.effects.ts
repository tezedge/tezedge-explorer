import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, repeat, switchMap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, Observable, ObservedValueOf, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { ADD_ERROR, ErrorAdd } from '@app/layout/error-popup/error-popup.actions';
import {
  STATE_RESOURCES_CLOSE,
  STATE_RESOURCES_LOAD,
  STATE_RESOURCES_LOAD_BLOCKS,
  STATE_RESOURCES_LOAD_BLOCKS_SUCCESS,
  STATE_RESOURCES_LOAD_SUCCESS,
  StateResourcesClose,
  StateResourcesLoad,
  StateResourcesLoadBlocks
} from '@resources/state-resources/state-resources/state-resources.actions';
import { StateResourcesService } from '@resources/state-resources/state-resources/state-resources.service';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';
import { StateResourcesBlockData } from '@shared/types/resources/state/state-resources-block-data.type';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class StateResourcesEffects {

  stateResourcesLoad$ = createEffect(() => this.actions$.pipe(
    ofType(STATE_RESOURCES_LOAD, STATE_RESOURCES_CLOSE),
    withLatestFrom(this.store, (action: StateResourcesLoad | StateResourcesClose, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return action.type === STATE_RESOURCES_CLOSE
        ? EMPTY
        : this.stateResourcesService.getNodeLifetimeStateResources(state.settingsNode.activeNode.http)
          .pipe(
            map((stats: StateResourcesActionGroup[]) => ({ type: STATE_RESOURCES_LOAD_SUCCESS, payload: stats })),
            catchError(err => throwError(err))
          );
    }),
    catchError(err => this.catchError(err, STATE_RESOURCES_LOAD)),
    repeat()
  ));

  stateResourcesBlocksLoad$ = createEffect(() => this.actions$.pipe(
    ofType(STATE_RESOURCES_LOAD_BLOCKS, STATE_RESOURCES_CLOSE),
    withLatestFrom(this.store, (action: StateResourcesLoadBlocks | StateResourcesClose, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return action.type === STATE_RESOURCES_CLOSE
        ? EMPTY
        : this.stateResourcesService.getBlockStateResources(state.settingsNode.activeNode.http, action.payload.level)
          .pipe(
            map((blocks: StateResourcesBlockData[]) => ({
              type: STATE_RESOURCES_LOAD_BLOCKS_SUCCESS,
              payload: { blocks }
            })),
            catchError(err => throwError(err))
          );
    }),
    catchError(err => this.catchError(err, STATE_RESOURCES_LOAD_BLOCKS)),
    repeat()
  ));

  constructor(private stateResourcesService: StateResourcesService,
              private actions$: Actions,
              private router: Router,
              private store: Store<State>) { }

  catchError = (error, initiator: string): Observable<ErrorAdd> => of({
    type: ADD_ERROR,
    payload: { title: 'State resources error', message: error.message, initiator }
  });

}
