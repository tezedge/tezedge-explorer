import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { State } from '@app/app.index';
import { NetworkAction } from '@shared/types/network/network-action.type';
import { NetworkActionEntity } from '@shared/types/network/network-action-entity.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TimePickerComponent } from '@shared/components/time-picker/time-picker.component';
import { Subscription } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-network-action',
  templateUrl: './network-action.component.html',
  styleUrls: ['./network-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkActionComponent implements OnInit, OnDestroy {

  virtualScrollItems: NetworkAction;
  selectedNetworkId: number = -1;
  virtualPageSize = 1000;
  activeFilters = [];

  initialSelectedIndex: number;
  dateUserFormat: string;

  private overlayRef: OverlayRef;
  private timePickerComponentRef: ComponentRef<TimePickerComponent>;
  private timePickerSubmitSubscription: Subscription;
  private timePickerCancelSubscription: Subscription;

  constructor(private store: Store<State>,
              private route: ActivatedRoute,
              private overlay: Overlay,
              private ngZone: NgZone,
              private router: Router,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getNetwork();
    this.initDateUserTimeFormat();
    this.listenToRouteChange();
    this.listenToNetworkChange();
  }

  private getNetwork(): void {
    this.store.dispatch({ type: 'NETWORK_ACTION_RESET' });
    if (this.routeTimestamp) {
      this.triggerNetworkTimeLoad(this.routeTimestamp);
    } else {
      this.scrollStart();
    }
  }

  private listenToNetworkChange(): void {
    this.store.select('networkAction')
      .pipe(untilDestroyed(this))
      .subscribe((data: NetworkAction) => {
        this.virtualScrollItems = data;
        this.activeFilters = this.setActiveFilters();
        // console.log(data.selected);
        // this.preselectRow();

        this.changeDetector.detectChanges();
      });
  }

  private preselectRow(): void {
    if (
      this.virtualScrollItems.timestamp && this.virtualScrollItems.ids.length && !this.virtualScrollItems.stream && !this.virtualScrollItems.selected
    ) {
      const network: NetworkActionEntity[] = Object.keys(this.virtualScrollItems.entities).map(key => this.virtualScrollItems.entities[key]);
      const timestampToFind = Number(this.routeTimestamp);
      const closestNetworkRowToTimestamp = network.reduce((prev: NetworkActionEntity, curr: NetworkActionEntity) =>
        Math.abs(curr.timestamp / 1000000 - timestampToFind) < Math.abs(prev.timestamp / 1000000 - timestampToFind)
          ? curr
          : prev);
      if (closestNetworkRowToTimestamp.originalId !== this.selectedNetworkId) {
        this.selectedNetworkId = closestNetworkRowToTimestamp.originalId;
        this.getItemDetails(closestNetworkRowToTimestamp);
        this.initialSelectedIndex = network.findIndex(item => item.id === closestNetworkRowToTimestamp.id);
      }
    } else {
      this.initialSelectedIndex = undefined;
    }
  }

  private listenToRouteChange(): void {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(ev => ev instanceof NavigationEnd),
      )
      .subscribe(() => {
        const urlTimestamp = this.routeTimestamp;
        if (urlTimestamp) {
          const formDateFormat = this.getFormDateFormat(Number(urlTimestamp));
          if (this.dateUserFormat !== formDateFormat) {
            this.dateUserFormat = formDateFormat;
          }
          this.triggerNetworkTimeLoad(urlTimestamp);
        } else if (this.dateUserFormat) {
          this.dateUserFormat = undefined;
        }

        this.changeDetector.detectChanges();
      });
  }

  private triggerNetworkTimeLoad(timestamp: number, filterType?: string): void {
    this.store.dispatch({
      type: 'NETWORK_ACTION_TIME_LOAD',
      payload: {
        filterType,
        limit: 500,
        timestamp
      }
    });
  }

  private initDateUserTimeFormat(): void {
    this.dateUserFormat = this.getFormDateFormat(this.routeTimestamp);
  }

  private getFormDateFormat(timestamp?: number): string | undefined{
    if (!timestamp) {
      return undefined;
    }
    const now = new Date(timestamp);

    const twoDigit = (val) => val < 10 ? `0${val}` : val;
    const threeDigit = (val) => Number(val) < 100 ? `0${val}` : val;

    return twoDigit(now.getHours())
      + ':' + twoDigit(now.getMinutes())
      + ':' + twoDigit(now.getSeconds())
      + '.' + threeDigit(twoDigit(now.getMilliseconds()))
      + ', ' + twoDigit(now.getDate())
      + ' ' + now.toLocaleString('default', { month: 'short' })
      + ' ' + now.getFullYear().toString().substring(2);
  }

  private get routeTimestamp(): number {
    return Number(this.route.snapshot.queryParams['timestamp']);
  }

  getItems(params: { nextCursorId: number, limit: number }): void {
    this.store.dispatch({
      type: 'NETWORK_ACTION_LOAD',
      payload: {
        cursor_id: params.nextCursorId,
        limit: params.limit
      }
    });
  }

  getItemDetails(networkItem: NetworkActionEntity): void {
    if (networkItem.originalId === undefined) {
      return;
    }
    this.store.dispatch({
      type: 'NETWORK_ACTION_DETAILS_LOAD',
      payload: {
        originalId: networkItem?.originalId
      }
    });
  }

  loadPreviousPage(): void {
    if (this.virtualScrollItems.stream) {
      this.scrollStop();
    }
    this.getItems({
      nextCursorId: this.virtualScrollItems.activePage.start.originalId,
      limit: this.virtualPageSize
    });
  }

  loadNextPage(): void {
    const actualPageIndex = this.virtualScrollItems.pages.findIndex(pageId => pageId === this.virtualScrollItems.activePage.id);

    if (actualPageIndex === this.virtualScrollItems.pages.length - 1) {
      return;
    }

    const nextPageId = this.virtualScrollItems.pages[actualPageIndex] + this.virtualPageSize;

    this.getItems({
      nextCursorId: nextPageId,
      limit: this.virtualPageSize
    });
  }

  loadFirstPage(): void {
    if (this.virtualScrollItems.stream) {
      this.scrollStop();
    }

    this.getItems({
      nextCursorId: this.virtualPageSize - 2,
      limit: this.virtualPageSize
    });
  }

  loadLastPage(): void {
    const nextPageId = this.virtualScrollItems.pages[this.virtualScrollItems.pages.length - 1];

    this.getItems({
      nextCursorId: nextPageId,
      limit: this.virtualPageSize
    });
  }

  startStopDataStream(value: { stop: boolean, limit: number }): void {
    if (value.stop) {
      this.scrollStop();
    } else {
      // if (this.virtualScrollItems.activePage.id === Number(this.virtualScrollItems.pages[this.virtualScrollItems.pages.length - 1])) {
      this.scrollStart(value);
      // }
    }
  }

  scrollStart(value?: { stop: boolean, limit: number }): void {
    if (this.virtualScrollItems && this.virtualScrollItems.stream) {
      return;
    }

    if (this.routeTimestamp) {
      this.dateUserFormat = undefined;
    }

    this.selectedNetworkId = -1;
    this.store.dispatch({
      type: 'NETWORK_ACTION_START',
      payload: {
        limit: value ? value.limit : this.virtualPageSize
      }
    });
  }

  scrollStop(): void {
    if (!this.virtualScrollItems.stream) {
      return;
    }
    this.store.dispatch({ type: 'NETWORK_ACTION_STOP' });
  }

  scrollToEnd(): void {
    this.scrollStart();
  }

  filterByType(filterType: string): void {
    const routeTimestamp = this.routeTimestamp;
    if (routeTimestamp) {
      this.triggerNetworkTimeLoad(routeTimestamp, filterType);
    } else {
      this.store.dispatch({
        type: 'NETWORK_ACTION_FILTER',
        payload: { filterType }
      });
    }
  }

  filterAddress(addressParam): void {
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
    return Object.keys(this.virtualScrollItems.filter).reduce((accumulator: string[], term: string) =>
      this.virtualScrollItems.filter[term] ? [...accumulator, term] : accumulator, []
    );
  }

  openTimePicker(event?: MouseEvent): void {
    this.detachTooltip();

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event?.target as HTMLElement)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: -10,
          offsetY: -50
        }])
    });
    event?.stopPropagation();

    const portal = new ComponentPortal(TimePickerComponent);
    this.timePickerComponentRef = this.overlayRef.attach<TimePickerComponent>(portal);
    this.timePickerComponentRef.instance.timestamp = this.routeTimestamp;
    this.timePickerSubmitSubscription = this.timePickerComponentRef.instance.onSubmit
      .subscribe((timestamp: number) => {
        this.detachTooltip();
        this.scrollStop();
        this.selectedNetworkId = -1;
        this.router.navigate([], {
          queryParams: { timestamp },
          queryParamsHandling: 'merge',
        });
        this.triggerNetworkTimeLoad(timestamp);
      });
    this.timePickerCancelSubscription = this.timePickerComponentRef.instance.onCancel
      .subscribe(() => this.detachTooltip());
  }

  detachTooltip(): void {
    if (this.overlayRef?.hasAttached()) {
      this.timePickerSubmitSubscription?.unsubscribe();
      this.timePickerCancelSubscription?.unsubscribe();
      this.overlayRef.detach();
    }
  }

  removeDateFilter(event: MouseEvent): void {
    event.stopPropagation();
    this.dateUserFormat = undefined;
    this.router.navigate([], {
      queryParams: { timestamp: undefined },
      queryParamsHandling: 'merge',
    });
    this.scrollStart();
  }

  ngOnDestroy(): void {
    this.detachTooltip();
    this.store.dispatch({ type: 'NETWORK_ACTION_STOP' });
  }
}
