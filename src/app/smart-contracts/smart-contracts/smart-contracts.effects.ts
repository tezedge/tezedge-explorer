import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { State } from '@app/app.reducers';
import { SmartContractsService } from '@smart-contracts/smart-contracts/smart-contracts.service';
import {
  SMART_CONTRACTS_LOAD,
  SMART_CONTRACTS_LOAD_SUCCESS,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS
} from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { ObservedValueOf } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SmartContractsEffects {

  smartContractsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_LOAD),
    switchMap(() => this.smartContractsService.getContracts()),
    map((contracts: SmartContract[]) => ({ type: SMART_CONTRACTS_LOAD_SUCCESS, payload: { contracts } })),
  ));

  smartContractsSetActiveContract$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_SET_ACTIVE_CONTRACT),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => this.smartContractsService.getContractTrace(action.payload)),
    map((trace: any) => ({ type: SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS, payload: trace })),
  ));

  constructor(private smartContractsService: SmartContractsService,
              private actions$: Actions,
              private store: Store<State>) { }

}
