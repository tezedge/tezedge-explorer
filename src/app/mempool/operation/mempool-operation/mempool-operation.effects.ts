import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of } from 'rxjs';
import { State } from '@app/app.index';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import { MEMPOOL_OPERATION_LOAD, MEMPOOL_OPERATION_LOAD_SUCCESS, MempoolOperationLoad } from '@mempool/operation/mempool-operation/mempool-operation.actions';
import { MempoolOperationService } from '@mempool/operation/mempool-operation/mempool-operation.service';

@Injectable({ providedIn: 'root' })
export class MempoolOperationEffects {

  mempoolOperationLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_OPERATION_LOAD),
    withLatestFrom(this.store, (action: MempoolOperationLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.mempoolOperationService.getOperations(state.settingsNode.activeNode.http)),
    map((payload) => ({ type: MEMPOOL_OPERATION_LOAD_SUCCESS, payload })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool operations: ', message: error.message, initiator: MEMPOOL_OPERATION_LOAD }
    }))
  ));

  constructor(private mempoolOperationService: MempoolOperationService,
              private actions$: Actions,
              private store: Store<State>) { }

}
