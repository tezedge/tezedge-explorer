import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { empty, ObservedValueOf, of } from 'rxjs';
import { State } from '@app/app.reducers';
import { ADD_ERROR } from '@shared/error-popup/error-popup.actions';
import { MempoolBlockApplicationService } from '@mempool/mempool-block-application/mempool-block-application.service';
import { MempoolBlockApplication } from '@shared/types/mempool/block-application/mempool-block-application.type';
import {
  MEMPOOL_BLOCK_APPLICATION_LOAD,
  MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS,
  MEMPOOL_BLOCK_APPLICATION_STOP
} from '@mempool/mempool-block-application/mempool-block-application.actions';

@Injectable({ providedIn: 'root' })
export class MempoolBlockApplicationEffects {

  mempoolBlockApplicationLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BLOCK_APPLICATION_LOAD, MEMPOOL_BLOCK_APPLICATION_STOP),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      action.type === MEMPOOL_BLOCK_APPLICATION_STOP
        ? empty()
        : this.mempoolBlockApplicationService.getBlockApplication(state.settingsNode.activeNode.http)
    ),
    map((blocks: MempoolBlockApplication[]) => ({ type: MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS, payload: { blocks } })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool block application: ', message: error.message, initiator: MEMPOOL_BLOCK_APPLICATION_LOAD }
    }))
  ));

  constructor(private mempoolBlockApplicationService: MempoolBlockApplicationService,
              private actions$: Actions,
              private store: Store<State>) { }

}
