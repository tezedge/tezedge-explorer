import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
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
  MEMPOOL_OPERATION_LOAD,
  MEMPOOL_OPERATION_LOAD_SUCCESS,
  MempoolEndorsementUpdateStatuses,
  MempoolOperationLoad
} from '@mempool/mempool.action';
import { ADD_ERROR } from '@shared/error-popup/error-popup.actions';

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
    mergeMap(({ action, state }) =>
      this.mempoolService.getEndorsements(state.settingsNode.activeNode.http, state.networkStats.lastAppliedBlock.hash, state.networkStats.downloadedBlocks)
    ),
    map((endorsements: MempoolEndorsement[]) => ({ type: MEMPOOL_ENDORSEMENT_LOAD_SUCCESS, payload: { endorsements } })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool endorsements: ', message: error.message, initiator: MEMPOOL_ENDORSEMENT_LOAD }
    }))
  ));

  mempoolEndorsementUpdateStatuses$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_UPDATE_STATUSES),
    withLatestFrom(this.store, (action: MempoolEndorsementUpdateStatuses, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => !state.mempool.endorsementState.isLoadingNewBlock),
    mergeMap(({ action, state }) => this.mempoolService.getEndorsementStatusUpdates(state.settingsNode.activeNode.http)),
    map((payload: { [slot: number]: MempoolEndorsement }) => ({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS, payload })),
  ));

  mempoolEndorsementClose$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_STOP),
    tap(() => mempoolEndorsementsDestroy$.next(null))
  ), { dispatch: false });

  mempoolOperationLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_OPERATION_LOAD),
    withLatestFrom(this.store, (action: MempoolOperationLoad, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.mempoolService.getOperations(state.settingsNode.activeNode.http)),
    map((payload) => ({ type: MEMPOOL_OPERATION_LOAD_SUCCESS, payload })),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool operations: ', message: error.message, initiator: MEMPOOL_OPERATION_LOAD }
    }))
  ));


  constructor(private mempoolService: MempoolService,
              private actions$: Actions,
              private store: Store<State>) { }

}
