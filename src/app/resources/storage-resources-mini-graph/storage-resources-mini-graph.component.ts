import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ResourceStorageQuery } from '../../shared/types/resources/storage/storage-resource-operation.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ResourceStorageQueryDetails } from '../../shared/types/resources/storage/storage-resource-operation-usage-entry.type';

const RANGES = [
  'Range 1μs - 10μs',
  'Range 10μs - 100μs',
  'Range 100μs - 1ms',
  'Range 1ms - 10ms',
  'Range 10ms - 100ms',
  'Range 100ms - 1s',
  'Range 1s - 10s',
  'Range 10s - 100s',
  'Range > 100s'
];

const X_STEPS = [
  '1μs',
  '10μs',
  '100μs',
  '1ms',
  '10ms',
  '100ms',
  '1s',
  '10s',
  '100s'
];

const Y_STEPS = [
  '100s',
  '10s',
  '1s',
  '100ms',
  '10ms',
  '1ms',
  '100μs',
  '10μs',
];

@Component({
  selector: 'app-storage-resources-mini-graph',
  templateUrl: './storage-resources-mini-graph.component.html',
  styleUrls: ['./storage-resources-mini-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageResourcesMiniGraphComponent implements OnDestroy {

  @Input() graphData: ResourceStorageQuery;
  @Input() operationName: string;
  @Input() isMainGraph: boolean;
  @Input() tooltipHeaders: string[];
  @Input() xSteps: string[] = X_STEPS;
  @Input() ySteps: string[] = Y_STEPS;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

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
        header: this.tooltipHeaders ? this.tooltipHeaders[index].toUpperCase() : RANGES[index],
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

  ngOnDestroy(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
