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
import { MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NANOSECOND_FACTOR, ONE_HUNDRED_MS } from '@shared/constants/unit-measurements';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { getFilteredXTicks } from '@helpers/chart.helper';
import { TemplatePortal } from '@angular/cdk/portal';

class ChartItem {
  name: string;
  value: number;
  range: string;
}

@UntilDestroy()
@Component({
  selector: 'app-mempool-count-graph',
  templateUrl: './mempool-count-graph.component.html',
  styleUrls: ['./mempool-count-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolCountGraphComponent implements OnInit, OnChanges, OnDestroy {

  @Input() times: number[];
  @Input() columnStep: number;

  chartColumns: ChartItem[];
  xTicksValues: string[];

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<{ count: number, range: string }>;

  private xTicksValuesLength: number;
  private steps: number[];
  private overlayRef: OverlayRef;

  constructor(private cdRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  readonly trackHistogramItems = (index: number, item) => item.value;

  ngOnInit(): void {
    this.steps = this.getSteps();
    this.listenToResizeEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.steps && changes.times?.currentValue !== changes.times?.previousValue) {
      this.update();
    }
  }

  private update(): void {
    this.chartColumns = this.generateChartLine(this.times);
    this.xTicksValues = getFilteredXTicks(this.chartColumns, Math.min(this.chartColumns.length, this.xTicksValuesLength), 'name');
  }

  private generateChartLine(times: number[]): ChartItem[] {
    const seriesObj: { [p: number]: { value: number, range: string } } = this.steps.reduce((acc, curr: number, i: number) => ({
      ...acc,
      [curr]: {
        value: 0,
        range: i === this.steps.length - 1
          ? `> ${this.columnStep * 5}s`
          : `${curr / NANOSECOND_FACTOR}s - ${(curr + (ONE_HUNDRED_MS * this.columnStep)) / NANOSECOND_FACTOR}s`
      }
    }), {});
    times.forEach(time => {
      const stepKey = MempoolCountGraphComponent.findClosestSmallerStep(this.steps, time);
      seriesObj[stepKey].value++;
    });

    return Object.keys(seriesObj).map((key: string) => ({
      name: Number(key) / NANOSECOND_FACTOR + 's',
      value: seriesObj[key].value,
      range: seriesObj[key].range,
    }));
  }

  private listenToResizeEvent(): void {
    this.breakpointObserver
      .observe(MIN_WIDTH_700)
      .pipe(untilDestroyed(this))
      .subscribe((value: BreakpointState) => {
        if (value.breakpoints[MIN_WIDTH_700]) {
          this.xTicksValuesLength = 10;
        } else {
          this.xTicksValuesLength = 6;
        }
      });
  }

  private getSteps(): number[] {
    const res = [0];
    let i = ONE_HUNDRED_MS * this.columnStep;
    while (i <= NANOSECOND_FACTOR * this.columnStep * 5) {
      res.push(i);
      i = i + (ONE_HUNDRED_MS * this.columnStep);
    }
    return res;
  }

  private static findClosestSmallerStep(steps: number[], value: number): number {
    let closest = 0;
    for (const step of steps) {
      if (step <= value) {
        closest = step;
      } else {
        return closest;
      }
    }
    return closest;
  }

  openDetailsOverlay(item: ChartItem, event: MouseEvent): void {
    this.detachOverlay();

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
        count: item.value,
        range: item.range
      })
      .context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  ngOnDestroy(): void {
    this.detachOverlay();
  }
}
