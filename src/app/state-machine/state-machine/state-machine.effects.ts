import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StateMachineActionTypes } from './state-machine.actions';
import { map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, Subject, timer } from 'rxjs';
import { StateMachineService } from './state-machine.service';

@Injectable()
export class StateMachineEffects {

  private playSubject$ = new Subject<void>();

  @Effect()
  StateMachineDiagramLoad$ = this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.stateMachineService.getStateMachineDiagram();
    }),
    map((payload) => ({ type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD_SUCCESS, payload })),
  );

  @Effect()
  StateMachineProposalsLoad$ = this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return this.stateMachineService.getStateMachineProposals();
    }),
    map((payload) => ({ type: StateMachineActionTypes.STATE_MACHINE_PROPOSALS_LOAD_SUCCESS, payload })),
  );

  @Effect()
  StateMachinePlay$ = this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_START_PLAYING),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      this.playSubject$ = new Subject<void>();
      let currentPosition = state.stateMachine.activeProposalPosition;

      return timer(0, 1000)
        .pipe(
          takeUntil(this.playSubject$),
          map(() => {
            currentPosition++;
            return state.stateMachine.proposals[currentPosition];
          })
        );
    }),
    map(payload => (
      payload
        ? { type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_PROPOSAL, payload }
        : { type: StateMachineActionTypes.STATE_MACHINE_STOP_PLAYING }
    )),
  );

  @Effect({ dispatch: false })
  StateMachineStop$ = this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_STOP_PLAYING),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => this.playSubject$.next())
  );

  @Effect({ dispatch: false })
  StateMachineClose$ = this.actions$.pipe(
    ofType(StateMachineActionTypes.STATE_MACHINE_CLOSE),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      this.playSubject$.next();
      this.playSubject$.complete();
    })
  );

  constructor(private actions$: Actions,
              private store: Store<State>,
              private stateMachineService: StateMachineService) { }

}
