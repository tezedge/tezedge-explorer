import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Resource } from '../../shared/types/resources/resource.type';
import { Observable } from 'rxjs';
import { ResourcesActionTypes } from './resources.actions';
import { filter, map, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver } from '@angular/cdk/layout';
import { State } from '../../app.reducers';
import { SettingsNodeApi } from '../../shared/types/settings-node/settings-node-api.type';
import { MatSelectChange } from '@angular/material/select';
import { StorageResourcesActionTypes } from '../resources-storage/resources-storage.actions';
import { MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';


class ChartData {
  cpu: Array<{
    name: string;
    series: Array<SeriesEntry>;
  }>;
  memory: Array<{
    name: string;
    series: Array<SeriesEntry>;
  }>;
  disk: Array<{
    name: string;
    series: Array<SeriesEntry>;
  }>;
  xTicksValues: string[];
}

export class SeriesEntry {
  name: string;
  value: number;
}

class ResourcesSummary {
  cpu: ResourcesSummaryBlock[] = [];
  memory: ResourcesSummaryBlock[] = [];
  disk: ResourcesSummaryBlock[] = [];
  timestamp: string;
}

export class ResourcesSummaryBlock {
  name: string;
  value: number;
  color: string;
  label: string;

  constructor(name: string, value: number, color: string, label: string) {
    this.name = name;
    this.value = value;
    this.color = color;
    this.label = label;
  }
}

export type ResourceType = 'cpu' | 'memory' | 'disk';

const COLOR_SCHEME = {
  domain: [
    '#46afe3',
    '#bf5af2',
    '#32d74b',
    '#ff9f0a',
    '#ffd60a',
    '#ff2d55',
  ]
};

@UntilDestroy()
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesComponent implements OnInit, OnDestroy {

  chartData$: Observable<ChartData>;

  readonly colorScheme = COLOR_SCHEME;
  readonly yAxisPercentageConversion = (value) => `${value}%`;
  readonly yAxisGigaBytesConversion = (value) => (value < 1 ? value : (value + '.00')) + ' GB';
  readonly yAxisMegaBytesConversion = (value) => `${value} MB`;

  resourcesSummary: ResourcesSummary;
  activeSummary: ResourceType = 'disk';

  private isSmallDevice: boolean;
  tabs = [
    { title: 'System overview', id: 1 },
    { title: 'Storage', id: 2 },
    { title: 'Memory', id: 3 }
  ];
  activeTabId: number = 1;

  reversedCheckboxState = false;

  constructor(private zone: NgZone,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.handleSmallDevices();
    this.listenToResourcesChange();
    this.listenToNodeChange();
    this.getResources();
  }

  onTabChange(): void {
    this.reversedCheckboxState = false;
  }

  private listenToResourcesChange(): void {
    this.chartData$ = this.store.pipe(
      untilDestroyed(this),
      select(state => state.resources.resources),
      filter((resources: Resource[]) => resources.length > 0),
      map((resources: Resource[]) => {
        return this.zone.runOutsideAngular(() => this.createChartData(resources));
      })
    );
  }

  private listenToNodeChange(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.settingsNode.activeNode),
    ).subscribe((settingsNode: SettingsNodeApi) => {
      if (settingsNode.id === 'ocaml' && this.tabs.find(tab => tab.title === 'Memory')) {
        this.activeTabId = this.activeTabId === 3 ? 1 : this.activeTabId;
        this.tabs.splice(this.tabs.findIndex(tab => tab.title === 'Memory'), 1);
      } else if (settingsNode.id !== 'ocaml' && !this.tabs.find(tab => tab.title === 'Memory')) {
        this.tabs.push({ title: 'Memory', id: 3 });
      }
      this.cdRef.detectChanges();
    });
  }

  toggleActiveSummary(value: ResourceType): void {
    this.activeSummary = value;
  }

  getStorageStatistics(event: MatSelectChange): void {
    this.store.dispatch({ type: StorageResourcesActionTypes.LoadResources, payload: event.value });
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
    this.store.dispatch({ type: ResourcesActionTypes.LoadResources });
  }

  private createChartData(resources: Array<Resource>): ChartData {
    this.resourcesSummary = this.createSummaryBlocks(resources);

    const chartData = new ChartData();
    chartData.memory = [];
    chartData.disk = [];
    chartData.cpu = [];
    if (resources[0].cpu.protocolRunners) {
      chartData.cpu.push({
        name: 'TOTAL',
        series: ResourcesComponent.getSeries(resources, 'cpu.total')
      });
      chartData.cpu.push({
        name: 'NODE',
        series: ResourcesComponent.getSeries(resources, 'cpu.node')
      });
      chartData.cpu.push({
        name: 'PROTOCOL RUNNERS',
        series: ResourcesComponent.getSeries(resources, 'cpu.protocolRunners')
      });
    } else {
      chartData.cpu.push({
        name: 'NODE',
        series: ResourcesComponent.getSeries(resources, 'cpu.node')
      });
    }

    chartData.memory.push({
      name: 'TOTAL',
      series: ResourcesComponent.getSeries(resources, 'memory.total')
    });
    chartData.memory.push({
      name: 'NODE',
      series: ResourcesComponent.getSeries(resources, 'memory.node.resident')
    });
    if (resources[0].memory.protocolRunners) {
      chartData.memory.push({
        name: 'PROTOCOL RUNNERS',
        series: ResourcesComponent.getSeries(resources, 'memory.protocolRunners.resident')
      });
    }
    if (resources[0].memory.validators) {
      chartData.memory.push({
        name: 'VALIDATORS',
        series: ResourcesComponent.getSeries(resources, 'memory.validators.resident')
      });
    }

    chartData.disk.push({
      name: 'TOTAL',
      series: ResourcesComponent.getSeries(resources, 'disk.total')
    });
    chartData.disk.push({
      name: 'BLOCK STORAGE',
      series: ResourcesComponent.getSeries(resources, 'disk.blockStorage')
    });
    chartData.disk.push({
      name: 'CONTEXT IRMIN',
      series: ResourcesComponent.getSeries(resources, 'disk.contextIrmin')
    });
    chartData.disk.push({
      name: 'DEBUGGER',
      series: ResourcesComponent.getSeries(resources, 'disk.debugger')
    });
    if (resources[0].disk.contextActions) {
      chartData.disk.push({
        name: 'CONTEXT ACTIONS',
        series: ResourcesComponent.getSeries(resources, 'disk.contextActions')
      });
    }
    if (resources[0].disk.contextMerkleRocksDb) {
      chartData.disk.push({
        name: 'CONTEXT MERKLE ROCKS DB',
        series: ResourcesComponent.getSeries(resources, 'disk.contextMerkleRocksDb')
      });
    }
    if (resources[0].disk.mainDb) {
      chartData.disk.push({
        name: 'MAIN DB',
        series: ResourcesComponent.getSeries(resources, 'disk.mainDb')
      });
    }

    chartData.xTicksValues = ResourcesComponent.getFilteredXTicks(resources, Math.min(resources.length, this.isSmallDevice ? 2 : 7));

    return chartData;
  }

  private static getSeries(resources: Array<Resource>, pathToProperty: string): Array<SeriesEntry> {
    return resources.map(resource => ({
      name: resource.timestamp,
      value: ResourcesComponent.getValueFromNestedResourceProperty(resource, pathToProperty)
    }));
  }

  private static getValueFromNestedResourceProperty(resource: Resource, pathToProperty: string): number {
    return pathToProperty.split('.').reduce((obj: Resource, property: string) => obj[property], resource);
  }

  private static getFilteredXTicks(resources: Resource[], noOfResults: number): string[] {
    const xTicks = [];
    const delta = Math.floor(resources.length / noOfResults);
    for (let i = 0; i <= resources.length; i = i + delta) {
      if (resources[i]) {
        xTicks.push(resources[i].timestamp);
      }
    }
    return xTicks;
  }

  private createSummaryBlocks(resources: Array<Resource>): ResourcesSummary {
    const summary = new ResourcesSummary();
    const lastResource = resources[resources.length - 1];
    summary.timestamp = lastResource.timestamp;
    if (lastResource.memory.protocolRunners) {
      summary.cpu.push(new ResourcesSummaryBlock('Total', lastResource.cpu.total, this.colorScheme.domain[0], '%'));
      summary.cpu.push(new ResourcesSummaryBlock('Node', lastResource.cpu.node, this.colorScheme.domain[1], '%'));
      summary.cpu.push(new ResourcesSummaryBlock('Protocol runners', lastResource.cpu.protocolRunners, this.colorScheme.domain[2], '%'));
    } else {
      summary.cpu.push(new ResourcesSummaryBlock('Load', lastResource.cpu.node, this.colorScheme.domain[0], '%'));
    }

    summary.memory.push(new ResourcesSummaryBlock('Total', lastResource.memory.total, this.colorScheme.domain[0], 'MB'));
    summary.memory.push(new ResourcesSummaryBlock('Node', lastResource.memory.node.resident, this.colorScheme.domain[1], 'MB'));
    if (lastResource.memory.protocolRunners) {
      summary.memory.push(new ResourcesSummaryBlock(
        'Protocol runners',
        lastResource.memory.protocolRunners.resident,
        this.colorScheme.domain[2],
        'MB'
      ));
    }
    if (lastResource.memory.validators) {
      summary.memory.push(new ResourcesSummaryBlock(
        'Validators',
        lastResource.memory.validators.resident,
        this.colorScheme.domain[2],
        'MB'
      ));
    }

    summary.disk.push(new ResourcesSummaryBlock('Total', lastResource.disk.total, this.colorScheme.domain[0], 'GB'));
    summary.disk.push(new ResourcesSummaryBlock(
      'Block storage',
      lastResource.disk.blockStorage,
      this.colorScheme.domain[1],
      'GB'
    ));
    summary.disk.push(new ResourcesSummaryBlock('Context Irmin', lastResource.disk.contextIrmin, this.colorScheme.domain[2], 'GB'));
    summary.disk.push(new ResourcesSummaryBlock('Debugger', lastResource.disk.debugger, this.colorScheme.domain[3], 'GB'));
    if (lastResource.disk.contextActions) {
      summary.disk.push(
        new ResourcesSummaryBlock(
          'Context Actions',
          lastResource.disk.contextActions,
          this.colorScheme.domain[3],
          'GB'
        ));
    }
    if (lastResource.disk.contextMerkleRocksDb) {
      summary.disk.push(new ResourcesSummaryBlock(
        'Context Merkle Rocks DB',
        lastResource.disk.contextMerkleRocksDb,
        this.colorScheme.domain[4],
        'GB'
      ));
    }

    if (lastResource.disk.mainDb) {
      summary.disk.push(new ResourcesSummaryBlock('Main DB', lastResource.disk.mainDb, this.colorScheme.domain[5], 'GB'));
    }

    return summary;
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: ResourcesActionTypes.ResourcesClose });
  }

  onReversedCheckboxChange(event: MatCheckboxChange): void {
    this.reversedCheckboxState = event.checked;
    this.cdRef.detectChanges();
    this.store.dispatch({
      type: MemoryResourcesActionTypes.LoadResources,
      payload: { reversed: this.reversedCheckboxState }
    });
  }
}
