import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogsAction } from '../../shared/types/logs/logs-action.type';
import { LogsActionEntity } from '../../shared/types/logs/logs-action-entity.type';
import { State } from '../../app.reducers';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TezedgeTimeValidator } from '../../shared/validators/tezedge-time.validator';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsActionComponent implements OnInit, OnDestroy {

  virtualScrollItems: LogsAction;
  logsActionItem: LogsActionEntity;
  logsActionShow: boolean;
  filtersState = {
    open: true
  };
  virtualPageSize = 1000;
  activeFilters = [];

  formGroup: FormGroup;
  currentDatePlaceholder: string;
  initialSelectedIndex: number;

  constructor(private store: Store<State>,
              private changeDetector: ChangeDetectorRef,
              private ngZone: NgZone,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getLogs();
    this.initForm();
    this.listenToFormChange();
    this.listenToRouteChange();
    this.selectLogs();
  }

  private getLogs(): void {
    this.store.dispatch({ type: 'LOGS_ACTION_RESET' });
    if (this.routeTimestamp) {
      this.triggerLogsTimeLoad();
    } else {
      this.scrollStart();
    }
  }

  private selectLogs(): void {
    this.store.select('logsAction')
      .pipe(untilDestroyed(this))
      .subscribe((data: LogsAction) => {
        this.virtualScrollItems = data;
        this.logsActionShow = this.virtualScrollItems.ids.length > 0;

        this.activeFilters = this.setActiveFilters();

        if (this.logsActionShow && !this.logsActionItem) {
          this.logsActionItem = this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]];
        }
        this.preselectRow();

        this.changeDetector.detectChanges();
      });
  }

  private preselectRow(): void {
    if (this.virtualScrollItems.timestamp && this.virtualScrollItems.ids.length) {
      const currentLogs = Object.keys(this.virtualScrollItems.entities).map(key => this.virtualScrollItems.entities[key]);
      const timestampToFind = Number(this.virtualScrollItems.timestamp);
      const closestLogToTimestamp = currentLogs.reduce((prev: LogsActionEntity, curr: LogsActionEntity) =>
        Math.abs(Math.floor(curr.timestamp / 1000000) - timestampToFind) < Math.abs(Math.floor(prev.timestamp / 1000000) - timestampToFind)
          ? curr
          : prev);
      this.logsActionItem = undefined;
      this.selectRow(closestLogToTimestamp);
      this.initialSelectedIndex = currentLogs.findIndex(log => log.id === this.logsActionItem.id);
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
          this.triggerLogsTimeLoad();
        } else {
          this.formGroup.get('time').patchValue('');
        }

        this.changeDetector.detectChanges();
      });
  }

  private triggerLogsTimeLoad(filterType?: string): void {
    this.store.dispatch({
      type: 'LOGS_ACTION_TIME_LOAD',
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

  private listenToFormChange(): void {
    this.formGroup.valueChanges.pipe(
      untilDestroyed(this),
      filter(() => this.formGroup.valid),
    ).subscribe(value => {
      this.scrollStop();
      const date = TezedgeTimeValidator.getDateFormat(value.time.toString());
      const timestamp = value.time.toString() ? date.getTime() : null;
      this.router.navigate([], {
        queryParams: { timestamp },
        queryParamsHandling: 'merge',
      });
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
      type: 'LOGS_ACTION_LOAD',
      payload: {
        cursor_id: params.nextCursorId,
        limit: params.limit
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

  startStopDataStream(value: { stop: boolean, limit: number }): void {
    if (value.stop) {
      this.scrollStop();
    } else {
      this.scrollStart(value);
    }
  }

  scrollStart(value?: { stop: boolean, limit: number }): void {
    if (this.virtualScrollItems && this.virtualScrollItems.stream) {
      return;
    }

    if (this.routeTimestamp) {
      this.formGroup.get('time').patchValue('');
    }

    this.logsActionItem = undefined;

    this.store.dispatch({
      type: 'LOGS_ACTION_START',
      payload: {
        limit: value ? value.limit : this.virtualPageSize
      }
    });
  }

  scrollStop(): void {
    if (!this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({ type: 'LOGS_ACTION_STOP' });
  }

  scrollToEnd(): void {
    this.scrollStart();
  }

  // setFiltersVisibility(show): void {
  //   this.filtersState.open = show;
  //
  //   // Trigger resize event so the virtual scroll directive adjust the values for the new height of the list
  //   window.dispatchEvent(new Event('resize'));
  // }

  filterByType(filterType: string): void {
    if (this.routeTimestamp) {
      this.triggerLogsTimeLoad(filterType);
    } else {
      this.store.dispatch({
        type: 'LOGS_ACTION_FILTER',
        payload: { filterType }
      });
    }
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

  setActiveFilters(): string[] {
    return Object.keys(this.virtualScrollItems.filter)
      .reduce((accumulator, term) =>
        this.virtualScrollItems.filter[term] ? [...accumulator, term] : accumulator, []
      );
  }

  selectRow(log: LogsActionEntity): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.logsActionItem && this.logsActionItem.originalId === log.originalId) {
        return;
      }

      this.ngZone.run(() => {
        this.logsActionItem = log;
      });
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: 'LOGS_ACTION_STOP' });
  }
}
