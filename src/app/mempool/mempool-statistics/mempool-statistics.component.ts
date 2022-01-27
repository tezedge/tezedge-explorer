import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
} from '@mempool/mempool-statistics/mempool-statistics.actions';
import { debounceTime, fromEvent, interval, Observable, Subscription, tap } from 'rxjs';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import {
  selectMempoolStatisticsActiveOperation,
  selectMempoolStatisticsOperations,
  selectMempoolStatisticsSorting
} from '@mempool/mempool-statistics/mempool-statistics.reducer';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ADD_INFO, InfoAdd } from '@shared/error-popup/error-popup.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-mempool-statistics',
  templateUrl: './mempool-statistics.component.html',
  styleUrls: ['./mempool-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolStatisticsComponent implements OnInit, OnDestroy, AfterViewInit {

  readonly tableHeads = [
    { name: 'dateTime' },
    { name: 'hash' },
    { name: 'nodes', sort: 'nodesLength' },
    { name: 'delta' },
    { name: 'received', sort: 'firstReceived' },
    { name: 'content received', sort: 'contentReceived', deltaAvailable: true },
    { name: 'validation started', sort: 'validationStarted', deltaAvailable: true },
    { name: 'preApply started', sort: 'preApplyStarted', deltaAvailable: true },
    { name: 'preApply ended', sort: 'preApplyEnded', deltaAvailable: true },
    { name: 'validation finished', sort: 'validationResult', deltaAvailable: true },
    { name: 'val. len.', sort: 'validationsLength' },
    { name: 'sent', sort: 'firstSent', deltaAvailable: true },
    { name: 'kind' },
  ];

  activeSecondaryTab = 'DETAILS';
  deltaEnabled = true;

  operations$: Observable<MempoolStatisticsOperation[]>;
  activeOperation: MempoolStatisticsOperation;
  currentSort: TableSort;
  scrolledIndex: number;
  horizontalScroll = 0;
  formGroup: FormGroup;
  @ViewChild(CdkVirtualScrollViewport) private cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChild('hsc') private horizontalScrollingContainer: ElementRef<HTMLDivElement>;
  private scrollSubscription: Subscription;
  private scrolledOnTableInitialization: boolean;
  private operations: MempoolStatisticsOperation[];

  constructor(private store: Store<State>,
              private router: Router,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef,
              private formBuilder: FormBuilder) { }

  readonly trackOperation = (index: number, op: MempoolStatisticsOperation) => op.hash;

  ngOnInit(): void {
    this.store.dispatch<MempoolStatisticsLoad>({ type: MEMPOOL_STATISTICS_LOAD });
    this.listenToStatisticsChanges();
    this.listenToActiveOperationChange();
    this.listenToSortChange();
    this.initForm();
  }

  ngAfterViewInit(): void {
    fromEvent(this.horizontalScrollingContainer.nativeElement, 'scroll').pipe(
      untilDestroyed(this),
      debounceTime(100)
    ).subscribe(() => {
      this.horizontalScroll = this.horizontalScrollingContainer.nativeElement.scrollLeft;
      this.cdRef.detectChanges();
    });
  }

  selectOperation(operation: MempoolStatisticsOperation): void {
    this.router.navigate([], {
      queryParams: { operation: operation.hash },
      queryParamsHandling: 'merge',
    });
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

  scrollLeft(): void {
    this.horizontalScrollingContainer.nativeElement.scrollBy({ top: 0, left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.horizontalScrollingContainer.nativeElement.scrollBy({ top: 0, left: 300, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolStatisticsStop>({ type: MEMPOOL_STATISTICS_STOP });
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      hash: new FormControl('')
    });

    this.formGroup.valueChanges.pipe(
      untilDestroyed(this),
      debounceTime(300)
    ).subscribe(value => {
      const index = this.operations.findIndex(op => op.hash === value.hash);
      if (index !== -1) {
        this.selectOperation(this.operations[index]);
        this.performScrollToActiveOperation(this.operations, index);
      }
    });
  }

  private listenToStatisticsChanges(): void {
    this.operations$ = this.store.select(selectMempoolStatisticsOperations).pipe(
      tap(operations => {
        this.operations = operations;
        if (this.scrolledOnTableInitialization || operations.length === 0) {
          return;
        }
        this.scrollToActiveOperation(operations);
      })
    );
  }

  private listenToActiveOperationChange(): void {
    this.store.select(selectMempoolStatisticsActiveOperation)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe(operation => {
        this.activeOperation = operation;
        this.cdRef.detectChanges();
      });
  }

  private listenToSortChange(): void {
    this.store.select(selectMempoolStatisticsSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  private scrollToActiveOperation(operations: MempoolStatisticsOperation[]): void {
    this.scrolledOnTableInitialization = true;
    const urlHash = this.route.snapshot.queryParams['operation'];
    const index = operations.findIndex(op => op.hash === urlHash);
    if (index !== -1) {
      this.performScrollToActiveOperation(operations, index);
      this.selectOperation(operations[index]);
    }
  }

  private performScrollToActiveOperation(operations: MempoolStatisticsOperation[], index: number): void {
    const elementsInView = this.cdkVirtualScrollViewport.elementRef.nativeElement.offsetHeight / 36;
    const center = (operations.length - index) > (elementsInView / 2);
    const targetIndex = Math.floor(elementsInView / (center ? 2 : 1));
    let scrollTarget = index;
    if (operations[targetIndex] && center) {
      scrollTarget = index - targetIndex;
    }
    this.scrollSubscription = interval(200).subscribe(() => {
      if (this.scrolledIndex !== scrollTarget) {
        this.cdkVirtualScrollViewport.scrollToIndex(scrollTarget, 'auto');
        this.scrolledIndex = scrollTarget;
      } else {
        this.scrollSubscription.unsubscribe();
      }
    });
  }
}
