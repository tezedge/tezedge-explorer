import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Store} from '@ngrx/store';
import {Observable, Subject, Subscription} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {VirtualScrollDirective} from '../../shared/virtual-scroll.directive';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsActionComponent implements OnInit, OnDestroy {

  logsDataSource: LogsDataSource;
  private logsAction$: Observable<any>;
  virtualScrollItems;
  logsActionList: Array<any> = [];
  logsActionItem; // TODO type log - define an interface for log
  logsActionShow: boolean;
  ITEM_SIZE = 36;

  onDestroy$ = new Subject();

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;

  constructor(
    public store: Store<any>,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.store.dispatch({
      type: 'LOGS_ACTION_LOAD',
    });

    // wait for data changes from redux
    this.store.select('logsAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.virtualScrollItems = data;
        this.logsActionShow = data.ids.length > 0;

        // this.logsActionList = data.ids.map(id => ({id, ...data.entities[id]}));

        // set viewport at the end
        // if (this.logsActionShow) {
        //
        //   const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
        //     this.viewPort.getRenderedRange() : {start: 0, end: 0};
        //   const viewPortItemLength = this.logsActionList.length;
        //
        //   // set hover
        //   this.logsActionItem = this.logsActionList[this.logsActionList.length - 1];
        //
        //   // trigger only if we are streaming and not at the end of page
        //   if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
        //     (viewPortRange.start !== viewPortRange.end)) {
        //     // console.log('[set][scrollToOffset] ', data.stream, this.logsActionList.length, viewPortItemLength, viewPortRange);
        //
        //     setTimeout(() => {
        //       const offset = this.ITEM_SIZE * this.logsActionList.length;
        //       // set scroll
        //       this.viewPort.scrollToOffset(offset);
        //
        //     });
        //
        //   }
        //
        // }
      });

    this.logsAction$ = this.store.select('logsAction');
    this.logsDataSource = new LogsDataSource(this.logsAction$, this.store);
  }

  onScroll(index) {
    // if (this.logsActionList.length - index > 15) {
    //   this.store.dispatch({
    //     type: 'LOGS_ACTION_STOP',
    //     payload: event,
    //   });
    // } else {
    //   this.store.dispatch({
    //     type: 'LOGS_ACTION_START',
    //     payload: event,
    //   });
    // }
  }

  scrollStart() {
    // trigger action and get logs data
    this.store.dispatch({
      type: 'LOGS_ACTION_START',
    });
  }

  scrollStop() {
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP',
    });
  }

  scrollToEnd() {
    this.vrFor.scrollToBottom();
    // const offset = this.ITEM_SIZE * this.logsActionList.length;
    // this.viewPort.scrollToOffset(offset);
  }

  tableMouseEnter(item) {
    this.logsActionItem = item;
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

//
export class LogsDataSource extends DataSource<any> {

  private subscription = new Subscription();
  private dataRange = {start: 0, end: 0};

  constructor(
    private logsAction$: Observable<any>,
    private store: Store<any>,
  ) {
    super();
  }


  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
//
    this.subscription.add(collectionViewer.viewChange
      .pipe(
        filter(range => {
          return range.end > this.dataRange.end || range.start < this.dataRange.start;
        })
      )
      .subscribe(vsRange => {
        console.log(vsRange);
        this.store.dispatch({
          type: 'LOGS_ACTION_LOAD',
          payload: {
            cursorId: vsRange.end
          }
        });

      }));

    return this.logsAction$.pipe(
      filter(data => data.ids.length > 0),
      map(data => {
        const logsActionList = data.ids.map(id => ({id, ...data.entities[id]}));

        this.dataRange = {
          start: data.ids[0],
          end: data.ids[data.ids.length - 1]
        };

        return logsActionList;
      })
    );
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }
}
