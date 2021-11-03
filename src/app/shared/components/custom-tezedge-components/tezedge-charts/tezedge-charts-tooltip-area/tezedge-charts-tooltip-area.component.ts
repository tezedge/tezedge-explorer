import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TooltipArea, TooltipDirective } from '@swimlane/ngx-charts';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { SYSTEM_RESOURCES_DETAILS_UPDATE, SystemResourcesDetailsUpdateAction } from '@resources/system-resources/system-resources.actions';
import { SystemResourcesResourceType } from '@shared/types/resources/system/system-resources-panel.type';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import {
  GraphRedirectionOverlayComponent
} from '@shared/components/custom-tezedge-components/tezedge-charts/graph-redirection-overlay/graph-redirection-overlay.component';
import { TezedgeChartsService } from '@shared/components/custom-tezedge-components/tezedge-charts/tezedge-charts.service';
import {
  MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD,
  MempoolBlockApplicationDetailsLoad
} from '@mempool/mempool-block-application/mempool-block-application.actions';
import { selectActiveNodeNetwork } from '@settings/settings-node.reducer';

@UntilDestroy()
@Component({
  selector: 'g[tezedge-charts-tooltip-area]',
  templateUrl: './tezedge-charts-tooltip-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TezedgeChartsTooltipAreaComponent extends TooltipArea implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() graphType: string;
  @Input() chartElement: SVGElement;
  @Input() resourceType: SystemResourcesResourceType | undefined;
  @Input() routedTooltipReady: boolean;
  @Input() disableRedirection: boolean = false;
  @Input() tooltipPlacement: 'top' | 'bottom';
  @Input() markIndexes: number[];

  @ViewChild(TooltipDirective) private tooltipDirective: TooltipDirective;
  @ViewChild('tooltipTrigger') private tooltipTrigger: ElementRef<SVGRectElement>;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.redirectionOverlayRef?.instance.isClickOutside(event, this.elementRef)) {
      this.detachTooltip();
    }
  }

  routedTooltipAnchorX: any;
  marks: { x: number, blockLevel: number, round: number }[] = [];

  private overlayRef: OverlayRef;
  private redirectionOverlayRef: ComponentRef<GraphRedirectionOverlayComponent>;
  private nodeNetwork: string;

  private readonly scrollListener = () => this.detachTooltip();

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              @Inject(DOCUMENT) private document: Document,
              private zone: NgZone,
              private overlay: Overlay,
              private store: Store<State>,
              private route: ActivatedRoute,
              private elementRef: ElementRef,
              private cdRef: ChangeDetectorRef,
              private tezedgeChartsService: TezedgeChartsService) { super(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.resourceType
      && this.route.snapshot.queryParams.timestamp
      && changes.routedTooltipReady?.previousValue !== changes.routedTooltipReady?.currentValue
      && changes.routedTooltipReady.currentValue
    ) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          const xSetValue = Number(this.route.snapshot.queryParams.timestamp);
          const xSetTimestamps = this.xSet.map(date => Date.parse(date.replace(',', '/' + new Date().getFullYear() + ',')));
          const output = xSetTimestamps.filter(v => v < xSetValue).reduce((prev, curr) => Math.abs(curr - xSetValue) < Math.abs(prev - xSetValue) ? curr : prev);
          const index = xSetTimestamps.findIndex(value => value === output);

          const percentage = index * 100 / this.xSet.length;
          this.routedTooltipAnchorX = percentage / 100 * this.dims.width;
          if (this.resourceType === 'io') {
            this.tezedgeChartsService.updateSystemResources({
              type: 'runnerGroups',
              resourceType: this.resourceType,
              timestamp: this.xSet[index]
            });
          }
          this.cdRef.detectChanges();
        }, 500);
      });
    }

    if (this.markIndexes.length && changes.markIndexes?.previousValue !== changes.markIndexes?.currentValue) {
      this.addMarksToGraph();
    }
  }

  ngOnInit(): void {
    this.store.select(selectActiveNodeNetwork)
      .pipe(untilDestroyed(this))
      .subscribe((network: string) => this.nodeNetwork = network);
  }

  ngAfterViewInit(): void {
    this.tooltipDirective.tooltipCloseOnClickOutside = false;

    if (this.resourceType && this.tooltipTrigger) {
      this.zone.runOutsideAngular(() => {
        this.document.querySelector('.resources-container')?.addEventListener('scroll', this.scrollListener);
        this.document.querySelector('.centered-container')?.addEventListener('scroll', this.scrollListener);

        fromEvent(this.tooltipTrigger.nativeElement, 'mousemove')
          .pipe(untilDestroyed(this))
          .subscribe(() => {
              this.tezedgeChartsService.updateSystemResources({
                type: 'runnerGroups',
                resourceType: this.resourceType,
                timestamp: this.anchorValues[0].name
              });
            }
          );
      });
    }
  }

  private addMarksToGraph(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.marks = [];
        this.markIndexes.forEach(index => {
          let position = this.xScale(this.xSet[index]);
          position = Math.max(0, position);
          position = Math.min(this.dims.width, position);
          const value = this.getValues(this.xSet[index]);
          this.marks.push({
            x: position,
            blockLevel: value[0].blockLevel,
            round: value[0].round
          });
        });
        this.cdRef.detectChanges();
      }, 500);
    });
  }

  mouseMove(event): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const xPos = event.pageX - event.target.getBoundingClientRect().left;

    const closestIndex = this.findClosestPointIndex(xPos);
    const closestPoint = this.xSet[closestIndex];
    this.anchorPos = this.xScale(closestPoint);
    this.anchorPos = Math.max(0, this.anchorPos);
    this.anchorPos = Math.min(this.dims.width, this.anchorPos);
    if (this.anchorPos !== this.lastAnchorPos) {
      this.anchorValues = this.getValues(closestPoint);
      const toolTipComponent = this.tooltipDirective['component'];

      this.anchorOpacity = 0.9;
      this.hover.emit({ value: closestPoint });

      if (toolTipComponent && toolTipComponent.instance) {
        toolTipComponent.instance.context = this.anchorValues;
        toolTipComponent.instance.position();
        toolTipComponent.changeDetectorRef.markForCheck();
      }
      this.lastAnchorPos = this.anchorPos;
    }
  }

  showTooltip(): void {
    this.tooltipDirective.showTooltip(true);
    if (this.resourceType && this.anchorValues[0]) {
      setTimeout(() => {
        this.store.dispatch<SystemResourcesDetailsUpdateAction>({
          type: SYSTEM_RESOURCES_DETAILS_UPDATE,
          payload: {
            type: 'runnerGroups',
            resourceType: this.resourceType,
            timestamp: this.anchorValues[0].name
          }
        });
      });
    }
  }

  hideTooltip(): void {
    this.tooltipDirective.hideTooltip(true);
    this.anchorOpacity = 0;
    this.lastAnchorPos = -1;
    setTimeout(() => this.tooltipDirective.hideTooltip(true), 100);
  }

  attachOverlay(event: MouseEvent): void {
    if (this.disableRedirection) {
      return;
    }
    this.detachTooltip();

    const rect = (event.target as SVGRectElement).getBoundingClientRect();
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo({
          x: event.pageX,
          y: window.innerHeight < (rect.y + rect.height + 170) ? rect.y - 50 : rect.y,
          width: 1,
          height: 1
        })
        .withPositions([{
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: 0,
          offsetY: rect.height + 15
        }])
    });
    const portal = new ComponentPortal(GraphRedirectionOverlayComponent);
    this.redirectionOverlayRef = this.overlayRef.attach(portal);
    this.redirectionOverlayRef.instance.date = this.anchorValues[0][this.resourceType ? 'name' : 'timestamp'];
    if (this.graphType === 'block-application') {
      this.redirectionOverlayRef.instance.blockLevel = Number(this.anchorValues[0].blockLevel);
      this.redirectionOverlayRef.instance.network = this.nodeNetwork;
      this.store.dispatch<MempoolBlockApplicationDetailsLoad>({
        type: MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD,
        payload: {
          level: Number(this.anchorValues[0].blockLevel),
          round: this.anchorValues[0].round
        }
      });
    }
  }

  private detachTooltip(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  ngOnDestroy(): void {
    this.detachTooltip();
    if (this.resourceType) {
      this.document.querySelector('.resources-container')?.removeEventListener('scroll', this.scrollListener);
      this.document.querySelector('.centered-container')?.removeEventListener('scroll', this.scrollListener);
    }
  }
}
