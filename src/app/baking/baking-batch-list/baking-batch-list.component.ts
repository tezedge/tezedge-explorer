import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BakingBatch } from '@shared/types/bakings/baking-batch.type';
import { selectFees } from '@baking/baking.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import { ActiveBaker } from '@shared/types/bakings/active-baker.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MatDialog } from '@angular/material/dialog';
import { BakingLedgerSignDialogComponent } from '@baking/baking-ledger-sign-dialog/baking-ledger-sign-dialog.component';
import { Router } from '@angular/router';
import { selectActiveNodeNetwork } from '@settings/settings-node.reducer';
import { openInTzStats } from '@shared/constants/navigation';

@UntilDestroy()
@Component({
  selector: 'app-baking-batch-list',
  templateUrl: './baking-batch-list.component.html',
  styleUrls: ['./baking-batch-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingBatchListComponent implements OnInit {

  @Input() ledger: BakingLedger;
  @Input() activeBaker: ActiveBaker;

  transactionFee: number;

  private nodeNetwork: string;

  constructor(private store: Store<State>,
              private matDialog: MatDialog,
              private router: Router,
              private cdRef: ChangeDetectorRef) { }

  readonly trackBatches = (index: number, batch: BakingBatch) => batch.status;

  ngOnInit(): void {
    this.listenToTransactionFeeChange();
    this.listenToNodeNetworkChange();
  }

  openLedgerSignDialog(batchIndex: number): void {
    this.matDialog
      .open(BakingLedgerSignDialogComponent, {
        width: '675px',
        height: '495px',
        data: {
          batchIndex,
          activeBaker: this.activeBaker,
          ledger: this.ledger,
          transactionFee: this.transactionFee
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }

  viewInTzStats(batch: BakingBatch): void {
    openInTzStats(this.nodeNetwork, batch.operationHash);
  }

  private listenToNodeNetworkChange(): void {
    this.store.select(selectActiveNodeNetwork)
      .pipe(untilDestroyed(this))
      .subscribe((network: string) => this.nodeNetwork = network);
  }

  private listenToTransactionFeeChange(): void {
    this.store.select(selectFees)
      .pipe(untilDestroyed(this))
      .subscribe(fees => {
        this.transactionFee = fees.transactionFee;
        this.cdRef.detectChanges();
      });
  }
}
