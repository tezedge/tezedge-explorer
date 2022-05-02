import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, ObservedValueOf, of, OperatorFunction } from 'rxjs';
import { Selector } from '@ngrx/store/src/models';
import { withLatestFrom } from 'rxjs/operators';
import { ADD_ERROR, ErrorAdd } from '@app/layout/error-popup/error-popup.actions';

export const createNonDispatchableEffect = (source: () => any) => createEffect(source, { dispatch: false });

export const selectActionState = <S, A>(store: Store<S>, selector: Selector<S, any>): OperatorFunction<A, { action: A; state: S; }> =>
  withLatestFrom(
    store.select<S>(selector),
    (action: A, state: ObservedValueOf<Store<S>>): { action: A, state: S } => ({ action, state })
  );

export const addError = (title: string, error: any, initiator?: string): Observable<ErrorAdd> => of({
  type: ADD_ERROR,
  payload: { title, message: error.message, initiator }
});
