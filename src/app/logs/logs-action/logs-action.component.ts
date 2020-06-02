import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss']
})
export class LogsActionComponent implements OnInit {

  public logsAction;
  public logsActionList = [];
  public logsActionShow;
  public logsActionFilter;

  public endpointsJSONView;

  public tableDataSource;
  public onDestroy$ = new Subject();
  public expandedElement;

  public viewPortGetDataLength
  public viewPortGetElementRef
  public viewPortGetOffsetToRenderedContentStart
  public viewPortGetRenderedRange
  public viewPortGetViewportSize
  public viewPortMeasureRenderedContentSize

  public dataSource = new LogsDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(
    public store: Store<any>,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // triger action and get logs data
    this.store.dispatch({
      type: 'LOGS_ACTION_LOAD',
    });

  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      // const itemSize = 40;
      // const totalItems = 10000;
      // this.viewPort.setTotalContentSize(itemSize * totalItems);
      // this.viewPort.scrollToIndex(1000);
    })


    // listen for scroll events 
    this.viewPort.elementScrolled().subscribe(event => {
      const range = this.viewPort.getRenderedRange();
      // console.log("[elementScrolled] range ", range);
      // this.getScrollStats();
    })

    // wait for data changes from redux
    this.store.select('logsAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.logsAction = data;

        this.logsActionShow = data.ids.length > 0 ? true : false;

        this.logsActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

        this.tableDataSource = new MatTableDataSource<any>(this.logsActionList);
        this.tableDataSource.paginator = this.paginator;

        // set viewport at the end 
        if (this.logsActionList.length > 0) {
          // console.log('[logsAction] lenght', this.logsActionList.length)

          setTimeout(() => {
            this.viewPort.scrollToIndex(this.logsActionList.length)
            // this.viewPort.checkViewportSize()
          })

        }
        // this.viewPort.setRenderedRange({start: 900, end: this.viewPort.getRenderedRange().end + 1});

      });

  }

  onScroll(event) {

    console.log("[onScroll]", event);

    // this.viewPort.setRenderedContentOffset(event);
    // this.viewPort.setRenderedRange({ start: event, end: event + 10 });
    // this.viewPort.setTotalContentSize(30000000);

    this.getScrollStats();

    // triger action and get logs data
    // this.store.dispatch({
    //   type: 'LOGS_ACTION_LOAD',
    //   payload: event,
    // });

  }

  getScrollStats() {


    this.viewPortGetDataLength = this.viewPort.getDataLength()
    this.viewPortGetOffsetToRenderedContentStart = this.viewPort.getOffsetToRenderedContentStart()
    this.viewPortGetRenderedRange = this.viewPort.getRenderedRange()
    this.viewPortGetViewportSize = this.viewPort.getViewportSize()
    this.viewPortMeasureRenderedContentSize = this.viewPort.measureRenderedContentSize()

  }

  scrollToEnd() {
    this.viewPort.scrollToIndex(this.logsActionList.length);
  }

}

// add data spurce for table
export class LogsDataSource extends DataSource<string | undefined> {
  private length = 10000;
  private pageSize = 100;
  private cachedData = Array.from<string>({ length: this.length });
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(string | undefined)[]>(this.cachedData);
  private subscription = new Subscription();

  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage = this.getPageForIndex(range.start);
      const endPage = this.getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i);
      }
    }));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number) {

    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.cachedData.splice(page * this.pageSize, this.pageSize,
      ...Array.from({ length: this.pageSize })
        .map((_, i) => `log #${page * this.pageSize + i}`));
    console.log('[cachedData]', this.cachedData);
    
    this.dataStream.next(this.cachedData);
  }
}