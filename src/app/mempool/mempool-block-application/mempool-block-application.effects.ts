import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, repeat, switchMap, withLatestFrom } from 'rxjs/operators';
import { empty, ObservedValueOf, of } from 'rxjs';
import { State } from '@app/app.index';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import { MempoolBlockApplicationService } from '@mempool/mempool-block-application/mempool-block-application.service';
import {
  MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD,
  MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD_SUCCESS,
  MEMPOOL_BLOCK_APPLICATION_LOAD,
  MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS,
  MEMPOOL_BLOCK_APPLICATION_STOP,
  MempoolBlockApplicationDetailsLoad,
  MempoolBlockApplicationDetailsLoadSuccess,
  MempoolBlockApplicationLoad,
  MempoolBlockApplicationStop
} from '@mempool/mempool-block-application/mempool-block-application.actions';
import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { MempoolBakingRightsService } from '@mempool/mempool-baking-rights/mempool-baking-rights.service';

@Injectable({ providedIn: 'root' })
export class MempoolBlockApplicationEffects {

  mempoolBlockApplicationLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BLOCK_APPLICATION_LOAD, MEMPOOL_BLOCK_APPLICATION_STOP),
    withLatestFrom(this.store, (action: MempoolBlockApplicationLoad | MempoolBlockApplicationStop, state: ObservedValueOf<Store<State>>) => ({
      action,
      state
    })),
    switchMap(({ action, state }) =>
      action.type === MEMPOOL_BLOCK_APPLICATION_STOP
        ? empty()
        : this.mempoolBlockApplicationService.getBlockApplication(state.settingsNode.activeNode.http)
    ),
    map((payload: { chartLines: MempoolBlockApplicationChartLine[], markIndexes: number[] }) => ({ type: MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS, payload })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool block application: ', message: error.message, initiator: MEMPOOL_BLOCK_APPLICATION_LOAD }
    }))
  ));

  mempoolBakingRightsDetailsLoadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS),
    withLatestFrom(this.store, (action: MempoolBlockApplicationDetailsLoadSuccess, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.mempool.blockApplicationState.activeBlockLevel === null),
    switchMap(({ action, state }) => {
      const series = state.mempool.blockApplicationState.chartLines[0].series;
      return of({
        type: MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD,
        payload: { level: Number(series[series.length - 1].blockLevel), round: Number(series[series.length - 1].round) }
      });
    })
  ));

  mempoolBakingRightsDetailsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD),
    withLatestFrom(this.store, (action: MempoolBlockApplicationDetailsLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      this.mempoolBakingRightsService.getBakingRightDetails(state.settingsNode.activeNode.http, action.payload.level, action.payload.round)
    ),
    map((details: MempoolBlockRound[]) => ({ type: MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD_SUCCESS, payload: { details } })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading block details: ', message: error.message }
    })),
    repeat()
  ));

  constructor(private mempoolBlockApplicationService: MempoolBlockApplicationService,
              private mempoolBakingRightsService: MempoolBakingRightsService,
              private actions$: Actions,
              private store: Store<State>) { }

}
