import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { State } from '@app/app.index';
import { SmartContractsService } from '@smart-contracts/smart-contracts/smart-contracts.service';
import {
  SMART_CONTRACTS_DEBUG_STEP,
  SMART_CONTRACTS_EXECUTE_CONTRACT,
  SMART_CONTRACTS_EXECUTE_CONTRACT_SUCCESS,
  SMART_CONTRACTS_LOAD,
  SMART_CONTRACTS_LOAD_SUCCESS,
  SMART_CONTRACTS_RESET_BLOCKS,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS,
  SMART_CONTRACTS_START_DEBUGGING,
  SMART_CONTRACTS_STOP,
  SMART_CONTRACTS_TRACE_DIFFS_LOAD_SUCCESS,
  SmartContractsExecuteContractAction,
  SmartContractsLoadAction,
  SmartContractsLoadSuccessAction,
  SmartContractsSetActiveContractAction,
  SmartContractsStopAction,
  SmartContractsStopDebuggingAction
} from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { EMPTY, ObservedValueOf } from 'rxjs';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';

@Injectable({ providedIn: 'root' })
export class SmartContractsEffects {

  smartContractsResetBlocks$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_RESET_BLOCKS),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    map(({ action, state }) => ({
      type: SMART_CONTRACTS_LOAD,
      payload: { blockHash: state.smartContracts.blockHashContext.hashes[state.smartContracts.blockHashContext.activeIndex] }
    }))
  ));

  smartContractsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_LOAD, SMART_CONTRACTS_STOP),
    withLatestFrom(this.store, (action: SmartContractsLoadAction | SmartContractsStopAction, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) =>
      action.type === SMART_CONTRACTS_STOP
        ? EMPTY
        : this.smartContractsService.getContracts(state.settingsNode.activeNode.http, action.payload.blockHash)
    ),
    map((payload: { contracts: Partial<SmartContract>[], previousBlockHash: string }) => ({
      type: SMART_CONTRACTS_LOAD_SUCCESS,
      payload: { contracts: payload.contracts, previousBlockHash: payload.previousBlockHash }
    }))
  ));

  smartContractsLoadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_LOAD_SUCCESS),
    withLatestFrom(this.store, (action: SmartContractsLoadSuccessAction, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    mergeMap(({ action, state }: { action: any, state: State }) =>
      action.payload.contracts.map(contract => ({ contract, state }))
    ),
    mergeMap(({ contract, state }) => {
      const previousBlockHash = state.smartContracts.blockHashContext.hashes[state.smartContracts.blockHashContext.activeIndex - 1];
      return this.smartContractsService.getContractsDetails(state.settingsNode.activeNode.http, contract, previousBlockHash);
    }),
    map((contract: SmartContract) => ({
      type: SMART_CONTRACTS_TRACE_DIFFS_LOAD_SUCCESS,
      payload: { contract }
    }))
  ));

  smartContractsSetActiveContract$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_SET_ACTIVE_CONTRACT),
    withLatestFrom(this.store, (action: SmartContractsSetActiveContractAction, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    filter(({ action, state }) => state.monitoring.networkStats.lastAppliedBlock.level > 0),
    switchMap(({ action, state }) => {
      const previousBlockHash = state.smartContracts.blockHashContext.hashes[state.smartContracts.blockHashContext.activeIndex - 1];
      return this.smartContractsService.getContractCode(state.settingsNode.activeNode.http, previousBlockHash, action.payload).pipe(
        switchMap((contract: SmartContract) =>
          this.smartContractsService.getContractTrace(state.settingsNode.activeNode.http, previousBlockHash, contract).pipe(
            map((execution) => ({ contract, execution }))
          )
        )
      );
    }),
    map((payload: { contract: SmartContract, execution: { trace: SmartContractTrace[], gasTrace: number[], result: SmartContractResult } }) => ({
      type: SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS,
      payload: { contract: payload.contract, execution: payload.execution }
    }))
  ));

  smartContractsGetTrace$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_EXECUTE_CONTRACT),
    withLatestFrom(this.store, (action: SmartContractsExecuteContractAction, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const previousBlockHash = state.smartContracts.blockHashContext.hashes[state.smartContracts.blockHashContext.activeIndex - 1];
      return this.smartContractsService.getContractTrace(state.settingsNode.activeNode.http, previousBlockHash, action.payload);
    }),
    map((payload: { trace: SmartContractTrace[], gasTrace: number[], result: SmartContractResult }) => ({
      type: SMART_CONTRACTS_EXECUTE_CONTRACT_SUCCESS,
      payload
    }))
  ));

  smartContractsStartDebugging$ = createEffect(() => this.actions$.pipe(
    ofType(SMART_CONTRACTS_START_DEBUGGING),
    withLatestFrom(this.store, (action: SmartContractsStopDebuggingAction, state: ObservedValueOf<Store<State>>) => state),
    map((state: State) => ({ type: SMART_CONTRACTS_DEBUG_STEP, payload: state.smartContracts.trace[0] }))
  ));

  constructor(private actions$: Actions,
              private store: Store<State>,
              private smartContractsService: SmartContractsService) { }

}
