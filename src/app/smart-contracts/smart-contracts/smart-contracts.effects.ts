import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf } from 'rxjs';
import { State } from '@app/app.reducers';
import { SmartContractsService } from '@smart-contracts/smart-contracts/smart-contracts.service';

@Injectable({ providedIn: 'root' })
export class SmartContractsEffects {

  // smartContractsLoad$ = createEffect(() => this.actions$.pipe(
  //   ofType('SMART_CONTRACTS_LOAD'),
  //   withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
  //   switchMap(({ action, state }) => {
  //     return null;
  //   }),
  //   map((payload) => ({ type: 'SMART_CONTRACTS_LOAD_SUCCESS', payload: { payload } })),
  // ));
  //
  // constructor(private smartContractsService: SmartContractsService,
  //             private actions$: Actions,
  //             private store: Store<State>) { }

}
