import { Injectable } from '@angular/core';
import { TezedgeBaseEffect } from '@shared/types/shared/store/tezedge-base.effect';
import { selectTezedgeState, State } from '@app/app.index';
import { Effect, NonDispatchableEffect } from '@shared/types/shared/store/effect.type';
import { forkJoin, mergeMap, of, Subject, timer } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, repeat, switchMap, takeUntil, tap } from 'rxjs/operators';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';
import {
  BAKING_ADD_DISTRIBUTED_REWARD,
  BAKING_GET_BAKERS,
  BAKING_GET_BAKERS_SUCCESS,
  BAKING_GET_CYCLE,
  BAKING_GET_CYCLE_SUCCESS,
  BAKING_GET_DELEGATORS,
  BAKING_GET_DELEGATORS_SUCCESS,
  BAKING_GET_TRANSACTION_STATUSES,
  BAKING_INIT,
  BAKING_LEDGER_CONNECTED,
  BAKING_SET_ACTIVE_BAKER,
  BAKING_STOP,
  BAKING_STOP_GETTING_TRANSACTION_STATUSES,
  BAKING_UPDATE_TRANSACTION_STATUSES,
  BakingActions,
  BakingAddDistributedReward,
  BakingGetBakers,
  BakingGetCycle,
  BakingGetDelegators,
  BakingGetDelegatorsSuccess,
  BakingGetTransactionStatuses,
  BakingLedgerConnected,
  BakingSetActiveBaker,
  BakingStopGettingTransactionStatuses,
} from '@baking/baking.actions';
import { BakingService } from '@baking/baking.service';
import { BakingBaker } from '@shared/types/bakings/baking-baker.type';
import { MempoolOperationService } from '@mempool/operation/mempool-operation/mempool-operation.service';
import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';
import { http } from '@helpers/object.helper';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BakingEffects extends TezedgeBaseEffect<State, BakingActions> {

  readonly init$: Effect;
  readonly init2$: Effect;
  readonly getCycle$: Effect;
  readonly getBakers$: Effect;
  readonly getDelegators$: Effect;
  readonly setActiveBaker$: Effect;
  readonly onLedgerConnect$: NonDispatchableEffect;
  readonly getDelegatorsSuccess$: NonDispatchableEffect;
  readonly getTransactionStatuses$: Effect;
  readonly paymentComplete$: Effect;
  readonly stopGettingTransactionStatuses$: Effect;
  readonly close$: NonDispatchableEffect;

  private destroy$: Subject<void> = new Subject<void>();
  private updateTransactions: boolean = false;

  constructor(private router: Router,
              private actions$: Actions,
              private bakingService: BakingService,
              private mempoolOperationService: MempoolOperationService,
              store: Store<State>) {

    super(store, selectTezedgeState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_INIT),
      switchMap(() =>
        timer(0, 10000).pipe(
          takeUntil(this.destroy$),
          map(() => ({ type: BAKING_GET_CYCLE }))
        )
      )
    ));

    this.init2$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_INIT),
      switchMap(() =>
        timer(0, 7500).pipe(
          takeUntil(this.destroy$),
          filter(() => this.updateTransactions),
          map(() => ({ type: BAKING_GET_TRANSACTION_STATUSES }))
        )
      )
    ));

    this.getCycle$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_GET_CYCLE),
      this.latestActionState<BakingGetCycle>(),
      mergeMap(({ state }) => this.bakingService.getBlockCycle(http(state)).pipe(
        mergeMap(cycle => [
          { type: BAKING_GET_CYCLE_SUCCESS, payload: { cycle } },
          state.baking.cycle !== cycle ? { type: BAKING_GET_BAKERS, payload: { cycle } } : null
        ])
      )),
      filter(Boolean)
    ));

    this.getTransactionStatuses$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_GET_TRANSACTION_STATUSES),
      this.latestActionState<BakingGetTransactionStatuses>(),
      mergeMap(({ action, state }) => {
        const activeBakerHash = state.baking.activeBaker.hash;

        const mempoolOperations$ = this.mempoolOperationService.getOperations(http(state)).pipe(
          map(operations => [
            ...operations.applied
              .reduce((acc, curr) => [...acc, ...curr.contents], []),
            ...operations.branch_refused
              .reduce((acc, curr) => [...acc, ...curr[1].contents], []),
            ...operations.branch_delayed
              .reduce((acc, curr) => [...acc, ...curr[1].contents], []),
            ...operations.refused
              .reduce((acc, curr) => [...acc, ...curr[1].contents], []),
          ]
            .filter(content => content.destination && content.source && content.source === activeBakerHash)
            .map(content => ({
              source: content.source,
              destination: content.destination,
              status: 'pending'
            })))
        );

        const operationsStats$ = this.bakingService.getOperationsStats(state.settingsNode.activeNode.tzstats, state.baking.cycle + 1).pipe(
          map(response =>
            response
              .filter(item => item[2] === activeBakerHash)
              .map(item => ({
                source: item[2],
                destination: item[3],
                status: item[0],
                operation: item[1]
              })))
        );

        return forkJoin([mempoolOperations$, operationsStats$]).pipe(
          map((operations: [
            { source: string, destination: string, status: string, operation: string }[],
            { source: string, destination: string, status: string, operation: string }[]
          ]) => [...operations[0], ...operations[1]])
        );
      }),
      map((updates: { source: string, destination: string, status: string, operation: string }[]) => ({
        type: BAKING_UPDATE_TRANSACTION_STATUSES,
        payload: updates
      }))
    ));

    this.getBakers$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_GET_BAKERS),
      this.latestActionState<BakingGetBakers>(),
      mergeMap(({ action, state }) => this.bakingService.getBakers(http(state), action.payload.cycle).pipe(
        mergeMap((bakers: BakingBaker[]) => {
          const actions: BakingActions[] = [{ type: BAKING_GET_BAKERS_SUCCESS, payload: { bakers } }];
          if (state.baking.activeBakerHash) {
            actions.push({
              type: BAKING_GET_DELEGATORS,
              payload: { cycle: action.payload.cycle, bakerHash: state.baking.activeBakerHash }
            });
          }

          return actions;
        })
      )),
    ));

    this.getDelegators$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_GET_DELEGATORS),
      this.latestActionState<BakingGetDelegators>(),
      filter(({ action, state }) => !!state.baking.cycle),
      mergeMap(({ action, state }) => {
        const cycle = action.payload.cycle;
        const bakerHash = action.payload.bakerHash;
        return this.bakingService.getDelegators(http(state), cycle, bakerHash);
      }),
      map((payload: BakingDelegator[]) => ({ type: BAKING_GET_DELEGATORS_SUCCESS, payload })),
      catchError((err) => of({
        type: ADD_ERROR,
        payload: { title: 'Get baker error:', message: err.message, initiator: BAKING_GET_DELEGATORS }
      })),
      repeat()
    ));

    this.setActiveBaker$ = createEffect(() => this.actions$.pipe(
      ofType(BAKING_SET_ACTIVE_BAKER),
      this.latestActionState<BakingSetActiveBaker>(),
      filter(({ action }) => !!action.payload.hash),
      map(({ action, state }) => ({
        type: BAKING_GET_DELEGATORS,
        payload: { cycle: state.baking.cycle, bakerHash: action.payload.hash }
      }))
    ));

    this.getDelegatorsSuccess$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(BAKING_GET_DELEGATORS_SUCCESS),
      this.latestActionState<BakingGetDelegatorsSuccess>(),
      filter(({ state }) => !!state.baking.ledger?.publicKeyHash),
      tap(({ state }) => this.updateTransactions = !!state.baking.activeBaker),
    ));

    this.onLedgerConnect$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(BAKING_LEDGER_CONNECTED),
      this.latestActionState<BakingLedgerConnected>(),
      tap(({ state }) => this.updateTransactions = !!state.baking.activeBaker),
      tap(({ action, state }) => this.router.navigate(['rewards', action.payload.ledger.publicKeyHash]))
    ));

    this.paymentComplete$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(BAKING_ADD_DISTRIBUTED_REWARD),
      this.latestActionState<BakingAddDistributedReward>(),
      tap(({ state }) => this.updateTransactions = true),
    ));

    this.stopGettingTransactionStatuses$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(BAKING_STOP_GETTING_TRANSACTION_STATUSES),
      this.latestActionState<BakingStopGettingTransactionStatuses>(),
      tap(({ state }) => this.updateTransactions = false),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(BAKING_STOP),
      tap(() => this.destroy$.next(void 0)),
    ));
  }
}
