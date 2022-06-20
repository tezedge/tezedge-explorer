import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { RewardsLedger } from '@shared/types/rewards/rewards-ledger.type';
import { EMPTY, of, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { RewardsActiveBaker } from '@shared/types/rewards/rewards-active-baker.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, map, take } from 'rxjs/operators';
import { RewardsDelegator } from '@shared/types/rewards/rewards-delegator.type';
import { selectFullActiveNode } from '@settings/settings-node.reducer';
import { REWARDS_ADD_DISTRIBUTED_REWARD, RewardsAddDistributedReward } from '@rewards/rewards.actions';
import { RewardsPaymentStatus } from '@shared/types/rewards/rewards-payment-status.type';
import { initializeWallet, State as TezosWalletState, Transaction, transaction } from 'tezos-wallet';
import { SettingsNodeEntity } from '@shared/types/settings-node/settings-node-entity.type';

type RewardsLedgerSignDialogData = {
  batchIndex: number,
  activeBaker: RewardsActiveBaker,
  delegators: RewardsDelegator[],
  ledger: RewardsLedger,
  transactionFee: number
};

@UntilDestroy()
@Component({
  templateUrl: './rewards-ledger-sign-dialog.component.html',
  styleUrls: ['./rewards-ledger-sign-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardsLedgerSignDialogComponent implements OnInit {

  errorMessage: boolean;
  isWaitingLedger: boolean;
  operationHash: string;
  transactionTotalAmount = 0;

  private activeNode: SettingsNodeEntity;
  private transportHolder: { transport: any | undefined } = { transport: undefined };
  private transactions: Transaction[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: RewardsLedgerSignDialogData,
              private dialogRef: MatDialogRef<RewardsLedgerSignDialogComponent>,
              private cdRef: ChangeDetectorRef,
              private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToActiveNode();
  }

  close(): void {
    this.dialogRef.close();
  }

  signTransactions(): void {
    this.errorMessage = false;
    if ((window as any).Cypress) {
      this.isWaitingLedger = true;
      setTimeout(() => {
        this.operationHash = 'mock_operation';
        this.errorMessage = false;
        this.isWaitingLedger = false;
        this.cdRef.detectChanges();
      }, 3000);
      return;
    }
    if (!this.isWaitingLedger) {
      const observable = of([]);
      observable.pipe(
        tap(() => this.isWaitingLedger = true),
        initializeWallet(() => ({
          publicKey: this.dialogData.ledger.publicKey,
          publicKeyHash: this.dialogData.ledger.publicKeyHash,
          node: {
            name: this.activeNode.header.network,
            display: this.activeNode.header.network,
            url: this.activeNode.http,
            wsUrl: this.activeNode.features.find(f => f.name === 'ws').url + '/rpc',
            tzstats: {
              url: this.activeNode.http + '/account/'
            }
          },
          type: 'LEDGER',
        })) as any,
        map((state: any) => ({
          ...state,
          ledger: {
            ...state.ledger,
            transportHolder: this.transportHolder
          },
          ws: {
            enabled: true,
            browserWebSocketCtor: WebSocket
          }
        })),
        transaction(() => this.transactions) as any,
        untilDestroyed(this),
        take(1),
        catchError((err) => {
          console.log(err);
          this.errorMessage = true;
          this.isWaitingLedger = false;
          this.cdRef.detectChanges();
          return EMPTY;
        })
      ).subscribe((response: TezosWalletState) => {
        if (response) {
          this.operationHash = response.injectionOperation.toString();
          this.errorMessage = false;
        } else {
          this.errorMessage = true;
        }
        this.isWaitingLedger = false;
        this.cdRef.detectChanges();
      });
    }
  }

  confirm(): void {
    this.store.dispatch<RewardsAddDistributedReward>({
      type: REWARDS_ADD_DISTRIBUTED_REWARD,
      payload: {
        batch: {
          ...this.dialogData.activeBaker.batches[this.dialogData.batchIndex],
          operationHash: this.operationHash,
          status: RewardsPaymentStatus.PENDING
        }
      }
    });
    this.dialogRef.close();
  }

  viewInExplorer(): void {
    window.open('/#/mempool/pending', '_blank');
  }

  private listenToActiveNode(): void {
    this.store.select(selectFullActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe((node: SettingsNodeEntity) => {
        this.activeNode = node;
        this.calculateTransactions();
        this.signTransactions();
      });
  }

  private calculateTransactions(): void {
    const batchToPay = this.dialogData.activeBaker.batches[this.dialogData.batchIndex];
    const delegators = this.dialogData.delegators;

    this.transactions = delegators
      .slice(batchToPay.index, batchToPay.index + batchToPay.transactions)
      .map((delegator: RewardsDelegator) => ({
        to: delegator.hash,
        amount: delegator.rewardAfterFee.toString(),
        fee: this.dialogData.transactionFee.toString()
      }));
    this.transactionTotalAmount = this.transactions.reduce((sum: number, curr: Transaction) => sum + Number(curr.amount), 0)
      + this.dialogData.transactionFee * this.transactions.length;
  }
}
