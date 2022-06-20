import { Injectable } from '@angular/core';
import { TezedgeBaseEffect } from '@shared/types/shared/store/tezedge-base.effect';
import { selectTezedgeState, State } from '@app/app.index';
import { Effect, NonDispatchableEffect } from '@shared/types/shared/store/effect.type';
import { Subject, timer } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';
import { http } from '@helpers/object.helper';
import {
  BAKING_CHANGE_PAGE,
  BAKING_CHANGE_STREAM,
  BAKING_GET_STATE,
  BAKING_GET_STATE_SUCCESS,
  BAKING_INIT,
  BAKING_STOP,
  BakingActions,
  BakingChangePage,
  BakingChangeStream,
  BakingGetState
} from '@app/baking/baking.actions';
import { BakingService } from '@app/baking/baking.service';

@Injectable({
  providedIn: 'root'
})
export class BakingEffects extends TezedgeBaseEffect<State, BakingActions> {

  readonly init$: Effect;
  readonly getState$: Effect;
  readonly stream$: NonDispatchableEffect;
  readonly close$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private getState: boolean = true;

  constructor(private actions$: Actions,
              private bakingService: BakingService,
              store: Store<State>) {

    super(store, selectTezedgeState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_INIT),
      switchMap(() =>
        timer(0, 1000).pipe(
          takeUntil(this.destroy$),
          filter(() => this.getState),
          map(() => ({ type: BAKING_GET_STATE }))
        )
      )
    ));

    this.getState$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_GET_STATE),
      this.latestActionState<BakingGetState>(),
      switchMap(({ action, state }) => this.bakingService.getBakingState(http(state)).pipe(
        map(response => ({ response, state }))
      )),
      filter(({ response, state }) =>
        JSON.stringify(state.baking.pages[state.baking.activePageIndex]) !== JSON.stringify(response)
      ),
      map(({ response }) => ({ type: BAKING_GET_STATE_SUCCESS, payload: { state: response } }))
    ));

    this.stream$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(BAKING_CHANGE_STREAM, BAKING_CHANGE_PAGE),
      this.latestActionState<BakingChangeStream | BakingChangePage>(),
      tap(({ action }) => this.getState = action.type === BAKING_CHANGE_STREAM ? action.payload : false),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(BAKING_STOP),
      tap(() => this.destroy$.next(void 0)),
    ));
  }
}
