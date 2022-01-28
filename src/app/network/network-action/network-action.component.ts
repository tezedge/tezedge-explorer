import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { debounceTime, filter } from 'rxjs/operators';
import { State } from '@app/app.reducers';
import { NetworkAction } from '@shared/types/network/network-action.type';
import { NetworkActionEntity } from '@shared/types/network/network-action-entity.type';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TezedgeTimeValidator } from '@shared/validators/tezedge-time.validator';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TimePickerComponent } from '@shared/components/time-picker/time-picker.component';

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
  networkActionShow: boolean;
  virtualPageSize = 1000;
  activeFilters = [];

  formGroup: FormGroup;
  currentDatePlaceholder: string;
  initialSelectedIndex: number;

  private overlayRef: OverlayRef;
  private timePickerComponentRef: ComponentRef<TimePickerComponent>;

  constructor(private store: Store<State>,
              private route: ActivatedRoute,
              private overlay: Overlay,
              private ngZone: NgZone,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getNetwork();
    this.initForm();
    this.listenToFormChange();
    this.listenToRouteChange();
    this.listenToNetworkChange();
    this.openTimePicker();
  }

  private getNetwork(): void {
    this.store.dispatch({ type: 'NETWORK_ACTION_RESET' });
    if (this.routeTimestamp) {
      this.triggerNetworkTimeLoad();
    } else {
      this.scrollStart();
    }
  }

  private listenToNetworkChange(): void {
    this.store.select('networkAction')
      .pipe(untilDestroyed(this))
      .subscribe((data: NetworkAction) => {
        this.virtualScrollItems = data;
        this.networkActionShow = this.virtualScrollItems.ids.length > 0;
        this.activeFilters = this.setActiveFilters();

        this.preselectRow();

        this.changeDetector.detectChanges();
      });
  }

  private preselectRow(): void {
    if (
      this.virtualScrollItems.timestamp && this.virtualScrollItems.ids.length && !this.virtualScrollItems.stream
    ) {
      const network: NetworkActionEntity[] = Object.keys(this.virtualScrollItems.entities).map(key => this.virtualScrollItems.entities[key]);
      const timestampToFind = Number(this.routeTimestamp);
      const closestNetworkToTimestamp = network.reduce((prev: NetworkActionEntity, curr: NetworkActionEntity) =>
        Math.abs(curr.timestamp / 1000000 - timestampToFind) < Math.abs(prev.timestamp / 1000000 - timestampToFind)
          ? curr
          : prev);
      if (closestNetworkToTimestamp.originalId !== this.selectedNetworkId) {
        this.selectedNetworkId = closestNetworkToTimestamp.originalId;
        this.getItemDetails(closestNetworkToTimestamp);
        this.initialSelectedIndex = network.findIndex(item => item.id === closestNetworkToTimestamp.id);
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
          if (this.formGroup.get('time').value !== formDateFormat) {
            this.formGroup.get('time').patchValue(formDateFormat);
          }
          this.triggerNetworkTimeLoad();
        } else if (this.formGroup.get('time').value !== '') {
          this.formGroup.get('time').patchValue('');
        }

        this.changeDetector.detectChanges();
      });
  }

  private listenToFormChange(): void {
    this.formGroup.valueChanges.pipe(
      untilDestroyed(this),
      filter(() => this.formGroup.valid),
      debounceTime(200)
    ).subscribe(value => {
      if (value.time) {
        this.scrollStop();
      }
      const date = TezedgeTimeValidator.getDateFormat(value.time.toString());
      const timestamp = value.time.toString() ? date.getTime() : null;
      this.selectedNetworkId = -1;
      this.router.navigate([], {
        queryParams: { timestamp },
        queryParamsHandling: 'merge',
      });
    });
  }

  private triggerNetworkTimeLoad(filterType?: string): void {
    this.store.dispatch({
      type: 'NETWORK_ACTION_TIME_LOAD',
      payload: {
        filterType,
        limit: 500,
        timestamp: this.routeTimestamp
      }
    });
  }

  private initForm(): void {
    this.currentDatePlaceholder = 'e.g: ' + this.getFormDateFormat();
    const urlTimestamp = this.routeTimestamp;
    this.formGroup = this.formBuilder.group({
      time: new FormControl(
        urlTimestamp ? this.getFormDateFormat(Number(urlTimestamp)) : '',
        TezedgeTimeValidator.isTime
      ),
    });
  }

  private getFormDateFormat(timestamp?: number): string {
    const now = timestamp ? new Date(timestamp) : new Date();

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
      this.formGroup.get('time').patchValue('');
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
    if (this.routeTimestamp) {
      this.triggerNetworkTimeLoad(filterType);
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
    return Object.keys(this.virtualScrollItems.filter).reduce((accumulator, term: string) =>
      this.virtualScrollItems.filter[term] ? [...accumulator, term] : accumulator, []
    );
  }

  ngOnDestroy(): void {
    this.detachTooltip();
    this.store.dispatch({ type: 'NETWORK_ACTION_STOP' });
  }

  openTimePicker(event?: MouseEvent): void {
    return;
    this.detachTooltip();

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      // scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event?.target as HTMLElement)
        .withPositions([{
          originX: 'center',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 200
        }])
    });
    event?.stopPropagation();

    const portal = new ComponentPortal(TimePickerComponent);
    this.timePickerComponentRef = this.overlayRef.attach<TimePickerComponent>(portal);
    // this.timePickerComponentRef.instance.date = null;
  }

  detachTooltip(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
