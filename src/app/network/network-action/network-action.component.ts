import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-network-action',
  templateUrl: './network-action.component.html',
  styleUrls: ['./network-action.component.scss']
})
export class NetworkActionComponent implements OnInit {

  public networkAction
  public networkActionList = []
  public networkActionShow

  public onDestroy$ = new Subject()
  public expandedElement
  public networkJSONView

  public ITEM_SIZE = 36;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(
    public store: Store<any>,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.activeRoute.params
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {

        // triger action and get network data
        this.store.dispatch({
          type: 'NETWORK_ACTION_LOAD',
          payload: params.address ? params.address : '',
        });

      });

    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkAction = data;

        this.networkActionShow = data.ids.length > 0 ? true : false;
        this.networkActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

        // set viewport at the end
        if (this.networkActionShow) {

          const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
            this.viewPort.getRenderedRange() : { start: 0, end: 0 };
          const viewPortItemLength = this.networkActionList.length;

          // trigger only if we are streaming and not at the end of page
          if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
            (viewPortRange.start !== viewPortRange.end)) {
            // console.log('[set][scrollToOffset] ', data.stream, this.networkActionList.length, viewPortItemLength, viewPortRange);

            setTimeout(() => {
              const offset = this.ITEM_SIZE * this.networkActionList.length;
              this.viewPort.scrollToOffset(offset);
            });

          }

        }

      });

  }

  expandedDetail(row) {
    // this.storageActionDetail = this.storageActionDetail ? false : true;
    console.log('[network][action] expandedDetail', this.networkAction, row);
  }

  filterType(filterType) {

    // dispatch action
    this.store.dispatch({
      type: 'NETWORK_ACTION_FILTER',
      payload: filterType,
    });

  }

  filterAddress() {

    // remove address and route to default network url 
    this.router.navigate(['network'])

  }


  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  onScroll(index) {

    if (this.networkActionList.length - index > 15) {
      // console.warn('[onScroll][stop] length', index, this.networkActionList.length, this.networkActionList.length - index);
      // stop log actions stream
      this.store.dispatch({
        type: 'NETWORK_ACTION_STOP',
        payload: event,
      });
    } else {
      // console.warn('[onScroll][start] length', index, this.networkActionList.length, this.networkActionList.length - index);
      // start log actions stream
      this.store.dispatch({
        type: 'NETWORK_ACTION_START',
        payload: event,
      });
    }

  }

  scrollStart() {

    // triger action and get action data
    this.store.dispatch({
      type: 'NETWORK_ACTION_START'
    });

  }

  scrollStop() {

    // stop streaming actions
    this.store.dispatch({
      type: 'NETWORK_ACTION_STOP'
    });

  }

  scrollToEnd() {

    const offset = this.ITEM_SIZE * this.networkActionList.length;
    this.viewPort.scrollToOffset(offset);

  }

}
