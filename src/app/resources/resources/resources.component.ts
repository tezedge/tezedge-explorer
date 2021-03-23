import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Resource } from '../../shared/types/resources/resource.type';
import { Observable } from 'rxjs';
import { ResourcesActionTypes } from './resources.actions';
import { filter, map, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver } from '@angular/cdk/layout';


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
    '#df80ff',
    '#5aa454',
    '#ff8c00',
    '#ffe600',
    '#ff1c91',
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

  resourcesSummary: ResourcesSummary;
  activeSummary: ResourceType = 'disk';

  private isSmallDevice: boolean;

  constructor(private store: Store<any>,
              private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.handleSmallDevices();
    this.listenToResourcesChange();
    this.getResources();
  }

  private listenToResourcesChange(): void {
    this.chartData$ = this.store.pipe(
      untilDestroyed(this),
      select(state => state.resources.resources),
      filter((resources: Resource[]) => resources.length > 0),
      map((resources: Resource[]) => this.createChartData(resources))
    );
  }

  toggleActiveSummary(value: ResourceType): void {
    this.activeSummary = value;
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
    // create a unique minute-based list of entries. Only one value for each minute
    resources = [...new Map(resources.map(entry => [entry.timestamp, entry])).values()].reverse();

    this.resourcesSummary = this.createSummaryBlocks(resources);

    const chartData = new ChartData();
    chartData.memory = [];
    chartData.disk = [];
    chartData.cpu = [];

    chartData.cpu.push({
      name: 'CPU',
      series: ResourcesComponent.getSeries(resources, 'cpu.node')
    });

    chartData.memory.push({
      name: 'TOTAL',
      series: ResourcesComponent.getSeries(resources, 'memory.total')
    });
    chartData.memory.push({
      name: 'NODES',
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

    chartData.xTicksValues = ResourcesComponent.getFilteredXTicks(resources, Math.min(resources.length, this.isSmallDevice ? 5 : 15));

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

    for (let i = 0; i < resources.length; i = i + delta) {
      xTicks.push(resources[i].timestamp);
    }
    return xTicks;
  }

  private createSummaryBlocks(resources: Array<Resource>): ResourcesSummary {
    const summary = new ResourcesSummary();
    const lastResource = resources[resources.length - 1];
    summary.cpu.push(new ResourcesSummaryBlock('Load', lastResource.cpu.node, this.colorScheme.domain[0], '%'));

    summary.memory.push(new ResourcesSummaryBlock('Total', lastResource.memory.total, this.colorScheme.domain[0], 'GB'));
    summary.memory.push(new ResourcesSummaryBlock('Nodes', lastResource.memory.node.resident, this.colorScheme.domain[1], 'GB'));
    if (lastResource.memory.protocolRunners) {
      summary.memory.push(new ResourcesSummaryBlock(
        'Protocol runners',
        lastResource.memory.protocolRunners.resident,
        this.colorScheme.domain[2],
        'GB'
      ));
    }
    if (lastResource.memory.validators) {
      summary.memory.push(new ResourcesSummaryBlock(
        'Validators',
        lastResource.memory.validators.resident,
        this.colorScheme.domain[2],
        'GB'
      ));
    }

    summary.disk.push(new ResourcesSummaryBlock(
      'Block storage',
      lastResource.disk.blockStorage,
      this.colorScheme.domain[1],
      'GB'
    ));
    summary.disk.push(new ResourcesSummaryBlock('Context Irmin', lastResource.disk.contextIrmin, this.colorScheme.domain[2], 'GB'));
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
    summary.disk.push(new ResourcesSummaryBlock('Total', lastResource.disk.total, this.colorScheme.domain[0], 'GB'));

    return summary;
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: ResourcesActionTypes.ResourcesClose });
  }
}
