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
  REWARDS_ADD_DISTRIBUTED_REWARD,
  REWARDS_GET_BAKERS,
  REWARDS_GET_BAKERS_SUCCESS,
  REWARDS_GET_CYCLE,
  REWARDS_GET_CYCLE_SUCCESS,
  REWARDS_GET_DELEGATORS,
  REWARDS_GET_DELEGATORS_SUCCESS,
  REWARDS_GET_TRANSACTION_STATUSES,
  REWARDS_INIT,
  REWARDS_LEDGER_CONNECTED,
  REWARDS_SET_ACTIVE_BAKER,
  REWARDS_STOP,
  REWARDS_STOP_GETTING_TRANSACTION_STATUSES,
  REWARDS_UPDATE_TRANSACTION_STATUSES,
  RewardsActions,
  RewardsAddDistributedReward,
  RewardsGetBakers,
  RewardsGetCycle,
  RewardsGetDelegators,
  RewardsGetDelegatorsSuccess,
  RewardsGetTransactionStatuses,
  RewardsLedgerConnected,
  RewardsSetActiveBaker,
  RewardsStopGettingTransactionStatuses,
} from '@rewards/rewards.actions';
import { RewardsService } from '@rewards/rewards.service';
import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';
import { MempoolOperationService } from '@mempool/operation/mempool-operation/mempool-operation.service';
import { RewardsDelegator } from '@shared/types/rewards/rewards-delegator.type';
import { http } from '@helpers/object.helper';
import { ADD_ERROR } from '@app/layout/error-popup/error-popup.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RewardsEffects extends TezedgeBaseEffect<State, RewardsActions> {

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
              private rewardsService: RewardsService,
              private mempoolOperationService: MempoolOperationService,
              store: Store<State>) {

    super(store, selectTezedgeState);

    this.init$ = createEffect(() => this.actions$.pipe(
      ofType(REWARDS_INIT),
      switchMap(() =>
        timer(0, 10000).pipe(
          takeUntil(this.destroy$),
          map(() => ({ type: REWARDS_GET_CYCLE }))
        )
      )
    ));

    this.init2$ = createEffect(() => this.actions$.pipe(
      ofType(REWARDS_INIT),
      switchMap(() =>
        timer(0, 7500).pipe(
          takeUntil(this.destroy$),
          filter(() => this.updateTransactions),
          map(() => ({ type: REWARDS_GET_TRANSACTION_STATUSES }))
        )
      )
    ));

    this.getCycle$ = createEffect(() => this.actions$.pipe(
      ofType(REWARDS_GET_CYCLE),
      this.latestActionState<RewardsGetCycle>(),
      mergeMap(({ state }) => this.rewardsService.getBlockCycle(http(state)).pipe(
        mergeMap(cycle => [
          { type: REWARDS_GET_CYCLE_SUCCESS, payload: { cycle } },
          state.rewards.cycle !== cycle ? { type: REWARDS_GET_BAKERS, payload: { cycle } } : null
        ])
      )),
      filter(Boolean)
    ));

    this.getTransactionStatuses$ = createEffect(() => this.actions$.pipe(
      ofType(REWARDS_GET_TRANSACTION_STATUSES),
      this.latestActionState<RewardsGetTransactionStatuses>(),
      mergeMap(({ action, state }) => {
        const activeBakerHash = state.rewards.activeBaker.hash;

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

        const operationsStats$ = this.rewardsService.getOperationsStats(state.settingsNode.activeNode.tzstats, state.rewards.cycle + 1).pipe(
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
        type: REWARDS_UPDATE_TRANSACTION_STATUSES,
        payload: updates
      }))
    ));

    this.getBakers$ = createEffect(() => this.actions$.pipe(
      ofType(REWARDS_GET_BAKERS),
      this.latestActionState<RewardsGetBakers>(),
      mergeMap(({ action, state }) => this.rewardsService.getBakersRewards(http(state), action.payload.cycle).pipe(
        mergeMap((bakers: RewardsBaker[]) => {
          const actions: RewardsActions[] = [{ type: REWARDS_GET_BAKERS_SUCCESS, payload: { bakers } }];
          if (state.rewards.activeBakerHash) {
            actions.push({
              type: REWARDS_GET_DELEGATORS,
              payload: { cycle: action.payload.cycle, bakerHash: state.rewards.activeBakerHash }
            });
          }

          return actions;
        })
      )),
    ));

    this.getDelegators$ = createEffect(() => this.actions$.pipe(
      ofType(REWARDS_GET_DELEGATORS),
      this.latestActionState<RewardsGetDelegators>(),
      filter(({ action, state }) => !!state.rewards.cycle),
      mergeMap(({ action, state }) => {
        const cycle = action.payload.cycle;
        const bakerHash = action.payload.bakerHash;
        return this.rewardsService.getDelegatorsRewards(http(state), cycle, bakerHash);
      }),
      map((payload: RewardsDelegator[]) => ({ type: REWARDS_GET_DELEGATORS_SUCCESS, payload })),
      catchError((err) => of({
        type: ADD_ERROR,
        payload: { title: 'Error while getting rewards for the baker:', message: err.message, initiator: REWARDS_GET_DELEGATORS }
      })),
      repeat()
    ));

    this.setActiveBaker$ = createEffect(() => this.actions$.pipe(
      ofType(REWARDS_SET_ACTIVE_BAKER),
      this.latestActionState<RewardsSetActiveBaker>(),
      filter(({ action }) => !!action.payload.hash),
      map(({ action, state }) => ({
        type: REWARDS_GET_DELEGATORS,
        payload: { cycle: state.rewards.cycle, bakerHash: action.payload.hash }
      }))
    ));

    this.getDelegatorsSuccess$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(REWARDS_GET_DELEGATORS_SUCCESS),
      this.latestActionState<RewardsGetDelegatorsSuccess>(),
      filter(({ state }) => !!state.rewards.ledger?.publicKeyHash),
      tap(({ state }) => this.updateTransactions = !!state.rewards.activeBaker),
    ));

    this.onLedgerConnect$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(REWARDS_LEDGER_CONNECTED),
      this.latestActionState<RewardsLedgerConnected>(),
      tap(({ state }) => this.updateTransactions = !!state.rewards.activeBaker),
      tap(({ action, state }) => this.router.navigate(['rewards', action.payload.ledger.publicKeyHash]))
    ));

    this.paymentComplete$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(REWARDS_ADD_DISTRIBUTED_REWARD),
      this.latestActionState<RewardsAddDistributedReward>(),
      tap(({ state }) => this.updateTransactions = true),
    ));

    this.stopGettingTransactionStatuses$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(REWARDS_STOP_GETTING_TRANSACTION_STATUSES),
      this.latestActionState<RewardsStopGettingTransactionStatuses>(),
      tap(({ state }) => this.updateTransactions = false),
    ));

    this.close$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(REWARDS_STOP),
      tap(() => this.destroy$.next(void 0)),
    ));
  }
}
