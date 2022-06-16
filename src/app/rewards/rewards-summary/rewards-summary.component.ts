import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MatDialog } from '@angular/material/dialog';
import { selectRewardsActiveBaker, selectRewardsLedger, selectRewardsFees } from '@rewards/rewards.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RewardsLedger } from '@shared/types/rewards/rewards-ledger.type';
import {
  RewardsConnectLedgerDialogComponent
} from '@rewards/rewards-connect-ledger-dialog/rewards-connect-ledger-dialog.component';
import { RewardsActiveBaker } from '@shared/types/rewards/rewards-active-baker.type';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  REWARDS_APPLY_COMMISSION_FEE,
  REWARDS_APPLY_TRANSACTION_FEE,
  REWARDS_LEDGER_CONNECTED,
  REWARDS_STOP_GETTING_TRANSACTION_STATUSES,
  RewardsApplyCommissionFee,
  RewardsApplyTransactionFee,
  RewardsLedgerConnected,
  RewardsStopGettingTransactionStatuses
} from '@rewards/rewards.actions';
import { RewardsPaymentStatus } from '@shared/types/rewards/rewards-payment-status.type';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-rewards-summary',
  templateUrl: './rewards-summary.component.html',
  styleUrls: ['./rewards-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardsSummaryComponent implements OnInit {

  ledger: RewardsLedger;
  activeBaker: RewardsActiveBaker;
  formGroup: FormGroup;

  private commissionFee: number;
  private transactionFee: number;

  constructor(private router: Router,
              private builder: FormBuilder,
              private store: Store<State>,
              private matDialog: MatDialog,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToChanges();
    this.listenToChanges();
  }

  applyCommissionFee(): void {
    const commissionForm = this.formGroup.get('commission');
    if (!commissionForm.value) {
      commissionForm.setValue(0);
    } else if (Number(commissionForm.value) > 100) {
      commissionForm.setValue(100);
    }
    const newFee = Number(commissionForm.value);
    if (commissionForm.valid && this.commissionFee !== newFee) {
      this.store.dispatch<RewardsApplyCommissionFee>({ type: REWARDS_APPLY_COMMISSION_FEE, payload: newFee });
    }
  }

  applyTransactionFee(): void {
    const transactionForm = this.formGroup.get('transaction');
    if (Number(transactionForm.value) <= 0.01) {
      transactionForm.setValue(0.01);
    }
    const newFee = Number(transactionForm.value);
    if (transactionForm.valid && this.transactionFee !== newFee) {
      this.store.dispatch<RewardsApplyTransactionFee>({ type: REWARDS_APPLY_TRANSACTION_FEE, payload: newFee });
    }
  }

  openLedgerConnectDialog(): void {
    this.matDialog
      .open(RewardsConnectLedgerDialogComponent, {
        width: '675px',
        height: '495px',
        autoFocus: false
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((ledger: RewardsLedger) => {
        if (ledger) {
          this.store.dispatch<RewardsLedgerConnected>({
            type: REWARDS_LEDGER_CONNECTED,
            payload: { ledger: { ...ledger } }
          });
          this.router.navigate(['rewards', ledger.publicKeyHash]);
        }
      });
  }

  private initForm(): void {
    this.formGroup = this.builder.group({
      commission: new FormControl(0, [Validators.min(0), Validators.max(100), Validators.required]),
      transaction: new FormControl(0.01, [Validators.min(0), Validators.required])
    });
  }

  private listenToChanges(): void {
    this.store.select(selectRewardsLedger)
      .pipe(untilDestroyed(this))
      .subscribe(ledger => {
        this.ledger = ledger;
        this.cdRef.detectChanges();
      });

    this.store.select(selectRewardsFees)
      .pipe(untilDestroyed(this))
      .subscribe(fees => {
        this.commissionFee = fees.commissionFee;
        this.transactionFee = fees.transactionFee;
      });

    this.store.select(selectRewardsActiveBaker)
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        filter(Boolean)
      )
      .subscribe(activeBaker => {
        this.activeBaker = activeBaker;
        const noPending = this.activeBaker.batches.every(b => b.status === RewardsPaymentStatus.UNPAID || b.status === RewardsPaymentStatus.APPLIED);
        if (noPending) {
          this.store.dispatch<RewardsStopGettingTransactionStatuses>({ type: REWARDS_STOP_GETTING_TRANSACTION_STATUSES });
        }
        this.cdRef.detectChanges();
      });
  }
}
