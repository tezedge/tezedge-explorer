import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { empty, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '@app/app.index';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import { MempoolService } from '@mempool/mempool.service';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import {
  MEMPOOL_PREENDORSEMENT_INIT,
  MEMPOOL_PREENDORSEMENT_LOAD,
  MEMPOOL_PREENDORSEMENT_LOAD_ROUND,
  MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS,
  MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_PREENDORSEMENT_STOP,
  MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES,
  MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MempoolPreEndorsementLoad,
  MempoolPreEndorsementLoadRound,
  MempoolPreEndorsementStop,
  MempoolPreEndorsementUpdateStatuses
} from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.actions';
import { MempoolPreEndorsementService } from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.service';
import { MempoolPreEndorsement } from '@shared/types/mempool/preendorsement/mempool-preendorsement.type';

const mempoolPreEndorsementsDestroy$ = new Subject<void>();

@Injectable({ providedIn: 'root' })
export class MempoolPreEndorsementEffects {

  mempoolPreEndorsementInit$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_PREENDORSEMENT_INIT),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(mempoolPreEndorsementsDestroy$),
        map(() => ({ type: MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES }))
      )
    )
  ));

  mempoolPreEndorsementLoadRounds$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_PREENDORSEMENT_INIT),
    switchMap(() =>
      timer(0, 3000).pipe(
        takeUntil(mempoolPreEndorsementsDestroy$),
        map(() => ({ type: MEMPOOL_PREENDORSEMENT_LOAD_ROUND }))
      )
    )
  ));

  mempoolPreEndorsementRoundsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_PREENDORSEMENT_LOAD_ROUND, MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS),
    withLatestFrom(this.store, (action: MempoolPreEndorsementLoadRound, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.networkStats.lastAppliedBlock?.level > 0),
    switchMap(({ action, state }) => this.mempoolService.getBlockRounds(state.settingsNode.activeNode.http, state.networkStats.lastAppliedBlock.level)),
    map((rounds: MempoolBlockRound[]) => ({ type: MEMPOOL_PREENDORSEMENT_LOAD_ROUND_SUCCESS, payload: { rounds } })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading blocks rounds: ', message: error.message }
    }))
  ));

  mempoolPreEndorsementLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_PREENDORSEMENT_LOAD, MEMPOOL_PREENDORSEMENT_STOP),
    withLatestFrom(this.store, (action: MempoolPreEndorsementLoad | MempoolPreEndorsementStop, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.networkStats.lastAppliedBlock?.level > 0),
    switchMap(({ action, state }) => {
      if (action.type === MEMPOOL_PREENDORSEMENT_STOP) {
        return empty();
      }
      const lastAppliedBlock = state.networkStats.lastAppliedBlock;
      return this.preEndorsementService.getPreEndorsingRights(state.settingsNode.activeNode.http, lastAppliedBlock?.hash, lastAppliedBlock.level);
    }),
    map((endorsements: MempoolPreEndorsement[]) => ({ type: MEMPOOL_PREENDORSEMENT_LOAD_SUCCESS, payload: { endorsements } })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool preendorsements: ', message: error.message, initiator: MEMPOOL_PREENDORSEMENT_LOAD }
    }))
  ));

  mempoolPreEndorsementUpdateStatuses$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES),
    withLatestFrom(this.store, (action: MempoolPreEndorsementUpdateStatuses, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => !state.mempool.preendorsementState.isLoadingNewBlock && !!state.mempool.preendorsementState.currentRound),
    mergeMap(({ action, state }) => {
      const currentRound = state.mempool.preendorsementState.currentRound;
      return this.preEndorsementService.getPreEndorsementStatusUpdates(state.settingsNode.activeNode.http, currentRound);
    }),
    map((payload: { [slot: number]: MempoolPreEndorsement }) => ({ type: MEMPOOL_PREENDORSEMENT_UPDATE_STATUSES_SUCCESS, payload })),
  ));

  mempoolPreEndorsementClose$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_PREENDORSEMENT_STOP),
    tap(() => mempoolPreEndorsementsDestroy$.next(null))
  ), { dispatch: false });

  constructor(private preEndorsementService: MempoolPreEndorsementService,
              private mempoolService: MempoolService,
              private store: Store<State>,
              private actions$: Actions) { }

}
