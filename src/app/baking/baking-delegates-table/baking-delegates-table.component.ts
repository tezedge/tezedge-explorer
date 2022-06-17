import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { selectBakingBakers, selectBakingSort } from '@baking/baking.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BakingBaker } from '@shared/types/bakings/baking-baker.type';
import { Router } from '@angular/router';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { BAKING_SORT_DELEGATES, BakingSortDelegates } from '@baking/baking.actions';
import { ADD_INFO, InfoAdd } from '@app/layout/error-popup/error-popup.actions';
import { addInfo } from '@shared/constants/store-functions';


@UntilDestroy()
@Component({
  selector: 'app-baking-delegates-table',
  templateUrl: './baking-delegates-table.component.html',
  styleUrls: ['./baking-delegates-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BakingDelegatesTableComponent implements OnInit {

  readonly tableHeads = [
    { name: 'BAKER', sort: 'bakerName' },
    { name: 'REWARDS (ꜩ)', sort: 'reward' },
    { name: 'BALANCE (ꜩ)', sort: 'balance' },
    { name: 'DELEGATORS', sort: 'delegatorsLength' },
  ];

  bakers: BakingBaker[] = [];
  currentSort: TableSort;

  constructor(private router: Router,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackBakers = (index: number, baker: BakingBaker) => baker.hash;

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
    this.store.dispatch<BakingSortDelegates>({
      type: BAKING_SORT_DELEGATES,
      payload: {
        sortBy,
        sortDirection
      }
    });
  }

  selectBaker(baker: BakingBaker): void {
    this.router.navigate(['rewards', baker.hash]);
  }

  private listenToBakersChanges(): void {
    this.store.select(selectBakingBakers)
      .pipe(untilDestroyed(this))
      .subscribe(bakers => {
        this.bakers = bakers;
        this.cdRef.detectChanges();
      });

    this.store.select(selectBakingSort)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.cdRef.detectChanges();
      });
  }
}
