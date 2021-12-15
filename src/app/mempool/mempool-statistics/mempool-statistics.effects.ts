import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of } from 'rxjs';
import { State } from '@app/app.reducers';
import { ADD_ERROR } from '@shared/error-popup/error-popup.actions';
import { MEMPOOL_STATISTICS_LOAD, MEMPOOL_STATISTICS_LOAD_SUCCESS, MempoolStatisticsLoad } from '@mempool/mempool-statistics/mempool-statistics.action';
import { MempoolStatisticsService } from '@mempool/mempool-statistics/mempool-statistics.service';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';

@Injectable({ providedIn: 'root' })
export class MempoolStatisticsEffects {

  mempoolStatisticsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_STATISTICS_LOAD),
    withLatestFrom(this.store, (action: MempoolStatisticsLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    mergeMap(({ action, state }) => this.mempoolStatisticsService.getOperationNodeStats(state.settingsNode.activeNode.http)),
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
