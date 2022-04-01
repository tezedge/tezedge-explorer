import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, filter, skip } from 'rxjs/operators';
import {
  SYSTEM_RESOURCES_CLOSE,
  SYSTEM_RESOURCES_DETAILS_UPDATE, SYSTEM_RESOURCES_LOAD,
  SystemResourcesCloseAction,
  SystemResourcesDetailsUpdateAction,
  SystemResourcesLoadAction
} from './system-resources.actions';
import { SystemResourcesState } from '@shared/types/resources/system/system-resources-state.type';
import { appState } from '@app/app.reducer';
import { SystemResourcesResourceType } from '@shared/types/resources/system/system-resources-panel.type';
import { SystemResourceCategory } from '@shared/types/resources/system/system-resource-category.type';
import { SystemResourcesGraphComponent } from '@resources/system-resources-graph/system-resources-graph.component';
import { TezedgeChartsService } from '@shared/components/custom-tezedge-components/tezedge-charts/tezedge-charts.service';
import { systemResources } from '@resources/system-resources/system-resources.reducer';
import { MIN_WIDTH_1100 } from '@shared/constants/breakpoint-observer';


@UntilDestroy()
@Component({
  selector: 'app-system-resources',
  templateUrl: './system-resources.component.html',
  styleUrls: ['./system-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesComponent implements OnInit, OnDestroy {

  systemResource: SystemResourcesState;
  activeSummary: SystemResourcesResourceType = 'cpu';

  readonly yAxisPercentageConversion = (value) => `${value}%`;
  readonly yAxisGigaBytesConversion = (value) => `${value} GB`;
  readonly yAxisMegaBytesConversion = (value) => `${value} MB`;

  private graphs: QueryList<ElementRef>;
  private resourceTypes: SystemResourcesResourceType[] = ['cpu', 'memory', 'io', 'network', 'storage'];
  private isSmallDevice: boolean;
  private listenersInitialized: boolean;

  @ViewChildren(SystemResourcesGraphComponent, { read: ElementRef, emitDistinctChangesOnly: true })
  set content(content: QueryList<ElementRef>) {
    if (content) {
      this.graphs = content;
      if (this.graphs?.length && !this.listenersInitialized) {
        this.listenersInitialized = true;
        this.listenToGraphsHover();
      }
    }
  }

  constructor(private zone: NgZone,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              private tezedgeChartsService: TezedgeChartsService) { }

  ngOnInit(): void {
    this.handleSmallDevices();
    this.listenToResourcesChange();
  }

  private listenToGraphsHover(): void {
    this.zone.runOutsideAngular(() => {
      this.graphs.forEach((graph, i) => {
        fromEvent(graph.nativeElement, 'mouseenter')
          .pipe(
            untilDestroyed(this),
            filter(() => this.activeSummary !== this.resourceTypes[i])
          )
          .subscribe(() => {
            this.toggleActiveSummary(this.resourceTypes[i], this.systemResource[this.resourceTypes[i]]);
          });
      });
    });
  }

  private toggleActiveSummary(value: SystemResourcesResourceType, resource: SystemResourceCategory): void {
    this.activeSummary = value;
    this.zone.run(() =>
      this.tezedgeChartsService.updateSystemResources({
        type: 'recently',
        resourceType: value,
        timestamp: resource.series[0].series[resource.series[0].series.length - 1].name
      })
    );
  }

  private listenToResourcesChange(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(systemResources),
      filter(resources => !!resources.xTicksValues),
    ).subscribe(resources => {
      this.systemResource = resources;
      this.activeSummary = resources.resourcesPanel?.resourceType;
      this.cdRef.detectChanges();
    });

    this.store.pipe(
      untilDestroyed(this),
      select(appState),
      delay(400)
    ).subscribe(() => this.getResources());

    this.tezedgeChartsService.storeSubject$()
      .pipe(untilDestroyed(this))
      .subscribe(payload => {
        this.zone.run(() =>
          this.store.dispatch<SystemResourcesDetailsUpdateAction>({
            type: SYSTEM_RESOURCES_DETAILS_UPDATE,
            payload
          })
        );
      });
  }

  private handleSmallDevices(): void {
    this.isSmallDevice = window.innerWidth < 1100;
    this.breakpointObserver.observe(MIN_WIDTH_1100)
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(() => {
        this.isSmallDevice = window.innerWidth < 1100;
        this.getResources();
      });
  }

  private getResources(): void {
    this.store.dispatch<SystemResourcesLoadAction>({
      type: SYSTEM_RESOURCES_LOAD,
      payload: { isSmallDevice: this.isSmallDevice }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch<SystemResourcesCloseAction>({ type: SYSTEM_RESOURCES_CLOSE });
  }
}
