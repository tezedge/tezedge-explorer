import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {VirtualScrollDirective} from '../../shared/virtual-scroll/virtual-scroll.directive';
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
  filtersState = {
    open: true
  };
  virtualPageSize = 1000;
  activeFilters = [];

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
    this.store.dispatch({type: 'NETWORK_ACTION_RESET'});
    this.scrollStart(null);

    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: NetworkAction) => {

        this.virtualScrollItems = data;
        this.networkActionShow = this.virtualScrollItems.ids.length > 0;

        this.activeFilters = this.setActiveFilters();

        this.changeDetector.markForCheck();
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

  getItemDetails($event) {
    if ($event.originalId === undefined) {
      return;
    }

    this.store.dispatch({
      type: 'NETWORK_ACTION_DETAILS_LOAD',
      payload: {
        originalId: $event?.originalId
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
      if (this.virtualScrollItems.activePage.id === Number(this.virtualScrollItems.pages[this.virtualScrollItems.pages.length - 1])) {
        this.scrollStart(event);
      }
    }
  }

  scrollStart($event) {
    if (this.virtualScrollItems && this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'NETWORK_ACTION_START',
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
      type: 'NETWORK_ACTION_STOP'
    });
  }

  scrollToEnd() {
    this.scrollStart(null);
  }

  filterType(filterType) {

    // dispatch action
    this.store.dispatch({
      type: 'NETWORK_ACTION_FILTER',
      payload: filterType
    });

  }

  filterAddress(addressParam) {
    let address = '';

    if (this.virtualScrollItems.urlParams !== addressParam) {
      address = addressParam;
    }

    this.store.dispatch({
      type: 'NETWORK_ACTION_ADDRESS',
      payload: {
        urlParams: address,
      }
    });
  }

  setActiveFilters(): string[] {
    return Object.keys(this.virtualScrollItems.filter)
      .reduce((accumulator, filter) => {
        if (this.virtualScrollItems.filter[filter]) {
          return [
            ...accumulator,
            filter
          ];
        } else {
          return accumulator;
        }
      }, []);
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
