import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {VirtualScrollDirective} from '../../shared/virtual-scroll.directive';
import {MatAccordion} from '@angular/material/expansion';
import {State} from '../../app.reducers';
import {NetworkAction} from '../../shared/types/network/network-action.type';

@Component({
  selector: 'app-network-action',
  templateUrl: './network-action.component.html',
  styleUrls: ['./network-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkActionComponent implements OnInit, OnDestroy {

  virtualScrollItems: NetworkAction;
  networkActionShow: boolean;
  networkActionItem;
  pagesIdsList: any[];
  filtersState = {
    open: true,
    availableFields: []
  };
  virtualPageSize = 1000;
  
  onDestroy$ = new Subject();

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    public store: Store<State>,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    // this.scrollStart(null);
    this.getItems({limit: 1000});

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
      .subscribe((data: NetworkAction) => {

        // this.networkAction = data;
        this.virtualScrollItems = data;
        this.networkActionShow = this.virtualScrollItems.ids.length > 0;

        this.pagesIdsList = Object.keys(this.virtualScrollItems.pages);
        console.log(this.pagesIdsList);

        // if (this.networkActionShow && !this.networkActionItem) {
        // this.networkActionItem = this.virtualScrollItems.ids.length > 0 ?
        //   this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]] :
        //   null;
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

  loadPreviousPage() {
    this.getItems({
      nextCursorId: this.virtualScrollItems.activePage.start.originalId,
      limit: 1000
    });
  }

  loadNextPage() {
    debugger;
    const actualPageIndex = this.pagesIdsList.findIndex(pageId => Number(pageId) === this.virtualScrollItems.activePage.id);

    if (actualPageIndex === this.pagesIdsList.length - 1) {
      return;
    }

    const nextPageId = this.pagesIdsList[actualPageIndex + 1];

    this.getItems({
      nextCursorId: nextPageId,
      limit: 1000
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
        limit: $event?.limit ? $event.limit : 1000
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
