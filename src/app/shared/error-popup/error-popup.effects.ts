import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { delay, ObservedValueOf, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { ADD_ERROR, REMOVE_ERROR } from './error-popup.actions';
import { NotifierService } from 'angular-notifier';

@Injectable({ providedIn: 'root' })
export class ErrorPopupEffects {

  clearErrorsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ADD_ERROR),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      of({ type: REMOVE_ERROR })
        .pipe(delay(4000), tap(() => this.notifierService.hideOldest()))
    )
  ));

  constructor(private actions$: Actions,
              private notifierService: NotifierService,
              private store: Store<State>) { }
}
