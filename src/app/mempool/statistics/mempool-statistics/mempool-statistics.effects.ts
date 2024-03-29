import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, ObservedValueOf, of } from 'rxjs';
import { State } from '@app/app.index';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import {
  MEMPOOL_STATISTICS_LOAD,
  MEMPOOL_STATISTICS_LOAD_SUCCESS,
  MEMPOOL_STATISTICS_STOP,
  MempoolStatisticsLoad,
  MempoolStatisticsStop
} from '@mempool/statistics/mempool-statistics/mempool-statistics.actions';
import { MempoolStatisticsService } from '@mempool/statistics/mempool-statistics/mempool-statistics.service';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';

@Injectable({ providedIn: 'root' })
export class MempoolStatisticsEffects {

  mempoolStatisticsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_STATISTICS_LOAD, MEMPOOL_STATISTICS_STOP),
    withLatestFrom(this.store, (action: MempoolStatisticsLoad | MempoolStatisticsStop, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      action.type === MEMPOOL_STATISTICS_STOP
        ? EMPTY
        : this.mempoolStatisticsService.getOperationNodeStats(state.settingsNode.activeNode.http, action.payload.operationHash)
    ),
    map((operations: MempoolStatisticsOperation[]) => ({ type: MEMPOOL_STATISTICS_LOAD_SUCCESS, payload: operations })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool statistics: ', message: error.message, initiator: MEMPOOL_STATISTICS_LOAD }
    }))
  ));

  constructor(private mempoolStatisticsService: MempoolStatisticsService,
              private actions$: Actions,
              private store: Store<State>) { }

}
