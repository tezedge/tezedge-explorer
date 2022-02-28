import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { mempoolBakingRights } from '@mempool/mempool-baking-rights/mempool-baking-rights.reducer';
import { getFilteredXTicks } from '@helpers/chart.helper';
import { filter } from 'rxjs/operators';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { NANOSECOND_FACTOR, ONE_HUNDRED_MS } from '@shared/constants/unit-measurements';
import { MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import memo from 'memo-decorator';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@UntilDestroy()
@Component({
  selector: 'app-mempool-baking-rights-graph',
  templateUrl: './mempool-baking-rights-graph.component.html',
  styleUrls: ['./mempool-baking-rights-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBakingRightsGraphComponent implements OnInit, OnDestroy {

  readonly trackHistogramItems = (index: number, item) => item.value;

  chartColumns: any[];
  xTicksValues: string[];
  bakingRightsLength: number;

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<{ count: number, range: string }>;

  private xTicksValuesLength: number;
  private overlayRef: OverlayRef;
  private steps: number[] = MempoolBakingRightsGraphComponent.getSteps();

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.listenToResizeEvent();
    this.listenToMempoolBakingRightsChange();
  }

  private listenToMempoolBakingRightsChange(): void {
    this.store.select(mempoolBakingRights)
      .pipe(
        untilDestroyed(this),
        filter(rights => rights.length > 0),
      )
      .subscribe((rights: MempoolBakingRight[]) => {
        this.bakingRightsLength = rights.length;
        const times: number[] = rights.map(r => r.receivedTime).filter(t => t !== undefined && t !== null);
        this.chartColumns = this.generateChartLine(times);
        this.xTicksValues = getFilteredXTicks(this.chartColumns, Math.min(this.chartColumns.length, this.xTicksValuesLength), 'name');
        this.cdRef.detectChanges();
      });
  }

  private generateChartLine(times: number[]): any[] {
    const seriesObj: { [p: number]: { value: number, range: string } } = this.steps.reduce((acc, curr: number, i: number) => ({
      ...acc,
      [curr]: {
        value: 0,
        range: i === this.steps.length - 1
          ? '> 5s'
          : `${curr / NANOSECOND_FACTOR}s - ${(curr + ONE_HUNDRED_MS) / NANOSECOND_FACTOR}s`
      }
    }), {});
    times.forEach(time => {
      const stepKey = MempoolBakingRightsGraphComponent.findClosestSmallerStep(this.steps, time);
      seriesObj[stepKey].value++;
    });

    return Object.keys(seriesObj).map((key: string) => ({
      name: Number(key) / NANOSECOND_FACTOR + 's',
      value: seriesObj[key].value,
      range: seriesObj[key].range,
    }));
  }

  openDetailsOverlay(item, event: MouseEvent): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }

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
    this.overlayRef.detach();
  }

  ngOnDestroy(): void {
    if (this.overlayRef?.hasAttached()) {
      this.detachOverlay();
    }
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

  private static getSteps(): number[] {
    const res = [0];
    let i = ONE_HUNDRED_MS;
    while (i <= NANOSECOND_FACTOR * 5) {
      res.push(i);
      i = i + ONE_HUNDRED_MS;
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
}
