import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf } from 'rxjs';
import { State } from '@app/app.reducers';
import { MempoolOperationLoad } from '@mempool/mempool-operation/mempool-operation.actions';
import { MEMPOOL_BROADCAST_LOAD, MEMPOOL_BROADCAST_LOAD_SUCCESS } from '@mempool/mempool-broadcast/mempool-broadcast.actions';
import { MempoolBroadcastService } from '@mempool/mempool-broadcast/mempool-broadcast.service';

@Injectable({ providedIn: 'root' })
export class MempoolBroadcastEffects {

  mempoolBroadcastLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BROADCAST_LOAD),
    withLatestFrom(this.store, (action: MempoolOperationLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.mempoolBroadcastService.getOperations(state.settingsNode.activeNode.http)),
    map((payload) => ({ type: MEMPOOL_BROADCAST_LOAD_SUCCESS, payload })),
    // catchError(error => of({
    //   type: ADD_ERROR,
    //   payload: { title: 'Error when loading mempool broadcast: ', message: error.message, initiator: MEMPOOL_BROADCAST_LOAD }
    // }))
  ));

  constructor(private mempoolBroadcastService: MempoolBroadcastService,
              private actions$: Actions,
              private store: Store<State>) { }

}
