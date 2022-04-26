import { ChangeDetectionStrategy, Component, Input, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { StateResourcesAction } from '@shared/types/resources/state/state-resources-action.type';
import { StateResourcesActionDetails } from '@shared/types/resources/state/state-resources-action-details.type';

const RANGES = [
  'Range 0 - 1μs',
  'Range 1μs - 10μs',
  'Range 10μs - 50μs',
  'Range 50μs - 100μs',
  'Range 100μs - 500μs',
  'Range 500μs - 1ms',
  'Range 1ms - 5ms',
  'Range > 5ms'
];

const X_STEPS = [
  '0',
  '1μs',
  '10μs',
  '50μs',
  '100μs',
  '500μs',
  '1ms',
  '5ms'
];

const Y_STEPS = [
  '10m',
  '1m',
  '100k',
  '10k',
  '1k',
  '100',
  '10',
  '0',
];

@Component({
  selector: 'app-state-resources-mini-graph',
  templateUrl: './state-resources-mini-graph.component.html',
  styleUrls: ['./state-resources-mini-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateResourcesMiniGraphComponent implements OnDestroy {

  @Input() graphData: StateResourcesAction;
  @Input() graphName: string;
  @Input() isMainGraph: boolean;
  @Input() tooltipHeaders: string[];
  @Input() xSteps: string[] = X_STEPS;
  @Input() ySteps: string[] = Y_STEPS;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  openDetailsOverlay(column: StateResourcesActionDetails, index: number, event: MouseEvent): void {
    if (this.overlayRef?.hasAttached()) {
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
        mean: (column.totalTime / column.count) || 0,
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
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
