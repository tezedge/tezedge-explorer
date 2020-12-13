import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VirtualScrollDirective } from '../../shared/virtual-scroll.directive';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-network-action',
  templateUrl: './network-action.component.html',
  styleUrls: ['./network-action.component.scss']
})
export class NetworkActionComponent implements OnInit, OnDestroy {

  virtualScrollItems;
  networkActionShow;
  networkActionItem;
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
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.scrollStart(null);

    this.activeRoute.params
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {

        // triger action and get network data
        this.store.dispatch({
          type: 'NETWORK_ACTION_LOAD',
          payload: {
            filter: params.address ? params.address : ''
          }
        });

      });

    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        // this.networkAction = data;
        this.virtualScrollItems = data;
        this.networkActionShow = this.virtualScrollItems.ids.length > 0;

        if (this.virtualScrollItems.ids.length > 0 && this.vrFor) {
          this.vrFor.afterReceivingData();
        }

        // this.networkActionList = data.ids.map(id => ({ id, ...data.entities[id] }));
        //
        // // set viewport at the end
        // if (this.networkActionShow) {
        //
        //   const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
        //     this.viewPort.getRenderedRange() : { start: 0, end: 0 };
        //   const viewPortItemLength = this.networkActionList.length;
        //
        //   // set hover
        //   this.networkActionItem = this.networkActionList[this.networkActionList.length - 1];
        //
        //   // trigger only if we are streaming and not at the end of page
        //   if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
        //     (viewPortRange.start !== viewPortRange.end)) {
        //     // console.log('[set][scrollToOffset] ', data.stream, this.networkActionList.length, viewPortItemLength, viewPortRange);
        //
        //     setTimeout(() => {
        //       const offset = this.ITEM_SIZE * this.networkActionList.length;
        //       // set scroll
        //       this.viewPort.scrollToOffset(offset);
        //     });
        //
        //   }
        //
        // }

      });

  }

  getItems($event) {
    this.store.dispatch({
      type: 'NETWORK__ACTION_LOAD',
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
      type: 'NETWORK_ACTION_START',
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
      type: 'NETWORK_ACTION_STOP'
    });
  }

  scrollToEnd() {
    this.vrFor.scrollToBottom();
  }

  filterType(filterType) {

    // dispatch action
    this.store.dispatch({
      type: 'NETWORK_ACTION_FILTER',
      payload: filterType
    });

  }

  filterAddress() {

    // remove address and route to default network url
    this.router.navigate(['network']);

  }

  tableMouseEnter(item) {

    // this.networkActionItem = item;

  }

  ngOnDestroy() {

    // stop streaming actions
    this.store.dispatch({
      type: 'NETWORK_ACTION_STOP'
    });

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }
}
