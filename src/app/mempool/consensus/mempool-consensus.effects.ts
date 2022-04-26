import { Injectable } from '@angular/core';
import { TezedgeBaseEffect } from '@shared/types/shared/store/tezedge-base.effect';
import { selectTezedgeState, State } from '@app/app.index';
import {
  MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS, MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD,
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS,
  MEMPOOL_CONSENSUS_INIT, MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS,
  MEMPOOL_CONSENSUS_STOP,
  MempoolConsensusActions, MempoolConsensusCheckNewRounds,
  MempoolConsensusConstantsLoad,
  MempoolConsensusGetBlockRounds
} from '@mempool/consensus/mempool-consensus.actions';
import { Effect, NonDispatchableEffect } from '@shared/types/shared/store/effect.type';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MempoolConsensusService } from '@mempool/consensus/mempool-consensus.service';
import { EMPTY, mergeMap, Observable, Subject, timer } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MempoolService } from '@mempool/mempool.service';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { MempoolConsensusBlock } from '@shared/types/mempool/consensus/mempool-consensus-block.type';
import { MempoolConstants } from '@shared/types/mempool/common/mempool-constants.type';
import { addError, createNonDispatchableEffect } from '@shared/constants/store-functions';

@Injectable({
  providedIn: 'root'
})
export class MempoolConsensusEffects extends TezedgeBaseEffect<State, MempoolConsensusActions> {

  readonly getBlocks$: Effect;
  readonly constantsLoad$: Effect;
  readonly init$: Effect;
  readonly CHECK_NEW_ROUNDS: Effect;
  readonly startSearchingRounds$: NonDispatchableEffect;
  readonly consensusClose$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private checkRounds: boolean = true;

  constructor(private actions$: Actions,
              private mempoolConsensusService: MempoolConsensusService,
              private mempoolService: MempoolService,
              store: Store<State>) {
    super(store, selectTezedgeState);

    this.getBlocks$ = createEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS),
      this.latestActionState<MempoolConsensusGetBlockRounds>(),
      mergeMap(({ action, state }) => {
        this.checkRounds = false;
        return this.mempoolService.getBlockRounds(this.http(state), action.payload.blockLevel).pipe(
          map((rounds: MempoolBlockRound[]) => ({
            level: action.payload.blockLevel,
            rounds,
            activeRoundIndex: rounds.length - 1
          } as MempoolConsensusBlock))
        );
      }),
      map((payload: MempoolConsensusBlock) => ({ type: MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS_SUCCESS, payload }))
    ));

    this.constantsLoad$ = createEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_CONSTANTS_LOAD),
      this.latestActionState<MempoolConsensusConstantsLoad>(),
      switchMap(({ state }) => this.mempoolService.getMempoolConstants(this.http(state))),
      map((payload: MempoolConstants) => ({ type: MEMPOOL_CONSENSUS_CONSTANTS_LOAD_SUCCESS, payload })),
      catchError(error => addError('Error when loading protocol constants: ', error))
    ));

    this.startSearchingRounds$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS),
      tap(() => this.checkRounds = true),
    ));

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

    this.CHECK_NEW_ROUNDS = createEffect((): Observable<any> => this.actions$.pipe(
      ofType(MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS),
      this.latestActionState<MempoolConsensusCheckNewRounds>(),
      filter(({ state, action }) => state.mempool.consensusState.blockToRecheck > 0),
      mergeMap(({ state, action }) => {
        return this.mempoolService.getBlockRounds(this.http(state), state.mempool.consensusState.blockToRecheck).pipe(
          map((rounds: MempoolBlockRound[]) => ({
            level: state.mempool.consensusState.blockToRecheck,
            rounds,
            activeRoundIndex: rounds.length - 1
          } as MempoolConsensusBlock)),
          map((response: MempoolConsensusBlock) => {
            if (state.mempool.consensusState.lastAppliedBlock !== state.mempool.consensusState.blockToRecheck) {
              this.checkRounds = false;
              return null;
            }
            const foundNewRound: boolean = state.mempool.consensusState.activeBlock.rounds.length !== response.rounds.length;
            if (foundNewRound) {
              this.checkRounds = false;
              return ({ type: MEMPOOL_CONSENSUS_CHECK_NEW_ROUNDS_SUCCESS, payload: response });
            }
            return null;
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
