import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TooltipArea, TooltipDirective } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { GraphRedirectionOverlayComponent } from '../graph-redirection-overlay/graph-redirection-overlay.component';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { SystemResourcesActionTypes, SystemResourcesDetailsUpdateAction } from '@resources/system-resources/system-resources.actions';
import { SystemResourcesResourceType } from '@shared/types/resources/system/system-resources-panel.type';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TezedgeChartsService } from '../tezedge-charts.service';

@UntilDestroy()
@Component({
  selector: 'g[tezedge-charts-tooltip-area]',
  templateUrl: './tezedge-charts-tooltip-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TezedgeChartsTooltipAreaComponent extends TooltipArea implements AfterViewInit, OnDestroy {

  @Input() chartElement: SVGElement;
  @Input() resourceType: SystemResourcesResourceType;

  @ViewChild(TooltipDirective) private tooltipDirective: TooltipDirective;
  @ViewChild('tooltipTrigger') private tooltipTrigger: ElementRef<SVGRectElement>;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.redirectionOverlayRef?.instance.isClickOutside(event, this.elementRef)) {
      this.detachTooltip();
    }
  }

  private overlayRef: OverlayRef;
  private redirectionOverlayRef: ComponentRef<GraphRedirectionOverlayComponent>;

  private readonly scrollListener = () => this.detachTooltip();

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              @Inject(DOCUMENT) private document: Document,
              private zone: NgZone,
              private router: Router,
              private overlay: Overlay,
              private store: Store<State>,
              private elementRef: ElementRef,
              private tezedgeChartsService: TezedgeChartsService) { super(); }

  ngAfterViewInit(): void {
    this.tooltipDirective.tooltipCloseOnClickOutside = false;

    this.zone.runOutsideAngular(() => {
      this.document.querySelector('.resources-container').addEventListener('scroll', this.scrollListener);
      this.document.querySelector('.centered-container').addEventListener('scroll', this.scrollListener);

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
    setTimeout(() => {
      this.store.dispatch<SystemResourcesDetailsUpdateAction>({
        type: SystemResourcesActionTypes.SYSTEM_RESOURCES_DETAILS_UPDATE,
        payload: {
          type: 'runnerGroups',
          resourceType: this.resourceType,
          timestamp: this.anchorValues[0].name
        }
      });
    });
  }

  hideTooltip(): void {
    this.tooltipDirective.hideTooltip(true);
    this.anchorOpacity = 0;
    this.lastAnchorPos = -1;
    setTimeout(() => this.tooltipDirective.hideTooltip(true), 100);
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
    this.document.querySelector('.centered-container').removeEventListener('scroll', this.scrollListener);
  }
}
