import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { StorageBlockDetails } from '../../shared/types/storage/storage-block/storage-block-details.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { StorageBlockDetailsOperationContext } from '../../shared/types/storage/storage-block/storage-block-details-operation-context.type';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-storage-block-details',
  templateUrl: './storage-block-details.component.html',
  styleUrls: ['./storage-block-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageBlockDetailsComponent {

  @Input() block: StorageBlockDetails;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  attachTooltip(row: StorageBlockDetailsOperationContext, event: MouseEvent): void {
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
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: -50,
          offsetY: 26
        }])
    });

    event.stopPropagation();
    const contextData = {
      total: row.data.totalTime,
      mean: row.data.meanTime,
      max: row.data.maxTime,
      actions: row.data.actionsCount
    };
    const context = this.tooltipTemplate.createEmbeddedView(contextData).context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachTooltip(): void {
    this.overlayRef.detach();
  }
}
