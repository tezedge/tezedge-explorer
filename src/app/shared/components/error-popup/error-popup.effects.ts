import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { delay, ObservedValueOf, of } from 'rxjs';
import { ADD_ERROR, ADD_INFO, ErrorAdd, InfoAdd, REMOVE_ERROR, REMOVE_INFO } from './error-popup.actions';
import { NotifierService } from 'angular-notifier';
import { State } from '@app/app.reducers';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ErrorPopupEffects {

  clearPopupsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ADD_ERROR, ADD_INFO),
    withLatestFrom(this.store, (action: ErrorAdd | InfoAdd, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    mergeMap(({ action, state }) =>
      of({ type: action.type === ADD_ERROR ? REMOVE_ERROR : REMOVE_INFO })
        .pipe(delay(2500), tap(() => this.notifierService.hideOldest()))
    )
  ));

  constructor(private actions$: Actions,
              private notifierService: NotifierService,
              private store: Store<State>) { }
}
