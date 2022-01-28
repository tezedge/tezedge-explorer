import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { empty, ObservedValueOf, of } from 'rxjs';
import { State } from '@app/app.reducers';
import { ADD_ERROR } from '@shared/components/error-popup/error-popup.actions';
import { MempoolBlockApplicationService } from '@mempool/mempool-block-application/mempool-block-application.service';
import {
  MEMPOOL_BLOCK_APPLICATION_LOAD,
  MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS,
  MEMPOOL_BLOCK_APPLICATION_STOP,
  MempoolBlockApplicationLoad,
  MempoolBlockApplicationStop
} from '@mempool/mempool-block-application/mempool-block-application.actions';
import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';

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
    map((chartLines: MempoolBlockApplicationChartLine[]) => ({ type: MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS, payload: { chartLines } })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool block application: ', message: error.message, initiator: MEMPOOL_BLOCK_APPLICATION_LOAD }
    }))
  ));

  constructor(private mempoolBlockApplicationService: MempoolBlockApplicationService,
              private actions$: Actions,
              private store: Store<State>) { }

}
