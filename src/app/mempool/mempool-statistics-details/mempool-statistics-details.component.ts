import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  selectMempoolStatisticsActiveOperation,
  selectMempoolStatisticsDetailsSorting,
  selectMempoolStatisticsSorting
} from '@mempool/mempool-statistics/mempool-statistics.reducer';
import { ADD_INFO, InfoAdd } from '@shared/error-popup/error-popup.actions';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { MEMPOOL_STATISTICS_DETAILS_SORT, MempoolStatisticsDetailsSort } from '@mempool/mempool-statistics/mempool-statistics.action';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-mempool-statistics-details',
  templateUrl: './mempool-statistics-details.component.html',
  styleUrls: ['./mempool-statistics-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolStatisticsDetailsComponent implements OnInit {

  activeOperation$: Observable<MempoolStatisticsOperation>;
  activeOperationIndex = -1;
  currentSort: TableSort;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToStatisticsChanges();
    this.listenToSortChange();
  }

  private listenToStatisticsChanges(): void {
    this.activeOperation$ = this.store.select(selectMempoolStatisticsActiveOperation);
  }

  private listenToSortChange(): void {
    this.store.select(selectMempoolStatisticsDetailsSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  copyHashToClipboard(hash: string): void {
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.store.dispatch<MempoolStatisticsDetailsSort>({
      type: MEMPOOL_STATISTICS_DETAILS_SORT,
      payload: { sortBy, sortDirection }
    });
  }

}
