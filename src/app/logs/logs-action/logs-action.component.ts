import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VirtualScrollDirective } from '../../shared/virtual-scroll.directive';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsActionComponent implements OnInit, OnDestroy {

  virtualScrollItems;
  logsActionItem; // TODO type log - define an interface for log
  logsActionShow: boolean;
  ITEM_SIZE = 36;
  filtersState = {
    open: true,
    availableFields: ['trace', 'debug', 'info', 'notice', 'warn', 'warning', 'error', 'fatal']
  };

  onDestroy$ = new Subject();

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;
  @ViewChild(MatAccordion) accordion: MatAccordion;

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
      .subscribe(data => {
        this.virtualScrollItems = data;
        this.logsActionShow = this.virtualScrollItems.ids.length > 0;

        if (this.logsActionShow && !this.logsActionItem) {
          this.logsActionItem = this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]];
        }
        this.changeDetector.markForCheck();

        if (this.virtualScrollItems.ids.length > 0 && this.vrFor) {
          this.vrFor.afterReceivingData();
        }
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
        limit: $event?.limit ? $event.limit : 120
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
    this.vrFor.scrollToBottom();
  }

  setFiltersVisibility(show): void {
    this.filtersState.open = show;

    // Trigger resize event so the virtual scroll directive adjust the values for the new height of the list
    window.dispatchEvent(new Event('resize'));
  }

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
