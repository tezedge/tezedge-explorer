import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { empty, ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '@app/app.reducers';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { ADD_ERROR } from '@shared/components/error-popup/error-popup.actions';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_LOAD_SUCCESS,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS,
  MEMPOOL_ENDORSEMENTS_INIT,
  MempoolEndorsementLoad,
  MempoolEndorsementStop,
  MempoolEndorsementUpdateStatuses
} from '@mempool/mempool-endorsement/mempool-endorsement.actions';
import { MempoolEndorsementService } from '@mempool/mempool-endorsement/mempool-endorsement.service';

const mempoolEndorsementsDestroy$ = new Subject<void>();

@Injectable({ providedIn: 'root' })
export class MempoolEndorsementEffects {

  stopUpdating: boolean = true;

  mempoolEndorsementInit$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENTS_INIT),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(mempoolEndorsementsDestroy$),
        filter(() => !this.stopUpdating),
        map(() => ({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES }))
      )
    )
  ));

  mempoolEndorsementLoad$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_LOAD, MEMPOOL_ENDORSEMENT_STOP),
    withLatestFrom(this.store, (action: MempoolEndorsementLoad | MempoolEndorsementStop, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      if (action.type === MEMPOOL_ENDORSEMENT_STOP) {
        return empty();
      }
      this.stopUpdating = true;
      return this.mempoolEndorsementService
        .getEndorsements(state.settingsNode.activeNode.http, state.networkStats.lastAppliedBlock.hash, state.networkStats.lastAppliedBlock.level);
    }),
    map((endorsements: MempoolEndorsement[]) => {
      this.stopUpdating = false;
      return ({ type: MEMPOOL_ENDORSEMENT_LOAD_SUCCESS, payload: { endorsements } });
    }),
    catchError(error => of({
      type: ADD_ERROR,
      payload: { title: 'Error when loading mempool endorsements: ', message: error.message, initiator: MEMPOOL_ENDORSEMENT_LOAD }
    }))
  ));

  mempoolEndorsementUpdateStatuses$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_UPDATE_STATUSES),
    withLatestFrom(this.store, (action: MempoolEndorsementUpdateStatuses, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => !state.mempool.endorsementState.isLoadingNewBlock),
    mergeMap(({ action, state }) => {
      return this.mempoolEndorsementService.getEndorsementStatusUpdates(state.settingsNode.activeNode.http);
    }),
    map((payload: { [slot: number]: MempoolEndorsement }) => ({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES_SUCCESS, payload })),
  ));

  mempoolEndorsementClose$ = createEffect(() => this.actions$.pipe(
    ofType(MEMPOOL_ENDORSEMENT_STOP),
    tap(() => mempoolEndorsementsDestroy$.next(null))
  ), { dispatch: false });

  constructor(private mempoolEndorsementService: MempoolEndorsementService,
              private actions$: Actions,
              private store: Store<State>) { }

}
