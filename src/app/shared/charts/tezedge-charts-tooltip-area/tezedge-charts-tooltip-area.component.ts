import { ChangeDetectionStrategy, Component, ComponentRef, HostListener, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TooltipArea, TooltipDirective } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { GraphRedirectionOverlayComponent } from '../graph-redirection-overlay/graph-redirection-overlay.component';

@Component({
  selector: 'g[tezedge-charts-tooltip-area]',
  templateUrl: './tezedge-charts-tooltip-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TezedgeChartsTooltipAreaComponent extends TooltipArea implements OnInit, OnDestroy {

  @Input() chartElement: SVGElement;

  @ViewChild(TooltipDirective) private tooltipDirective: TooltipDirective;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event): void {
    if (this.redirectionOverlayRef?.instance.isClickOutside(event)) {
      this.detachTooltip();
    }
  }

  @HostListener('window:scroll')
  onDocumentScroll(): void { this.detachTooltip(); }

  private overlayRef: OverlayRef;
  private redirectionOverlayRef: ComponentRef<GraphRedirectionOverlayComponent>;

  private readonly scrollListener = () => this.detachTooltip();

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              @Inject(DOCUMENT) private document: Document,
              private router: Router,
              private overlay: Overlay) { super(); }

  ngOnInit(): void {
    this.document.querySelector('.resources-container').addEventListener('scroll', this.scrollListener);
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

      this.anchorOpacity = 0.7;
      this.hover.emit({
        value: closestPoint
      });

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
  }

  hideTooltip(): void {
    this.tooltipDirective.hideTooltip(true);
    this.anchorOpacity = 0;
    this.lastAnchorPos = -1;
  }

  attachOverlay(event: MouseEvent): void {
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
    event.stopPropagation();
    const portal = new ComponentPortal(GraphRedirectionOverlayComponent);
    this.redirectionOverlayRef = this.overlayRef.attach(portal);
    this.redirectionOverlayRef.instance.date = this.anchorValues[0].name;
  }

  private detachTooltip(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  ngOnDestroy(): void {
    this.detachTooltip();
    this.document.querySelector('.resources-container').removeEventListener('scroll', this.scrollListener);
  }
}
