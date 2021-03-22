import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ResourceStorageOperation } from '../../shared/types/resources/storage/resource-storage-operation.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ResourceStorageOperationUsageEntry } from '../../shared/types/resources/storage/resource-storage-operation-usage-entry.type';

const RANGES = [
  '100ns - 1μs',
  '1μs - 10μs',
  '10μs - 100μs',
  '100μs - 1ms',
  '1ms - 10ms',
  '10ms - 100ms',
  '100ms - 1s',
  '1s - 10s',
  '10s - 100s'
];

@Component({
  selector: 'app-resources-storage-mini-graph',
  templateUrl: './resources-storage-mini-graph.component.html',
  styleUrls: ['./resources-storage-mini-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesStorageMiniGraphComponent implements OnInit {

  @Input() graphData: ResourceStorageOperation;
  @Input() operationName: string;
  @Input() isMainGraph: boolean;

  columns: ResourceStorageOperationUsageEntry[];

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.buildTimeline();
  }

  private buildTimeline(): void {
    Object
      .keys(this.graphData)
      .filter(key => this.graphData[key] === 0)
      .forEach(key => this.graphData[key] = '');

    this.columns = [];

    this.columns[0] = { ...this.graphData.oneToTenUs, count: Math.min(this.graphData.oneToTenUs.count.toString().length, 8) };
    this.columns[1] = { ...this.graphData.tenToOneHundredUs, count: Math.min(this.graphData.tenToOneHundredUs.count.toString().length, 8) };
    this.columns[2] = { ...this.graphData.oneHundredUsToOneMs, count: Math.min(this.graphData.oneHundredUsToOneMs.count.toString().length, 8) };
    this.columns[3] = { ...this.graphData.oneToTenMs, count: Math.min(this.graphData.oneToTenMs.count.toString().length, 8) };
    this.columns[4] = { ...this.graphData.tenToOneHundredMs, count: Math.min(this.graphData.tenToOneHundredMs.count.toString().length, 8) };
    this.columns[5] = { ...this.graphData.oneHundredMsToOneS, count: Math.min(this.graphData.oneHundredMsToOneS.count.toString().length, 8) };
    this.columns[6] = { ...this.graphData.oneToTenS, count: Math.min(this.graphData.oneToTenS.count.toString().length, 8) };
    this.columns[7] = { ...this.graphData.tenToOneHundredS, count: Math.min(this.graphData.tenToOneHundredS.count.toString().length, 8) };
    this.columns[8] = { ...this.graphData.oneHundredS, count: Math.min(this.graphData.oneHundredS.count.toString().length, 8) };
  }

  openPersonDetailsOverlay(column: ResourceStorageOperationUsageEntry, index: number, event: MouseEvent): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([{
          originX: 'center',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 10
        }])
    });

    event.stopPropagation();
    console.log(column);
    const context = this.tooltipTemplate
      .createEmbeddedView({
        range: RANGES[index],
        total: column.totalTime,
        mean: column.meanTime,
        max: column.maxTime
      })
      .context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachOverlay(): void {
    this.overlayRef.detach();
  }
}
