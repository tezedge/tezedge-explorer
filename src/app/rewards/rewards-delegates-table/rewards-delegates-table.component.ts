import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { selectRewardsBakers, selectRewardsSort } from '@rewards/rewards.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';
import { Router } from '@angular/router';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { REWARDS_SORT_DELEGATES, RewardsSortDelegates } from '@rewards/rewards.actions';
import { addInfo } from '@shared/constants/store-functions';


@UntilDestroy()
@Component({
  selector: 'app-rewards-delegates-table',
  templateUrl: './rewards-delegates-table.component.html',
  styleUrls: ['./rewards-delegates-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsDelegatesTableComponent implements OnInit {

  readonly tableHeads = [
    { name: 'BAKER', sort: 'bakerName' },
    { name: 'REWARDS (ꜩ)', sort: 'reward' },
    { name: 'BALANCE (ꜩ)', sort: 'balance' },
    { name: 'DELEGATORS', sort: 'delegatorsLength' },
  ];

  bakers: RewardsBaker[] = [];
  currentSort: TableSort;

  constructor(private router: Router,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackBakers = (index: number, baker: RewardsBaker) => baker.hash;

  ngOnInit(): void {
    this.listenToBakersChanges();
  }

  copyHashToClipboard(hash: string, event: MouseEvent): void {
    event.stopPropagation();
    addInfo(this.store, hash);
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<RewardsSortDelegates>({
      type: REWARDS_SORT_DELEGATES,
      payload: {
        sortBy,
        sortDirection
      }
    });
  }

  selectBaker(baker: RewardsBaker): void {
    this.router.navigate(['rewards', baker.hash]);
  }

  private listenToBakersChanges(): void {
    this.store.select(selectRewardsBakers)
      .pipe(untilDestroyed(this))
      .subscribe(bakers => {
        this.bakers = bakers;
        this.cdRef.detectChanges();
      });

    this.store.select(selectRewardsSort)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.cdRef.detectChanges();
      });
  }
}
