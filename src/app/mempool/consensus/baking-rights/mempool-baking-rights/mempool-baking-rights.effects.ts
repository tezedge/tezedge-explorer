import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTezedgeState, State } from '@app/app.index';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import { MempoolBakingRightsService } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.service';
import {
  MEMPOOL_BAKING_RIGHTS_INIT,
  MEMPOOL_BAKING_RIGHTS_LOAD,
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsActions,
  MempoolBakingRightsLoad
} from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MempoolService } from '@mempool/mempool.service';
import { TezedgeBaseEffect } from '@shared/types/shared/store/tezedge-base.effect';
import { Effect, NonDispatchableEffect } from '@shared/types/shared/store/effect.type';


@Injectable({
  providedIn: 'root'
})
export class MempoolBakingRightsEffects extends TezedgeBaseEffect<State, MempoolBakingRightsActions> {

  readonly mempoolBakingRightsInit$: Effect;
  readonly mempoolBakingRightsLoad$: Effect;
  readonly mempoolBakingRightsClose$: NonDispatchableEffect;

  private stopUpdating: boolean = false;
  private mempoolBakingRightsSubject = new Subject<void>();

  constructor(private mempoolBakingRightsService: MempoolBakingRightsService,
              private mempoolService: MempoolService,
              private actions$: Actions,
              store: Store<State>) {

    super(store, selectTezedgeState);

    this.mempoolBakingRightsInit$ = createEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_BAKING_RIGHTS_INIT),
      switchMap(() =>
        timer(0, 1000).pipe(
          takeUntil(this.mempoolBakingRightsSubject),
          filter(() => !this.stopUpdating),
          map(() => ({ type: MEMPOOL_BAKING_RIGHTS_LOAD }))
        )
      )
    ));

    this.mempoolBakingRightsLoad$ = createEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_BAKING_RIGHTS_LOAD),
      this.latestActionState<MempoolBakingRightsLoad>(),
      filter(({ action, state }) => state.mempool.bakingRightsState.activeBlockLevel > 0),
      switchMap(({ action, state }) =>
        forkJoin([
          this.mempoolBakingRightsService.getBakingRights(this.http(state), state.mempool.bakingRightsState.activeBlockLevel),
          this.mempoolService.getBlockRounds(this.http(state), state.mempool.bakingRightsState.activeBlockLevel)
        ])
      ),
      map((response: [MempoolBakingRight[], MempoolBlockRound[]]) => ({
        type: MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
        payload: { bakingRights: response[0], rounds: response[1] }
      })),
      catchError(error => [
        {
          type: ADD_ERROR,
          payload: { title: 'Error when loading mempool baking rights: ', message: error.message, initiator: MEMPOOL_BAKING_RIGHTS_LOAD }
        },
        { type: MEMPOOL_BAKING_RIGHTS_STOP }
      ])
    ));

    this.mempoolBakingRightsClose$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(MEMPOOL_BAKING_RIGHTS_STOP),
      tap(() => this.mempoolBakingRightsSubject.next(null))
    ));

    // mempoolBakingRightsLive$ = createNonDispatchableEffect(() => this.actions$.pipe(
    //   ofType(MEMPOOL_BAKING_RIGHTS_LIVE),
    //   tap(() => this.stopUpdating = false)
    // ));
    //
    // mempoolBakingRightsPause$ = createNonDispatchableEffect(() => this.actions$.pipe(
    //   ofType(MEMPOOL_BAKING_RIGHTS_PAUSE),
    //   tap(() => this.stopUpdating = true)
    // ));

  }
}
