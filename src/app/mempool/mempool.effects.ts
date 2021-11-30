import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, Subject, timer } from 'rxjs';
import { State } from '@app/app.reducers';
import { MempoolService } from '@mempool/mempool.service';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MEMPOOL_ENDORSEMENTS_INIT,
  MempoolEndorsementsInit
} from '@mempool/mempool.action';


const mempoolEndorsementsDestroy$ = new Subject<void>();

@Injectable({ providedIn: 'root' })
export class MempoolEffects {

  mempoolEndorsementInit$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENTS_INIT),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(mempoolEndorsementsDestroy$),
        map(() => ({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES }))
      )
    )
  ));

  mempoolEndorsementLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_LOAD),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.mempoolService.getEndorsements(state.networkStats.lastAppliedBlock.hash, state.networkStats.downloadedBlocks)),
    map((endorsements: MempoolEndorsement[]) => ({ type: MEMPOOL_ENDORSEMENT_LOAD_SUCCESS, payload: { endorsements } }))
  ));

  mempoolEndorsementUpdateStatuses$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_UPDATE_STATUSES),
    withLatestFrom(this.store, (action: MempoolEndorsementsInit, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => !state.mempool.isLoadingNewBlock),
    mergeMap(() => this.mempoolService.getEndorsementStatusUpdates()),
    map((payload: MempoolEndorsement[]) => ({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS, payload })),
  ));

  mempoolEndorsementClose$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_STOP),
    tap(() => mempoolEndorsementsDestroy$.next(null))
  ), { dispatch: false });

  constructor(private mempoolService: MempoolService,
              private actions$: Actions,
              private store: Store<State>) { }

}
