import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { StateMachineActionTypes } from './state-machine.actions';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
import { StateMachineService } from './state-machine.service';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { ErrorActionTypes } from '@shared/error-popup/error-popup.actions';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineActionStatistics } from '@shared/types/state-machine/state-machine-action-statistics.type';

@Injectable({ providedIn: 'root' })
export class StateMachineEffects {

  private playSubject$ = new Subject<void>();
  private stateMachineDestroy$ = new Subject<void>();

  stateMachineDiagramLoad$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.stateMachineService.getStateMachineDiagram().pipe(takeUntil(this.stateMachineDestroy$))),
    map((payload: StateMachineDiagramBlock[]) => ({ type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS, payload })),
  ));

  stateMachineActionStatisticsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD),
    withLatestFrom(this.store, (action, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.stateMachineService.getStateMachineActionStatistics()),
    map((payload: StateMachineActionStatistics) => ({ type: StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD_SUCCESS, payload })),
  ));

  stateMachineActionsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD),
    withLatestFrom(this.store, (action, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      timer(0, 30000).pipe(
        takeUntil(this.stateMachineDestroy$),
        switchMap(() =>
          this.stateMachineService.getStateMachineActions(state.stateMachine.actionTable.filter).pipe(
            map((payload: StateMachineAction[]) => ({ type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD_SUCCESS, payload })),
            catchError(error => this.onError(error, 'Actions'))
          )
        )
      )
    )
  ));

  stateMachineActionsFilter$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.stateMachineService.getStateMachineActions(state.stateMachine.actionTable.filter).pipe(
        map((payload: StateMachineAction[]) => ({ type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD_SUCCESS, payload })),
        catchError(error => this.onError(error, 'Actions'))
      )
    )
  ));

  stateMachineActionsStopLoad$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_ACTIONS_STOP_STEAM),
    tap(() => this.stateMachineDestroy$.next(null)),
  ), { dispatch: false });

  stateMachinePlay$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_START_PLAYING),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      this.playSubject$ = new Subject<void>();
      let currentPosition = state.stateMachine.activeAction?.id || 0;
      const initialPlayingActionId = currentPosition + 1;

      return timer(0, 1500)
        .pipe(
          takeUntil(this.playSubject$),
          map(() => {
            currentPosition++;
            const actionEntity = state.stateMachine.actionTable.entities[currentPosition];
            return actionEntity ? { action: actionEntity, autoScroll: initialPlayingActionId === currentPosition ? 'any' : 'down' } : undefined;
          })
        );
    }),
    map(payload => (
      payload
        ? { type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION, payload }
        : { type: StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING }
    ))
  ));

  stateMachinePausePlaying$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING),
    tap(() => this.playSubject$.next(null))
  ), { dispatch: false });

  stateMachineClose$ = createEffect(() => this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_CLOSE),
    tap(() => {
      this.playSubject$.next(null);
      this.stateMachineDestroy$.next(null);
    })
  ), { dispatch: false });

  constructor(private actions$: Actions,
              private store: Store<State>,
              private stateMachineService: StateMachineService) { }

  private onError = (error, type: string) => of({
    type: ErrorActionTypes.ADD_ERROR,
    payload: { title: `Error when loading ${type}:`, message: error.message }
  });
}
