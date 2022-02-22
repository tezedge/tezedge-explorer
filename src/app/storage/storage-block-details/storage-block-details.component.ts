import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { StorageBlockDetails } from '@shared/types/storage/storage-block/storage-block-details.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { StorageBlockDetailsOperationContext } from '@shared/types/storage/storage-block/storage-block-details-operation-context.type';
import { TemplatePortal } from '@angular/cdk/portal';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectStorageBlockDetails } from '@storage/storage-block/storage-block.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-storage-block-details',
  templateUrl: './storage-block-details.component.html',
  styleUrls: ['./storage-block-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageBlockDetailsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() blockHash: string;
  @Input() availableContexts: string[];

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  block: StorageBlockDetails;
  activeContextNode: string;

  private overlayRef: OverlayRef;

  constructor(private store: Store<State>,
              private overlay: Overlay,
              private cdRef: ChangeDetectorRef,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.listenToBlockDetailsChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.blockHash && changes.blockHash.previousValue !== changes.blockHash.currentValue) {
      this.activeContextNode = this.availableContexts[0];
    }
  }

  private listenToBlockDetailsChange(): void {
    this.store.select(selectStorageBlockDetails)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((block: StorageBlockDetails) => {
        this.block = block;
        this.cdRef.detectChanges();
      });
  }

  switchContext(): void {
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
      actions: row.data.queriesCount
    };
    const context = this.tooltipTemplate.createEmbeddedView(contextData).context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachTooltip(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  ngOnDestroy(): void {
    this.detachTooltip();
  }
}
