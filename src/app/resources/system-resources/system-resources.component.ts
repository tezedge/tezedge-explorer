import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, filter, skip } from 'rxjs/operators';
import {
  SystemResourcesActionTypes,
  SystemResourcesCloseAction,
  SystemResourcesDetailsUpdateAction,
  SystemResourcesLoadAction
} from './system-resources.actions';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { systemResources } from '../resources/resources.reducer';
import { appState } from '../../app.reducer';
import { SystemResourcesResourceType } from '../../shared/types/resources/system/system-resources-panel.type';
import { SystemResourceCategory } from '../../shared/types/resources/system/system-resource-category.type';
import { SystemResourcesGraphComponent } from '../system-resources-graph/system-resources-graph.component';
import { TezedgeChartsService } from '../../shared/charts/tezedge-charts.service';


@UntilDestroy()
@Component({
  selector: 'app-system-resources',
  templateUrl: './system-resources.component.html',
  styleUrls: ['./system-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesComponent implements OnInit, OnDestroy {

  systemResource: SystemResources;
  activeSummary: SystemResourcesResourceType = 'cpu';

  readonly yAxisPercentageConversion = (value) => `${value}%`;
  readonly yAxisGigaBytesConversion = (value) => (value < 1 ? value : (value + '.00')) + ' GB';
  readonly yAxisMegaBytesConversion = (value) => `${value} MB`;

  private graphs: QueryList<ElementRef>;
  private resourceTypes: SystemResourcesResourceType[] = ['cpu', 'memory', 'storage', 'io', 'network'];
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
          .pipe(untilDestroyed(this))
          .subscribe(() => {
            this.toggleActiveSummary(this.resourceTypes[i], this.systemResource[this.resourceTypes[i]]);
          });
      });
    });
  }

  toggleActiveSummary(value: SystemResourcesResourceType, resource: SystemResourceCategory): void {
    if (this.activeSummary === value) {
      return;
    }
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
      filter(resources => !!resources),
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
            type: SystemResourcesActionTypes.SYSTEM_RESOURCES_DETAILS_UPDATE,
            payload
          })
        );
      });
  }

  private handleSmallDevices(): void {
    this.isSmallDevice = window.innerWidth < 1100;
    this.breakpointObserver.observe('(min-width: 1100px)')
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(() => {
        this.isSmallDevice = window.innerWidth < 1100;
        this.getResources();
      });
  }

  private getResources(): void {
    this.store.dispatch<SystemResourcesLoadAction>({
      type: SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD,
      payload: { isSmallDevice: this.isSmallDevice }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch<SystemResourcesCloseAction>({ type: SystemResourcesActionTypes.SYSTEM_RESOURCES_CLOSE });
  }
}
