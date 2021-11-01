import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf } from 'rxjs';
import { State } from '@app/app.reducers';
import { SmartContractsService } from '@smart-contracts/smart-contracts/smart-contracts.service';

@Injectable({ providedIn: 'root' })
export class SmartContractsEffects {

  smartContractsLoad$ = createEffect(() => this.actions$.pipe(
    ofType('SM_C_LOAD'),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      return null;
    }),
    map((logs) => ({ type: 'SM_C_LOAD_SUCCESS', payload: { logs } })),
  ));

  constructor(private smartContractsService: SmartContractsService,
              private actions$: Actions,
              private store: Store<State>) { }

}
