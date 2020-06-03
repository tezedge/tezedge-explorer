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
  public logsActionListCache = [];
  public logsActionShow;
  public logsActionFilter;

  public endpointsJSONView;

  public tableDataSource;
  public onDestroy$ = new Subject();
  public expandedElement;

  public viewPortGetDataLength;
  public viewPortGetElementRef;
  public viewPortGetOffsetToRenderedContentStart;
  public viewPortGetRenderedRange;
  public viewPortGetViewportSize;
  public viewPortMeasureRenderedContentSize;
  public ITEM_SIZE = 36;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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

        // set viewport at the end
        if (this.logsActionShow) {

          this.logsActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

          this.tableDataSource = new MatTableDataSource<any>(this.logsActionList);
          this.tableDataSource.paginator = this.paginator;

          const viewPortRange = this.viewPort.getRenderedRange();
          const viewPortItemLength = this.logsActionList.length;
          // trigger only if we are streaming and not at the end of page
          if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
            (viewPortRange.start !== viewPortRange.end)) {
            console.log('[set][scrollToOffset] ', data.stream, this.logsActionList.length, viewPortItemLength, viewPortRange);

            setTimeout(() => {
              const offset = this.ITEM_SIZE * this.logsActionList.length;
              this.viewPort.scrollToOffset(offset);
            });

          }

        }
      });

  }

  start() {

    // triger action and get logs data
    this.store.dispatch({
      type: 'LOGS_ACTION_START',
      // payload: event,
    });

  }

  stop() {

    // stop streaming logs actions
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP',
      // payload: event,
    });

  }

  ngOnDestroy() {

    // stop logs stream
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP',
    });

  }


  onScroll(index) {

    if (this.logsActionList.length - index > 16) {
      // console.warn('[onScroll][stop] length', index, this.logsActionList.length, this.logsActionList.length - index);
      // stop log actions stream
      this.store.dispatch({
        type: 'LOGS_ACTION_STOP',
        payload: event,
      });
    } else {
      // console.warn('[onScroll][start] length', index, this.logsActionList.length, this.logsActionList.length - index);
      // start log actions stream
      this.store.dispatch({
        type: 'LOGS_ACTION_START',
        payload: event,
      });
    }

  }

  scrollToEnd() {
    const offset = this.ITEM_SIZE * this.logsActionList.length;
    this.viewPort.scrollToOffset(offset);
  }

  getScrollStats() {

    this.viewPortGetDataLength = this.viewPort.getDataLength();
    this.viewPortGetOffsetToRenderedContentStart = this.viewPort.getOffsetToRenderedContentStart();
    this.viewPortGetRenderedRange = this.viewPort.getRenderedRange();
    this.viewPortGetViewportSize = this.viewPort.getViewportSize();
    this.viewPortMeasureRenderedContentSize = this.viewPort.measureRenderedContentSize();

  }

}
