import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, empty, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '@app/app.index';
import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_ROUND,
  MEMPOOL_ENDORSEMENT_LOAD_ROUND_SUCCESS,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MEMPOOL_ENDORSEMENTS_INIT,
  MempoolEndorsementLoad,
  MempoolEndorsementLoadRound,
  MempoolEndorsementLoadRoundSuccess,
  MempoolEndorsementStop,
  MempoolEndorsementUpdateStatuses
} from '@mempool/endorsements/mempool-endorsement/mempool-endorsement.actions';
import { MempoolEndorsementService } from '@mempool/endorsements/mempool-endorsement/mempool-endorsement.service';
import { MempoolService } from '@mempool/mempool.service';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';

const mempoolEndorsementsDestroy$ = new Subject<void>();

@Injectable({ providedIn: 'root' })
export class MempoolEndorsementEffects {

  mempoolEndorsementInit$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENTS_INIT),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(mempoolEndorsementsDestroy$),
        map(() => ({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES }))
      )
    )
  ));

  mempoolEndorsementLoadRounds$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENTS_INIT),
    switchMap(() =>
      timer(0, 3000).pipe(
        takeUntil(mempoolEndorsementsDestroy$),
        map(() => ({ type: MEMPOOL_ENDORSEMENT_LOAD_ROUND }))
      )
    )
  ));

  mempoolRoundsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_LOAD_ROUND),
    withLatestFrom(this.store, (action: MempoolEndorsementLoadRound, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.mempool.endorsementState.currentBlockLevel > 0),
    switchMap(({ action, state }) => {
      const endorsementState = state.mempool.endorsementState;
      return this.mempoolService.getBlockRounds(state.settingsNode.activeNode.http, endorsementState.currentBlockLevel).pipe(
        map((rounds: MempoolBlockRound[]) => ({
          type: MEMPOOL_ENDORSEMENT_LOAD_ROUND_SUCCESS,
          payload: { rounds, loadEndorsements: endorsementState.currentRound?.blockHash !== rounds[rounds.length - 1]?.blockHash }
        }))
      );
    }),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading blocks rounds: ', message: error.message }
    }))
  ));

  mempoolRoundsLoadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_LOAD_ROUND_SUCCESS),
    withLatestFrom(this.store, (action: MempoolEndorsementLoadRoundSuccess, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const currentRound = state.mempool.endorsementState.currentRound;
      if (!currentRound || !action.payload.loadEndorsements) {
        return EMPTY;
      }
      return of({ type: MEMPOOL_ENDORSEMENT_LOAD, payload: { hash: currentRound.blockHash, level: currentRound.blockLevel } });
    }),
  ));

  mempoolEndorsementLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_LOAD, MEMPOOL_ENDORSEMENT_STOP),
    withLatestFrom(this.store, (action: MempoolEndorsementLoad | MempoolEndorsementStop, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      if (action.type === MEMPOOL_ENDORSEMENT_STOP) {
        return empty();
      }
      return this.mempoolEndorsementService.getEndorsingRights(state.settingsNode.activeNode.http, action.payload.hash, action.payload.level);
    }),
    map((endorsements: MempoolEndorsement[]) => ({ type: MEMPOOL_ENDORSEMENT_LOAD_SUCCESS, payload: { endorsements } })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool endorsements: ', message: error.message, initiator: MEMPOOL_ENDORSEMENT_LOAD }
    }))
  ));

  mempoolEndorsementUpdateStatuses$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_UPDATE_STATUSES),
    withLatestFrom(this.store, (action: MempoolEndorsementUpdateStatuses, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => !state.mempool.endorsementState.isLoadingNewBlock),
    mergeMap(({ action, state }) => {
      const currentRound = state.mempool.endorsementState.currentRound;
      return this.mempoolEndorsementService.getEndorsementStatusUpdates(state.settingsNode.activeNode.http, currentRound);
    }),
    map((payload: { [slot: number]: MempoolEndorsement }) => ({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS, payload })),
  ));

  mempoolEndorsementClose$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_STOP),
    tap(() => mempoolEndorsementsDestroy$.next(null))
  ), { dispatch: false });

  constructor(private mempoolEndorsementService: MempoolEndorsementService,
              private mempoolService: MempoolService,
              private actions$: Actions,
              private store: Store<State>) { }

}
