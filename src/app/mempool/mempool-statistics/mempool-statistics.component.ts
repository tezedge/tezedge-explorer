import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { ADD_INFO, InfoAdd } from '@shared/error-popup/error-popup.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
    { name: 'preApply' },
    { name: 'delta' },
    { name: 'received', sort: 'firstReceived' },
    { name: 'content received', sort: 'contentReceived', deltaAvailable: true },
    { name: 'validation started', sort: 'validationStarted', deltaAvailable: true },
    { name: 'validation finished', sort: 'validationResult', deltaAvailable: true },
    { name: 'sent', sort: 'firstSent', deltaAvailable: true },
    { name: 'kind' },
  ];

  activeSecondaryTab = 'DETAILS';
  deltaEnabled = true;

  operations$: Observable<MempoolStatisticsOperation[]>;
  activeOperation: MempoolStatisticsOperation;
  currentSort: TableSort;
  readonly trackOperation = (index: number, op: MempoolStatisticsOperation) => op.hash;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<MempoolStatisticsLoad>({ type: MEMPOOL_STATISTICS_LOAD });
    this.listenToStatisticsChanges();
    this.listenToSortChange();
  }

  private listenToStatisticsChanges(): void {
    this.operations$ = this.store.select(selectMempoolStatisticsOperations);
  }

  private listenToSortChange(): void {
    this.store.select(selectMempoolStatisticsSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  selectOperation(operation: MempoolStatisticsOperation): void {
    this.activeOperation = operation;
    this.store.dispatch<MempoolStatisticsChangeActiveOperation>({ type: MEMPOOL_STATISTICS_CHANGE_ACTIVE_OPERATION, payload: operation });
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

  copyHashToClipboard(hash: string, event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  onDeltaClick(event: MatCheckboxChange): void {
    this.deltaEnabled = event.checked;
    this.cdRef.detectChanges();

    const tableHead = this.tableHeads.find(th => th.deltaAvailable && this.currentSort.sortBy.includes(th.sort));
    if (tableHead) {
      this.sortTable(this.deltaEnabled ? this.currentSort.sortBy + 'Delta' : tableHead.sort);
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolStatisticsStop>({ type: MEMPOOL_STATISTICS_STOP });
  }
}
