import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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

class ChartColumn {
  name: string;
  value: number;
  range: string;
  step: number;
}

@UntilDestroy()
@Component({
  selector: 'app-mempool-count-graph',
  templateUrl: './mempool-count-graph.component.html',
  styleUrls: ['./mempool-count-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolCountGraphComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() times: number[];
  @Input() columnStep: number;
  @Input() yAxisValues: number[] = [30, 25, 20, 15, 10, 5, 0];
  @Input() xAxisMarker: number;

  chartColumns: ChartColumn[];
  xTicksValues: string[];
  maxHeight: number;
  xAxisMarkerPosition: number;
  hideMarker: boolean = false;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<{ count: number, range: string }>;
  @ViewChild('columnContainer') private columnContainer: ElementRef<HTMLDivElement>;

  private xTicksValuesLength: number;
  private steps: number[];
  private overlayRef: OverlayRef;

  constructor(private breakpointObserver: BreakpointObserver,
              private viewContainerRef: ViewContainerRef,
              private overlay: Overlay) { }

  ngOnInit(): void {
    this.steps = this.getSteps();
    this.chartColumns = this.initChartColumns();
    this.xTicksValues = this.getFilteredXTicks();
    this.listenToResizeEvent();
  }

  ngAfterViewInit(): void {
    this.maxHeight = this.columnContainer.nativeElement.offsetHeight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.xAxisMarker && this.xAxisMarker <= this.steps[this.steps.length - 1]) {
      this.xAxisMarkerPosition = 100 * this.xAxisMarker / this.steps[this.steps.length - 1];
      this.hideMarker = false;
    } else {
      this.hideMarker = true;
    }

    if (this.steps && changes.times?.currentValue !== changes.times?.previousValue) {
      this.update();
    }
  }

  private update(): void {
    this.generateChartColumns(this.times);
  }

  private initChartColumns(): ChartColumn[] {
    const seriesObj: { [p: number]: { value: number, range: string } } = this.steps.reduce((acc, curr: number, i: number) => ({
      ...acc,
      [curr]: {
        value: 0,
        range: i === this.steps.length - 1
          ? `> ${this.columnStep * 5}s`
          : `${curr / NANOSECOND_FACTOR}s - ${(curr + (ONE_HUNDRED_MS * this.columnStep)) / NANOSECOND_FACTOR}s`
      }
    }), {});

    return Object.keys(seriesObj).map((key: string) => ({
      name: Number(key) / NANOSECOND_FACTOR + 's',
      value: seriesObj[key].value,
      range: seriesObj[key].range,
      step: Number(key)
    }));
  }

  private generateChartColumns(times: number[]): void {
    this.chartColumns.forEach(col => col.value = 0);
    times.forEach(time => {
      const column = MempoolCountGraphComponent.findClosestSmallerStep(this.chartColumns, time);
      column.value++;
    });
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
        this.xTicksValues = this.getFilteredXTicks();
      });
  }

  private getFilteredXTicks(): string[] {
    return getFilteredXTicks(this.chartColumns, Math.min(this.chartColumns.length, this.xTicksValuesLength), 'name');
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

  private static findClosestSmallerStep(steps: ChartColumn[], value: number): ChartColumn {
    let closest = null;
    for (const item of steps) {
      if (item.step <= value) {
        closest = item;
      } else {
        return closest;
      }
    }
    return closest;
  }

  openDetailsOverlay(column: ChartColumn, event: MouseEvent): void {
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
        count: column.value,
        range: column.range
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
