import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { LineChartComponent, reduceTicks } from '@swimlane/ngx-charts';
import { animate, style, transition, trigger } from '@angular/animations';
import { SystemResourcesResourceType } from '@shared/types/resources/system/system-resources-panel.type';


@Component({
  selector: 'app-tezedge-line-chart',
  templateUrl: './tezedge-line-chart.component.html',
  styleUrls: ['./tezedge-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(
          500,
          style({
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class TezedgeLineChartComponent extends LineChartComponent {

  @Input() circleAtTheEnd: boolean = false;
  @Input() extraYAxisValues: number = 0;
  @Input() startWithYGridLine: boolean;
  @Input() resourceType: SystemResourcesResourceType | undefined;
  @Input() disableHoverGradient: boolean = true;
  @Input() tooltipPlacement: 'top' | 'bottom' = 'bottom';
  @Input() disableRedirection: boolean;
  @Input() graphType: string;

  chartXReady: boolean = false;
  chartYReady: boolean = false;
  chartElementRef: ElementRef;
  lineResults = []; // line results are now used for line painting and `results` just for XAxis values

  update(): void {
    this.getExtraYAxisGridLine();
    super.update();
    this.removeExtraResultsOfTheLine();
    this.chartElementRef = this.chartElement.nativeElement.querySelector('svg.ngx-charts');
  }

  updateYAxisWidth({ width }: { width: number }): void {
    this.yAxisWidth = width;
    this.update();
    this.chartYReady = true;
  }

  updateXAxisHeight({ height }: { height: number }): void {
    this.xAxisHeight = height;
    this.update();
    this.chartXReady = true;
  }

  private getExtraYAxisGridLine(): void {
    if (this.startWithYGridLine) {
      const ticks = this.getTicks();
      let step = 0;
      if (ticks.length > 1) {
        step = Math.abs(ticks[1] - ticks[0]);

        const values = this.results.reduce((accumulator, item) => [...accumulator, ...item.series.map(s => s.value)], []);
        const max = Math.max(...values);
        const lastExtraStep = Math.ceil(max / step) * step;
        this.extraYAxisValues = lastExtraStep - max;
      }
    }
  }

  private removeExtraResultsOfTheLine(): void {
    this.lineResults = [];
    this.lineResults = this.results.map(item => ({
      ...item,
      series: item.series.filter(s => s.value !== null && s.value !== undefined)
    }));
  }

  getYDomain(): any[] {
    const yDomain = super.getYDomain();
    yDomain[1] = yDomain[1] + this.extraYAxisValues;
    return yDomain;
  }

  private getTicks(): any[] {
    if (!this.dims) {
      return [];
    }
    let ticks;
    const maxTicks = this.getMaxTicks(20);
    const maxScaleTicks = this.getMaxTicks(50);

    if (this.yAxisTicks) {
      ticks = this.yAxisTicks;
    } else if (this.yScale.ticks) {
      ticks = this.yScale.ticks.apply(this.yScale, [maxScaleTicks]);
    } else {
      ticks = this.yScale.domain();
      ticks = reduceTicks(ticks, maxTicks);
    }

    return ticks;
  }

  private getMaxTicks(tickHeight: number): number {
    return Math.floor(this.dims.height / tickHeight);
  }
}
