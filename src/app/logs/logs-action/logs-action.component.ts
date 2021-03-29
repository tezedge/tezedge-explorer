import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VirtualScrollDirective } from '../../shared/virtual-scroll/virtual-scroll.directive';
import {LogsAction} from '../../shared/types/logs/logs-action.type';
import {LogsActionEntity} from '../../shared/types/logs/logs-action-entity.type';

@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsActionComponent implements OnInit, OnDestroy {

  virtualScrollItems: LogsAction;
  logsActionItem: LogsActionEntity;
  logsActionShow: boolean;
  filtersState = {
    open: true
  };
  virtualPageSize = 1000;
  activeFilters = [];

  onDestroy$ = new Subject();

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;
  // @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    public store: Store<any>,
    private changeDetector: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.scrollStart(null);

    this.store.select('logsAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: LogsAction) => {
        this.virtualScrollItems = data;
        this.logsActionShow = this.virtualScrollItems.ids.length > 0;

        if (this.logsActionShow && !this.logsActionItem) {
          this.logsActionItem = this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]];
        }

        this.changeDetector.markForCheck();

        // if (this.virtualScrollItems.ids.length > 0 && this.vrFor) {
        //   this.vrFor.afterReceivingData();
        // }
        // this.logsActionList = data.ids.map(id => ({id, ...data.entities[id]}));

      });

    // this.logsAction$ = this.store.select('logsAction');
    // this.logsDataSource = new LogsDataSource(this.logsAction$, this.store);
  }

  getItems($event) {
    this.store.dispatch({
      type: 'LOGS_ACTION_LOAD',
      payload: {
        cursor_id: $event?.nextCursorId,
        limit: $event?.limit
      }
    });
  }

  loadPreviousPage() {
    if (this.virtualScrollItems.stream) {
      this.scrollStop();
    }
    this.getItems({
      nextCursorId: this.virtualScrollItems.activePage.start.originalId,
      limit: this.virtualPageSize
    });
  }

  loadNextPage() {
    const actualPageIndex = this.virtualScrollItems.pages.findIndex(pageId => Number(pageId) === this.virtualScrollItems.activePage.id);

    if (actualPageIndex === this.virtualScrollItems.pages.length - 1) {
      return;
    }

    const nextPageId = this.virtualScrollItems.pages[actualPageIndex + 1];

    this.getItems({
      nextCursorId: nextPageId,
      limit: this.virtualPageSize
    });
  }

  startStopDataStream(event) {
    if (event.stop) {
      this.scrollStop();
    } else {
      this.scrollStart(event);
    }
  }

  scrollStart($event) {
    if (this.virtualScrollItems && this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'LOGS_ACTION_START',
      payload: {
        limit: $event?.limit ? $event.limit : this.virtualPageSize
      }
    });
  }

  scrollStop() {
    if (!this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'LOGS_ACTION_STOP'
    });
  }

  scrollToEnd() {
    this.scrollStart(null);
  }

  // setFiltersVisibility(show): void {
  //   this.filtersState.open = show;
  //
  //   // Trigger resize event so the virtual scroll directive adjust the values for the new height of the list
  //   window.dispatchEvent(new Event('resize'));
  // }

  filterType(filterType) {
    // dispatch action
    this.store.dispatch({
      type: 'LOGS_ACTION_FILTER',
      payload: filterType
    });

  }

  tableMouseEnter(item) {
    this.ngZone.runOutsideAngular(() => {
      if (this.logsActionItem && this.logsActionItem.id === item.id) {
        return;
      }

      this.ngZone.run(() => {
        this.logsActionItem = item;
      });
    });
  }

  ngOnDestroy() {
    // stop logs stream
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP'
    });

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
