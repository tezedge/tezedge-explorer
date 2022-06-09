import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  BAKING_INIT,
  BAKING_LEDGER_CONNECTED,
  BAKING_STOP,
  BakingInit,
  BakingLedgerConnected,
  BakingStop
} from '@baking/baking.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectBakingActiveBaker, selectBakingBakers, selectBakingCycle } from '@baking/baking.index';
import { ActiveBaker } from '@shared/types/bakings/active-baker.type';
import {
  BakingConnectLedgerDialogComponent
} from '@baking/baking-connect-ledger-dialog/baking-connect-ledger-dialog.component';
import { filter, take } from 'rxjs/operators';
import { BakingLedger } from '@shared/types/bakings/baking-ledger.type';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { BakingBaker } from '@shared/types/bakings/baking-baker.type';

@UntilDestroy()
@Component({
  selector: 'app-baking',
  templateUrl: './baking.component.html',
  styleUrls: ['./baking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingComponent implements OnInit, OnDestroy {

  cycle: number;
  activeBaker: ActiveBaker;
  showConnectButton: boolean = false;

  private bakers: BakingBaker[] = [];

  constructor(private router: Router,
              private store: Store<State>,
              private matDialog: MatDialog,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<BakingInit>({ type: BAKING_INIT });
    this.listenToBakingChanges();
  }

  private listenToBakingChanges(): void {
    this.store.select(selectBakingCycle)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe(cycle => {
        this.cycle = cycle;
        this.cdRef.detectChanges();
      });
    this.store.select(selectBakingActiveBaker)
      .pipe(untilDestroyed(this))
      .subscribe(baker => {
        this.activeBaker = baker;
        this.cdRef.detectChanges();
      });
    this.store.select(selectBakingBakers)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe(bakers => {
        this.bakers = bakers;
      });
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe(route => {
        this.showConnectButton = !route.params.hash;
        this.cdRef.detectChanges();
      });
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
        if (ledger && this.bakers.find(b => b.hash === ledger.publicKeyHash)) {
          this.store.dispatch<BakingLedgerConnected>({
            type: BAKING_LEDGER_CONNECTED,
            payload: { ledger }
          });

          this.router.navigate(['baking', ledger.publicKeyHash]);
        }
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<BakingStop>({ type: BAKING_STOP });
  }
}
