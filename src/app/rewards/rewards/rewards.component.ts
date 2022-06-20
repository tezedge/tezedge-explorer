import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  REWARDS_INIT,
  REWARDS_LEDGER_CONNECTED,
  REWARDS_STOP,
  RewardsInit,
  RewardsLedgerConnected,
  RewardsStop
} from '@rewards/rewards.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectRewardsActiveBaker, selectRewardsBakers, selectRewardsCycle } from '@rewards/rewards.index';
import { RewardsActiveBaker } from '@shared/types/rewards/rewards-active-baker.type';
import {
  RewardsConnectLedgerDialogComponent
} from '@rewards/rewards-connect-ledger-dialog/rewards-connect-ledger-dialog.component';
import { filter, take } from 'rxjs/operators';
import { RewardsLedger } from '@shared/types/rewards/rewards-ledger.type';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';

@UntilDestroy()
@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardsComponent implements OnInit, OnDestroy {

  cycle: number;
  activeBaker: RewardsActiveBaker;
  showConnectButton: boolean = false;

  private bakers: RewardsBaker[] = [];

  constructor(private router: Router,
              private store: Store<State>,
              private matDialog: MatDialog,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<RewardsInit>({ type: REWARDS_INIT });
    this.listenToBakingChanges();
  }

  private listenToBakingChanges(): void {
    this.store.select(selectRewardsCycle)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe(cycle => {
        this.cycle = cycle;
        this.cdRef.detectChanges();
      });
    this.store.select(selectRewardsActiveBaker)
      .pipe(untilDestroyed(this))
      .subscribe(baker => {
        this.activeBaker = baker;
        this.cdRef.detectChanges();
      });
    this.store.select(selectRewardsBakers)
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
      .open(RewardsConnectLedgerDialogComponent, {
        width: '675px',
        height: '495px',
        autoFocus: false
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((ledger: RewardsLedger) => {
        if (ledger && this.bakers.find(b => b.hash === ledger.publicKeyHash)) {
          this.store.dispatch<RewardsLedgerConnected>({
            type: REWARDS_LEDGER_CONNECTED,
            payload: { ledger }
          });

          this.router.navigate(['rewards', ledger.publicKeyHash]);
        }
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<RewardsStop>({ type: REWARDS_STOP });
  }
}
