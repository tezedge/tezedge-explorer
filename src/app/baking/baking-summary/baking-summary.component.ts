import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MatDialog } from '@angular/material/dialog';
import { selectBakingActiveBaker, selectBakingLedger, selectFees } from '@baking/baking.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import {
  BakingConnectLedgerDialogComponent
} from '@baking/baking-connect-ledger-dialog/baking-connect-ledger-dialog.component';
import { ActiveBaker } from '@shared/types/bakings/active-baker.type';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  BAKING_APPLY_COMMISSION_FEE,
  BAKING_APPLY_TRANSACTION_FEE,
  BAKING_STOP_GETTING_TRANSACTION_STATUSES,
  BakingApplyCommissionFee,
  BakingApplyTransactionFee,
  BakingStopGettingTransactionStatuses
} from '@baking/baking.actions';
import { BakingPaymentStatus } from '@shared/types/bakings/baking-payment-status.type';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-baking-summary',
  templateUrl: './baking-summary.component.html',
  styleUrls: ['./baking-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingSummaryComponent implements OnInit {

  ledger: BakingLedger;
  activeBaker: ActiveBaker;
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
    if (!this.formGroup.get('commission').value) {
      this.formGroup.get('commission').setValue(0);
    } else if (Number(this.formGroup.get('commission').value) > 100) {
      this.formGroup.get('commission').setValue(100);
    }
    const newFee = Number(this.formGroup.get('commission').value);
    if (this.formGroup.get('commission').valid && this.commissionFee !== newFee) {
      this.store.dispatch<BakingApplyCommissionFee>({ type: BAKING_APPLY_COMMISSION_FEE, payload: newFee });
    }
  }

  applyTransactionFee(): void {
    if (Number(this.formGroup.get('transaction').value) <= 0.01) {
      this.formGroup.get('transaction').setValue(0.01);
    }
    const newFee = Number(this.formGroup.get('transaction').value);
    if (this.formGroup.get('transaction').valid && this.transactionFee !== newFee) {
      this.store.dispatch<BakingApplyTransactionFee>({ type: BAKING_APPLY_TRANSACTION_FEE, payload: newFee });
    }
  }

  openLedgerConnectDialog(): void {
    this.matDialog
      .open(BakingConnectLedgerDialogComponent, {
        width: '675px',
        height: '495px',
        autoFocus: false
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((ledger: BakingLedger) => {
        if (ledger) {
          this.router.navigate(['baking', ledger.publicKeyHash]);
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
    this.store.select(selectBakingLedger)
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged()
      )
      .subscribe(ledger => {
        this.ledger = ledger;
        this.cdRef.detectChanges();
      });
    this.store.select(selectFees)
      .pipe(untilDestroyed(this))
      .subscribe(fees => {
        this.commissionFee = fees.commissionFee;
        this.transactionFee = fees.transactionFee;
      });

    this.store.select(selectBakingActiveBaker)
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        filter(Boolean)
      )
      .subscribe(activeBaker => {
        this.activeBaker = activeBaker;
        if (this.activeBaker.batches.every(b => b.status >= 0 && b.status !== BakingPaymentStatus.PENDING)) {
          this.store.dispatch<BakingStopGettingTransactionStatuses>({ type: BAKING_STOP_GETTING_TRANSACTION_STATUSES });
        }
        this.cdRef.detectChanges();
      });
  }
}
