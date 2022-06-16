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
  EMBEDDED_CHANGE_PAGE,
  EMBEDDED_CHANGE_STREAM,
  EMBEDDED_GET_STATE,
  EMBEDDED_GET_STATE_SUCCESS,
  EMBEDDED_INIT,
  EMBEDDED_STOP,
  EmbeddedActions, EmbeddedChangePage,
  EmbeddedChangeStream,
  EmbeddedGetState
} from '@app/embedded/embedded.actions';
import { EmbeddedService } from '@app/embedded/embedded.service';

@Injectable({
  providedIn: 'root'
})
export class EmbeddedEffects extends TezedgeBaseEffect<State, EmbeddedActions> {

  readonly init$: Effect;
  readonly getState$: Effect;
  readonly stream$: NonDispatchableEffect;
  readonly close$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private getState: boolean = true;

  constructor(private actions$: Actions,
              private embeddedService: EmbeddedService,
              store: Store<State>) {

    super(store, selectTezedgeState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(EMBEDDED_INIT),
      switchMap(() =>
        timer(0, 1000).pipe(
          takeUntil(this.destroy$),
          filter(() => this.getState),
          map(() => ({ type: EMBEDDED_GET_STATE }))
        )
      )
    ));

    this.getState$ = createEffect(() => this.actions$.pipe(
      ofType(EMBEDDED_GET_STATE),
      this.latestActionState<EmbeddedGetState>(),
      switchMap(({ action, state }) => this.embeddedService.getBakingState(http(state)).pipe(
        map(response => ({ response, state }))
      )),
      filter(({ response, state }) =>
        JSON.stringify(state.embedded.pages[state.embedded.activePageIndex]) !== JSON.stringify(response)
      ),
      map(({ response }) => ({ type: EMBEDDED_GET_STATE_SUCCESS, payload: { state: response } }))
    ));

    this.stream$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(EMBEDDED_CHANGE_STREAM, EMBEDDED_CHANGE_PAGE),
      this.latestActionState<EmbeddedChangeStream | EmbeddedChangePage>(),
      tap(({ action }) => this.getState = action.type === EMBEDDED_CHANGE_STREAM ? action.payload : false),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(EMBEDDED_STOP),
      tap(() => this.destroy$.next(void 0)),
    ));
  }
}
