import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { selectRewardsSort, selectRewardsSortedDelegators } from '@rewards/rewards.index';
import { Observable } from 'rxjs';
import { RewardsDelegator } from '@shared/types/rewards/rewards-delegator.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import {
  REWARDS_SORT_DELEGATES,
  REWARDS_SORT_DELEGATORS,
  RewardsSortDelegates,
  RewardsSortDelegators
} from '@rewards/rewards.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { addInfo } from '@shared/constants/store-functions';

@UntilDestroy()
@Component({
  selector: 'app-rewards-delegators-table',
  templateUrl: './rewards-delegators-table.component.html',
  styleUrls: ['./rewards-delegators-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RewardsDelegatorsTableComponent implements OnInit, OnDestroy {

  readonly tableHeads = [
    { name: 'DELEGATOR ADDRESS', sort: 'hash' },
    { name: 'INITIAL REWARDS (ꜩ)', sort: 'reward' },
    { name: 'REWARDS AFTER FEE (ꜩ)', sort: 'rewardAfterFee' },
    { name: 'FEE (ꜩ)', sort: 'fee' },
    { name: 'BALANCE (ꜩ)', sort: 'balance' },
    { name: 'PAID', sort: 'status' },
  ];

  delegators$: Observable<RewardsDelegator[]>;
  currentSort: TableSort;

  constructor(private router: Router,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackDelegators = (index: number, baker: RewardsDelegator) => baker.hash;

  ngOnInit(): void {
    this.listenToChanges();
  }

  copyHashToClipboard(hash: string, event: MouseEvent): void {
    event.stopPropagation();
    addInfo(this.store, hash);
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<RewardsSortDelegators>({
      type: REWARDS_SORT_DELEGATORS,
      payload: {
        sortBy,
        sortDirection
      }
    });
  }

  private listenToChanges(): void {
    this.delegators$ = this.store.select(selectRewardsSortedDelegators);

    this.store.select(selectRewardsSort)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<RewardsSortDelegates>({
      type: REWARDS_SORT_DELEGATES,
      payload: this.currentSort
    });
  }
}
