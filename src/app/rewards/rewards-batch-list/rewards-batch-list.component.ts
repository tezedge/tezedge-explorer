import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RewardsBatch } from '@shared/types/rewards/rewards-batch.type';
import { selectRewardsFees, selectRewardsInitialDelegators } from '@rewards/rewards.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { RewardsLedger } from '@shared/types/rewards/rewards-ledger.type';
import { RewardsActiveBaker } from '@shared/types/rewards/rewards-active-baker.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MatDialog } from '@angular/material/dialog';
import { RewardsLedgerSignDialogComponent } from '@rewards/rewards-ledger-sign-dialog/rewards-ledger-sign-dialog.component';
import { Router } from '@angular/router';
import { selectActiveNodeNetwork } from '@settings/settings-node.reducer';
import { openInTzStats } from '@shared/constants/navigation';
import { RewardsDelegator } from '@shared/types/rewards/rewards-delegator.type';

@UntilDestroy()
@Component({
  selector: 'app-rewards-batch-list',
  templateUrl: './rewards-batch-list.component.html',
  styleUrls: ['./rewards-batch-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardsBatchListComponent implements OnInit {

  @Input() ledger: RewardsLedger;
  @Input() activeBaker: RewardsActiveBaker;

  transactionFee: number;

  private delegators: RewardsDelegator[];
  private nodeNetwork: string;

  constructor(private store: Store<State>,
              private matDialog: MatDialog,
              private router: Router,
              private cdRef: ChangeDetectorRef) { }

  readonly trackBatches = (index: number, batch: RewardsBatch) => batch.status;

  ngOnInit(): void {
    this.listenToTransactionFeeChange();
    this.listenToDelegatorsChange();
    this.listenToNodeNetworkChange();
  }

  openLedgerSignDialog(batchIndex: number): void {
    this.matDialog
      .open(RewardsLedgerSignDialogComponent, {
        width: '675px',
        height: '495px',
        data: {
          batchIndex,
          activeBaker: this.activeBaker,
          delegators: this.delegators,
          ledger: this.ledger,
          transactionFee: this.transactionFee
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }

  viewInTzStats(batch: RewardsBatch): void {
    openInTzStats(this.nodeNetwork, batch.operationHash);
  }

  private listenToNodeNetworkChange(): void {
    this.store.select(selectActiveNodeNetwork)
      .pipe(untilDestroyed(this))
      .subscribe((network: string) => this.nodeNetwork = network);
  }

  private listenToDelegatorsChange(): void {
    this.store.select(selectRewardsInitialDelegators)
      .pipe(untilDestroyed(this))
      .subscribe(delegators => {
        this.delegators = delegators;
      });
  }

  private listenToTransactionFeeChange(): void {
    this.store.select(selectRewardsFees)
      .pipe(untilDestroyed(this))
      .subscribe(fees => {
        this.transactionFee = fees.transactionFee;
        this.cdRef.detectChanges();
      });
  }
}
