import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { CdkStepper } from '@angular/cdk/stepper';
import { of, Subscription, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import { take } from 'rxjs/operators';
import { getLedgerWallet } from 'tezos-wallet';

@UntilDestroy()
@Component({
  templateUrl: './baking-connect-ledger-dialog.component.html',
  styleUrls: ['./baking-connect-ledger-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper }]
})
export class BakingConnectLedgerDialogComponent implements AfterViewInit {

  ledger: BakingLedger;
  errorMessage: boolean;
  isWaitingLedger: boolean;

  @ViewChild(MatStepper) private stepper: MatStepper;
  @ViewChild('continueButton') private continueButton: ElementRef<HTMLButtonElement>;
  private transportHolder: { transport: any | undefined } = { transport: undefined };
  private ledgerSub: Subscription;

  constructor(private dialogRef: MatDialogRef<BakingConnectLedgerDialogComponent>,
              private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.continueButton.nativeElement.focus();
  }

  back(): void {
    this.errorMessage = false;
    this.ledger = undefined;
    this.ledgerSub?.unsubscribe();
    if (this.stepper.selectedIndex === 0) {
      this.dialogRef.close();
    } else {
      this.stepper.previous();
    }
  }

  nextStep(): void {
    this.stepper.next();
    this.getLedgerAddress();
  }

  getLedgerAddress(): void {
    this.errorMessage = false;
    if (!this.isWaitingLedger) {
      this.ledgerSub = of(void 0).pipe(
        tap(() => this.isWaitingLedger = true),
        getLedgerWallet(() => this.transportHolder) as any,
        untilDestroyed(this),
        take(1),
      ).subscribe((data: any) => {
        if (data.ledger.keys[0].publicKeyHash) {
          this.ledger = data.ledger.keys[0];
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
    this.dialogRef.close(this.ledger);
  }
}
