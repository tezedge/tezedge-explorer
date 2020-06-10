import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss']
})
export class LogsActionComponent implements OnInit, OnDestroy {

  public logsAction;
  public logsActionList = [];
  public logsActionItem
  public logsActionShow;

  public onDestroy$ = new Subject();

  public ITEM_SIZE = 36;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(
    public store: Store<any>,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    // triger action and get logs data
    this.store.dispatch({
      type: 'LOGS_ACTION_LOAD',
    });

    // wait for data changes from redux
    this.store.select('logsAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.logsAction = data;
        this.logsActionShow = data.ids.length > 0 ? true : false;
        
        this.logsActionList = data.ids.map(id => ({ id, ...data.entities[id] }));
        
        // set viewport at the end
        if (this.logsActionShow) {

          const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
            this.viewPort.getRenderedRange() : { start: 0, end: 0 };
          const viewPortItemLength = this.logsActionList.length;
          // trigger only if we are streaming and not at the end of page
          if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
            (viewPortRange.start !== viewPortRange.end)) {
            // console.log('[set][scrollToOffset] ', data.stream, this.logsActionList.length, viewPortItemLength, viewPortRange);

            setTimeout(() => {
              const offset = this.ITEM_SIZE * this.logsActionList.length;
              // set scroll
              this.viewPort.scrollToOffset(offset);
              // set hover
              this.logsActionItem = this.logsActionList[this.logsActionList.length - 1];
            });

          }

        }
      });

  }
  
  onScroll(index) {

    if (this.logsActionList.length - index > 15) {
      // stop log actions stream
      this.store.dispatch({
        type: 'LOGS_ACTION_STOP',
        payload: event,
      });
    } else {
      // start log actions stream
      this.store.dispatch({
        type: 'LOGS_ACTION_START',
        payload: event,
      });
    }

  }

  scrollStart() {

    // triger action and get logs data
    this.store.dispatch({
      type: 'LOGS_ACTION_START',
    });

  }

  scrollStop() {

    // stop streaming logs actions
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP',
    });

  }
  
  scrollToEnd() {

    const offset = this.ITEM_SIZE * this.logsActionList.length;
    this.viewPort.scrollToOffset(offset);
  
  }
  
  tableMouseEnter(item) {

    this.logsActionItem = item

  }

  ngOnDestroy() {

    // stop logs stream
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP',
    });

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  
}
