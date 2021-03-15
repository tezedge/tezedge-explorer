import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {VirtualScrollDirective} from '../../shared/virtual-scroll.directive';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-network-action',
  templateUrl: './network-action.component.html',
  styleUrls: ['./network-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkActionComponent implements OnInit, OnDestroy {

  virtualScrollItems;
  networkActionShow: boolean;
  networkActionItem;
  filtersState = {
    open: true,
    availableFields: []
  };

  onDestroy$ = new Subject();

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    public store: Store<any>,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.scrollStart(null);

    // this.activeRoute.params
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe((params) => {
    //
    //     // triger action and get network data
    //     this.store.dispatch({
    //       type: 'NETWORK_ACTION_LOAD',
    //       payload: {
    //         filter: params.address ? params.address : ''
    //       }
    //     });
    //
    //   });

    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        // this.networkAction = data;
        this.virtualScrollItems = data;
        this.networkActionShow = this.virtualScrollItems.ids.length > 0;

        // if (this.networkActionShow && !this.networkActionItem) {
        this.networkActionItem = this.virtualScrollItems.ids.length > 0 ?
          this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]] :
          null;
        // }

        console.log(this.virtualScrollItems);

        this.changeDetector.markForCheck();
        //
        // if (this.virtualScrollItems.ids.length > 0 && this.vrFor) {
        //   this.vrFor.afterReceivingData();
        // }
      });

  }

  getItems($event) {
    this.store.dispatch({
      type: 'NETWORK_ACTION_LOAD',
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
        limit: $event?.limit ? $event.limit : 60
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
    this.ngZone.runOutsideAngular(() => {
      if (this.networkActionItem && this.networkActionItem.id === item.id) {
        return;
      }

      this.ngZone.run(() => {
        this.networkActionItem = item;
      });
    });
  }

  showTab(tab): boolean {
    if (!this.networkActionItem) {
      return false;
    }

    switch (true) {
      case tab === 'JSON':
        return !!(this.networkActionItem?.payload && JSON.stringify(this.networkActionItem?.payload) !== '[]' && JSON.stringify(this.networkActionItem?.payload) !== '{}');

      case tab === 'HEX':
        return !!(this.networkActionItem?.original_bytes && this.networkActionItem?.original_bytes.length);

      case tab === 'ERROR':
        return !!(this.networkActionItem?.error && this.networkActionItem?.error[0]);

      default:
        return false;
    }
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
