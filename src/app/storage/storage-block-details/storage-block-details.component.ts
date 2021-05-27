import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { StorageBlockDetails } from '../../shared/types/storage/storage-block/storage-block-details.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { StorageBlockDetailsOperationContext } from '../../shared/types/storage/storage-block/storage-block-details-operation-context.type';
import { TemplatePortal } from '@angular/cdk/portal';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';

@Component({
  selector: 'app-storage-block-details',
  templateUrl: './storage-block-details.component.html',
  styleUrls: ['./storage-block-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageBlockDetailsComponent implements OnChanges, OnDestroy {

  @Input() block: StorageBlockDetails;
  @Input() blockHash: string;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  activeContextNode: 'tezedge' | 'irmin';

  private overlayRef: OverlayRef;

  constructor(private store: Store<State>,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.blockHash && changes.blockHash.previousValue !== changes.blockHash.currentValue) {
      this.activeContextNode = 'tezedge';
    }
  }

  getBlockDetails(): void {
    this.activeContextNode = this.activeContextNode === 'tezedge' ? 'irmin' : 'tezedge';

    this.store.dispatch({
      type: 'STORAGE_BLOCK_DETAILS_LOAD',
      payload: {
        hash: this.blockHash,
        context: this.activeContextNode
      }
    });
  }

  attachTooltip(row: StorageBlockDetailsOperationContext, event: MouseEvent): void {
    this.detachTooltip();

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
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  ngOnDestroy(): void {
    this.detachTooltip();
  }
}
