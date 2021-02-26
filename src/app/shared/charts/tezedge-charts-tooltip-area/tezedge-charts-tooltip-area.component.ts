import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TooltipArea, TooltipDirective } from '@swimlane/ngx-charts';

@Component({
  selector: 'g[tezedge-charts-tooltip-area]',
  templateUrl: './tezedge-charts-tooltip-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TezedgeChartsTooltipAreaComponent extends TooltipArea {

  @Input() chartElement: SVGElement;

  @ViewChild(TooltipDirective) private tooltipDirective: TooltipDirective;

  constructor(@Inject(PLATFORM_ID) private platformId: any) { super(); }

  mouseMove(event) {
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
}
