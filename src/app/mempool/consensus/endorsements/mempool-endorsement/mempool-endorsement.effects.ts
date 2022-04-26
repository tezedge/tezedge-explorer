import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { empty, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '@app/app.index';
import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MEMPOOL_ENDORSEMENTS_INIT,
  MempoolEndorsementLoad,
  MempoolEndorsementStop,
  MempoolEndorsementUpdateStatuses
} from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.actions';
import { MempoolEndorsementService } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.service';
import { MempoolService } from '@mempool/mempool.service';

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

  // mempoolEndorsementLoadRounds$ = createEffect(() => this.actions$.pipe(
  //   ofType(MEMPOOL_ENDORSEMENTS_INIT),
  //   switchMap(() =>
  //     timer(0, 3000).pipe(
  //       takeUntil(mempoolEndorsementsDestroy$),
  //       map(() => ({ type: MEMPOOL_ENDORSEMENT_LOAD_ROUND }))
  //     )
  //   )
  // ));

  // mempoolRoundsLoad$ = createEffect(() => this.actions$.pipe(
  //   ofType(MEMPOOL_ENDORSEMENT_LOAD_ROUND, MEMPOOL_ENDORSEMENT_LOAD_SUCCESS),
  //   withLatestFrom(this.store, (action: MempoolEndorsementLoadRound, state: ObservedValueOf<Store<State>>) => ({ action, state })),
  //   filter(({ action, state }) => state.networkStats.lastAppliedBlock?.level > 0),
  //   switchMap(({ action, state }) => this.mempoolService.getBlockRounds(state.settingsNode.activeNode.http, state.networkStats.lastAppliedBlock.level)),
  //   map((rounds: MempoolBlockRound[]) => ({ type: MEMPOOL_ENDORSEMENT_LOAD_ROUND_SUCCESS, payload: { rounds } })),
  //   catchError(error => of({
  //     type: ADD_ERROR,
  //     payload: { title: 'Error when loading block rounds: ', message: error.message }
  //   }))
  // ));

  mempoolEndorsementLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_LOAD, MEMPOOL_ENDORSEMENT_STOP),
    withLatestFrom(this.store, (action: MempoolEndorsementLoad | MempoolEndorsementStop, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const blockLevel = (action as MempoolEndorsementLoad).payload?.blockLevel;
      if (action.type === MEMPOOL_ENDORSEMENT_STOP || !blockLevel) {
        return empty();
      }
      return this.mempoolEndorsementService.getEndorsingRights(state.settingsNode.activeNode.http, blockLevel);
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
    filter(({ action, state }) => !state.mempool.endorsementState.isLoadingNewBlock && !!state.mempool.endorsementState.currentRound),
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
