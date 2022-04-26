import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { selectBakingActiveBaker, selectBakingSort, selectSortedDelegators } from '@baking/baking.index';
import { ActiveBaker } from '@shared/types/bakings/active-baker.type';
import { Observable } from 'rxjs';
import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import {
  BAKING_SORT_DELEGATES,
  BAKING_SORT_DELEGATORS,
  BakingSortDelegates,
  BakingSortDelegators
} from '@baking/baking.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ADD_INFO, InfoAdd } from '@app/layout/error-popup/error-popup.actions';
import { addInfo } from '@shared/constants/store-functions';

@UntilDestroy()
@Component({
  selector: 'app-baking-delegators-table',
  templateUrl: './baking-delegators-table.component.html',
  styleUrls: ['./baking-delegators-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingDelegatorsTableComponent implements OnInit, OnDestroy {

  readonly tableHeads = [
    { name: 'DELEGATOR ADDRESS', sort: 'hash' },
    { name: 'INITIAL REWARDS (ꜩ)', sort: 'reward' },
    { name: 'REWARDS AFTER FEE (ꜩ)', sort: 'rewardAfterFee' },
    { name: 'FEE (ꜩ)', sort: 'fee' },
    { name: 'BALANCE (ꜩ)', sort: 'balance' },
    { name: 'PAID', sort: 'status' },
  ];

  delegators$: Observable<BakingDelegator[]>;
  currentSort: TableSort;

  constructor(private router: Router,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackDelegators = (index: number, baker: BakingDelegator) => baker.hash;

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
    this.store.dispatch<BakingSortDelegators>({
      type: BAKING_SORT_DELEGATORS,
      payload: {
        sortBy,
        sortDirection
      }
    });
  }

  private listenToChanges(): void {
    this.delegators$ = this.store.select(selectSortedDelegators);

    this.store.select(selectBakingSort)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<BakingSortDelegates>({
      type: BAKING_SORT_DELEGATES,
      payload: this.currentSort
    });
  }
}
