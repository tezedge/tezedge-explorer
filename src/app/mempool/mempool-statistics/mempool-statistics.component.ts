import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION,
  MEMPOOL_STATISTICS_LOAD,
  MEMPOOL_STATISTICS_SORT,
  MEMPOOL_STATISTICS_STOP,
  MempoolStatisticsChangeActiveOperation,
  MempoolStatisticsLoad,
  MempoolStatisticsSort,
  MempoolStatisticsStop
} from '@mempool/mempool-statistics/mempool-statistics.action';
import { Observable } from 'rxjs';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { selectMempoolStatisticsOperations, selectMempoolStatisticsSorting } from '@mempool/mempool-statistics/mempool-statistics.reducer';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-mempool-statistics',
  templateUrl: './mempool-statistics.component.html',
  styleUrls: ['./mempool-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolStatisticsComponent implements OnInit, OnDestroy {

  readonly tableHeads = [
    { name: 'dateTime' },
    { name: 'hash' },
    { name: 'nodes', sort: 'nodesLength' },
    { name: 'max received', sort: 'maxReceived' },
    { name: 'max sent', sort: 'maxSent' },
  ];

  operations$: Observable<MempoolStatisticsOperation[]>;
  activeOperationIndex = -1;
  currentSort: TableSort;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch<MempoolStatisticsLoad>({ type: MEMPOOL_STATISTICS_LOAD });
    this.listenToStatisticsChanges();
    this.listenToSortChange();
  }

  private listenToStatisticsChanges(): void {
    this.operations$ = this.store.select(selectMempoolStatisticsOperations);
  }

  selectOperation(i: number): void {
    this.activeOperationIndex = i;
    this.store.dispatch<MempoolStatisticsChangeActiveOperation>({ type: MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION, payload: i });
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolStatisticsStop>({ type: MEMPOOL_STATISTICS_STOP });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.store.dispatch<MempoolStatisticsSort>({
      type: MEMPOOL_STATISTICS_SORT,
      payload: { sortBy, sortDirection }
    });
  }

  private listenToSortChange(): void {
    this.store.select(selectMempoolStatisticsSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }
}
