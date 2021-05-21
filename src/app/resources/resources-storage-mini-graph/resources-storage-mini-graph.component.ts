import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ResourceStorageQuery } from '../../shared/types/resources/storage/resource-storage-operation.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ResourceStorageQueryDetails } from '../../shared/types/resources/storage/resource-storage-operation-usage-entry.type';

const RANGES = [
  '1μs - 10μs',
  '10μs - 100μs',
  '100μs - 1ms',
  '1ms - 10ms',
  '10ms - 100ms',
  '100ms - 1s',
  '1s - 10s',
  '10s - 100s',
  'Above 100s'
];

@Component({
  selector: 'app-resources-storage-mini-graph',
  templateUrl: './resources-storage-mini-graph.component.html',
  styleUrls: ['./resources-storage-mini-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesStorageMiniGraphComponent implements OnInit {

  @Input() graphData: ResourceStorageQuery;
  @Input() operationName: string;
  @Input() isMainGraph: boolean;

  columns: Array<{ squareCount: number } & { [p in keyof ResourceStorageQueryDetails]: number; }>;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.buildTimeline();
  }

  private buildTimeline(): void {
    this.columns = [];

    Object
      .keys(this.graphData)
      .filter(key => key !== 'totalTime' && key !== 'calls')
      .forEach((key: string, index: number) => {
        this.columns[index] = {
          ...this.graphData[key],
          squareCount: ResourcesStorageMiniGraphComponent.getSquareCount(this.graphData[key].totalTime)
        };
      });
  }

  openPersonDetailsOverlay(column: ResourceStorageQueryDetails, index: number, event: MouseEvent): void {
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
    const context = this.tooltipTemplate
      .createEmbeddedView({
        range: RANGES[index],
        count: column.count,
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

  private static getSquareCount(totalTimeInSeconds: number): number {
    const TEN_MICROSECONDS_FACTOR = 100000;
    let squareCount = 0;
    let timeInTenMicroseconds = totalTimeInSeconds * TEN_MICROSECONDS_FACTOR;
    while (timeInTenMicroseconds > 1) {
      timeInTenMicroseconds /= 10;
      squareCount++;
    }
    return Math.min(squareCount, 8);
  }
}
