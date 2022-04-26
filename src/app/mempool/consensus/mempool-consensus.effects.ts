import { Injectable } from '@angular/core';
import { TezedgeBaseEffect } from '@shared/types/shared/store/tezedge-base.effect';
import { selectTezedgeState, State } from '@app/app.index';
import {
  MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS,
  MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD,
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_INIT,
  MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS,
  MEMPOOL_CONSENSUS_STOP,
  MempoolConsensusActions,
  MempoolConsensusCheckNewRounds,
  MempoolConsensusConstantsLoad,
  MempoolConsensusGetBlockRounds
} from '@mempool/consensus/mempool-consensus.actions';
import { Effect, NonDispatchableEffect } from '@shared/types/shared/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MempoolConsensusService } from '@mempool/consensus/mempool-consensus.service';
import { mergeMap, Observable, Subject, timer } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MempoolService } from '@mempool/mempool.service';
import { MempoolConstants } from '@shared/types/mempool/common/mempool-constants.type';
import { addError, createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';
import { http } from '@helpers/object.helper';

@Injectable({
  providedIn: 'root'
})
export class MempoolConsensusEffects extends TezedgeBaseEffect<State, MempoolConsensusActions> {

  readonly getBlocks$: Effect;
  readonly constantsLoad$: Effect;
  readonly init$: Effect;
  readonly checkNewRounds$: Effect;
  readonly startSearchingRounds$: NonDispatchableEffect;
  readonly consensusClose$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private checkRounds: boolean = true;

  constructor(private actions$: Actions,
              private mempoolConsensusService: MempoolConsensusService,
              private mempoolService: MempoolService,
              store: Store<State>) {

    super(store, selectTezedgeState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_INIT),
      switchMap(() =>
        timer(500, 750).pipe(
          takeUntil(this.destroy$),
          filter(() => this.checkRounds),
          map(() => ({ type: MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS }))
        )
      )
    ));

    this.constantsLoad$ = createEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_CONSTANTS_LOAD),
      this.latestActionState<MempoolConsensusConstantsLoad>(),
      switchMap(({ state }) => this.mempoolService.getMempoolConstants(http(state))),
      map((payload: MempoolConstants) => ({ type: MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS, payload })),
      catchError(error => addError('Error when loading protocol constants: ', error))
    ));

    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS),
      this.latestActionState<MempoolConsensusGetBlockRounds>(),
      tap(() => this.checkRounds = false),
      mergeMap(({ action, state }) => this.mempoolService.getBlockRounds(http(state), action.payload.blockLevel)),
      map((rounds: MempoolConsensusRound[]) => ({ type: MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS, payload: { rounds } }))
    ));

    this.startSearchingRounds$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS),
      tap(() => this.checkRounds = true),
    ));

    this.checkNewRounds$ = createEffect((): Observable<any> => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS),
      this.latestActionState<MempoolConsensusCheckNewRounds>(),
      filter(({ state, action }) => state.mempool.consensusState.blockToRecheck > 0),
      mergeMap(({ state, action }) => {
        const consensusState = state.mempool.consensusState;
        return this.mempoolService.getBlockRounds(http(state), consensusState.blockToRecheck).pipe(
          map((rounds: MempoolConsensusRound[]) => {
            const foundNewRound: boolean = consensusState.rounds.length === rounds.length;
            const blockChangedMeanwhile = consensusState.lastAppliedBlock !== consensusState.blockToRecheck;
            if (blockChangedMeanwhile || !foundNewRound) {
              this.checkRounds = false;
              return null;
            }
            return ({ type: MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS, payload: { rounds } });
          })
        );
      }),
      filter(Boolean)
    ));

    this.consensusClose$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_STOP),
      tap(() => {
        this.checkRounds = false;
        this.destroy$.next(void 0);
      }),
    ));
  }
}
