import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { ADD_ERROR } from '@shared/components/error-popup/error-popup.actions';
import { MempoolBakingRightsService } from '@mempool/mempool-baking-rights/mempool-baking-rights.service';
import {
  MEMPOOL_BAKING_RIGHTS_INIT,
  MEMPOOL_BAKING_RIGHTS_LOAD,
  MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsLoad
} from '@mempool/mempool-baking-rights/mempool-baking-rights.actions';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';

const mempoolBakingRightsSubject = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class MempoolBakingRightsEffects {

  mempoolBakingRightsInit$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_INIT),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(mempoolBakingRightsSubject),
        map(() => ({ type: MEMPOOL_BAKING_RIGHTS_LOAD }))
      )
    )
  ));

  mempoolBakingRightsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_LOAD),
    withLatestFrom(this.store, (action: MempoolBakingRightsLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.networkStats.lastAppliedBlock.level > 0),
    switchMap(({ action, state }) =>
      this.mempoolBakingRightsService.getBakingRights(state.settingsNode.activeNode.http, state.networkStats.lastAppliedBlock.level)
    ),
    map((payload: Partial<MempoolBakingRightsState>) => ({ type: MEMPOOL_BAKING_RIGHTS_LOAD_SUCCESS, payload })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool baking rights: ', message: error.message, initiator: MEMPOOL_BAKING_RIGHTS_LOAD }
    }))
  ));

  mempoolBakingRightsClose$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_BAKING_RIGHTS_STOP),
    tap(() => mempoolBakingRightsSubject.next(null))
  ), { dispatch: false });


  constructor(private mempoolBakingRightsService: MempoolBakingRightsService,
              private actions$: Actions,
              private store: Store<State>) { }

}
