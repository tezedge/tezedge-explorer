import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { ADD_ERROR, ErrorAdd } from '@app/layout/error-popup/error-popup.actions';
import { MempoolBakingRightsService } from '@mempool/baking-rights/mempool-baking-rights/mempool-baking-rights.service';
import {
  MEMPOOL_BAKING_RIGHTS_CONSTANTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_INIT,
  MEMPOOL_BAKING_RIGHTS_LIVE,
  MEMPOOL_BAKING_RIGHTS_LOAD,
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_PAUSE,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsConstantsLoad,
  MempoolBakingRightsLoad
} from '@mempool/baking-rights/mempool-baking-rights/mempool-baking-rights.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { MempoolBakingRightsConstants } from '@shared/types/mempool/baking-rights/mempool-baking-rights-constants.type';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';
import { MempoolService } from '@mempool/mempool.service';

const mempoolBakingRightsSubject = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class MempoolBakingRightsEffects {

  private stopUpdating: boolean = false;

  mempoolBakingRightsInit$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_INIT),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(mempoolBakingRightsSubject),
        filter(() => !this.stopUpdating),
        map(() => ({ type: MEMPOOL_BAKING_RIGHTS_LOAD }))
      )
    )
  ));

  mempoolBakingRightsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_LOAD),
    withLatestFrom(this.store, (action: MempoolBakingRightsLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.mempool.bakingRightsState.currentDisplayedBlock > 0),
    switchMap(({ action, state }) =>
      forkJoin(
        this.mempoolBakingRightsService.getBakingRights(state.settingsNode.activeNode.http, state.mempool.bakingRightsState.currentDisplayedBlock),
        this.mempoolService.getBlockRounds(state.settingsNode.activeNode.http, state.mempool.bakingRightsState.currentDisplayedBlock)
      )
    ),
    map((response: [MempoolBakingRight[], MempoolBlockRound[]]) => ({
      type: MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
      payload: { bakingRights: response[0], bakingDetails: response[1] }
    })),
    catchError(error => [
      {
        type: ADD_ERROR,
        payload: { title: 'Error when loading mempool baking rights: ', message: error.message, initiator: MEMPOOL_BAKING_RIGHTS_LOAD }
      },
      { type: MEMPOOL_BAKING_RIGHTS_STOP }
    ])
  ));

  mempoolBakingRightsConstantsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_INIT),
    withLatestFrom(this.store, (action: MempoolBakingRightsConstantsLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.mempoolBakingRightsService.getMempoolConstants(state.settingsNode.activeNode.http)),
    map((payload: MempoolBakingRightsConstants) => ({ type: MEMPOOL_BAKING_RIGHTS_CONSTANTS_LOAD_SUCCESS, payload })),
    catchError(error => this.addError('Error when loading protocol constants: ', error))
  ));

  mempoolBakingRightsLive$ = createNonDispatchableEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_LIVE),
    tap(() => this.stopUpdating = false)
  ));

  mempoolBakingRightsPause$ = createNonDispatchableEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_PAUSE),
    tap(() => this.stopUpdating = true)
  ));

  mempoolBakingRightsClose$ = createNonDispatchableEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_STOP),
    tap(() => mempoolBakingRightsSubject.next(null))
  ));


  constructor(private mempoolBakingRightsService: MempoolBakingRightsService,
              private mempoolService: MempoolService,
              private store: Store<State>,
              private actions$: Actions) { }

  private addError(title: string, error: any, initiator?: string): Observable<ErrorAdd> {
    return of({
      type: ADD_ERROR,
      payload: { title, message: error.message, initiator }
    });
  }

}
