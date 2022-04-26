import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import { EMPTY, of, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { ActiveBaker } from '@shared/types/bakings/active-baker.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, map, take } from 'rxjs/operators';
import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';
import { selectFullActiveNode } from '@settings/settings-node.reducer';
import { BAKING_ADD_DISTRIBUTED_REWARD, BakingAddDistributedReward } from '@baking/baking.actions';
import { BakingPaymentStatus } from '@shared/types/bakings/baking-payment-status.type';
import { initializeWallet, State as TezosWalletState, Transaction, transaction } from '../../../../lib';
import { SettingsNodeEntity } from '@shared/types/settings-node/settings-node-entity.type';

@UntilDestroy()
@Component({
  templateUrl: './baking-ledger-sign-dialog.component.html',
  styleUrls: ['./baking-ledger-sign-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingLedgerSignDialogComponent implements OnInit {

  errorMessage: boolean;
  isWaitingLedger: boolean;
  operationHash: string;
  transactionTotalAmount = 0;

  private activeNode: SettingsNodeEntity;
  private transportHolder: { transport: any | undefined } = { transport: undefined };
  private transactions: Transaction[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: { batchIndex: number, activeBaker: ActiveBaker, ledger: BakingLedger, transactionFee: number },
              private dialogRef: MatDialogRef<BakingLedgerSignDialogComponent>,
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
        })),
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
        transaction(() => this.transactions),
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
    this.store.dispatch<BakingAddDistributedReward>({
      type: BAKING_ADD_DISTRIBUTED_REWARD,
      payload: {
        batch: {
          ...this.dialogData.activeBaker.batches[this.dialogData.batchIndex],
          operationHash: this.operationHash,
          status: BakingPaymentStatus.PENDING
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
    const delegators = this.dialogData.activeBaker.delegators;

    this.transactions = delegators
      .slice(batchToPay.index, batchToPay.index + batchToPay.transactions)
      .map((delegator: BakingDelegator) => ({
        to: delegator.hash,
        amount: delegator.rewardAfterFee.toString(),
        fee: this.dialogData.transactionFee.toString()
      }));
    this.transactionTotalAmount = this.transactions.reduce((sum: number, curr: Transaction) => sum + Number(curr.amount), 0)
      + this.dialogData.transactionFee * this.transactions.length;
  }
}
