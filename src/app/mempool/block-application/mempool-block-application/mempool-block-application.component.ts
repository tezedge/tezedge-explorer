import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  MEMPOOL_BLOCK_APPLICATION_LOAD,
  MEMPOOL_BLOCK_APPLICATION_STOP,
  MempoolBlockApplicationLoad,
  MempoolBlockApplicationStop
} from '@mempool/block-application/mempool-block-application/mempool-block-application.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { mempoolBlockApplication } from '@mempool/block-application/mempool-block-application/mempool-block-application.reducer';
import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import { CurveFactory, curveLinear } from 'd3-shape';
import { SpaceNumberPipe } from '@shared/pipes/space-number.pipe';
import { NanoTransformPipe } from '@shared/pipes/nano-transform.pipe';
import { delay, filter, skip } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { navigationMenuCollapsing } from '@app/app.reducer';
import { MIN_WIDTH_1200, MIN_WIDTH_1500, MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';

@UntilDestroy()
@Component({
  selector: 'app-mempool-block-application',
  templateUrl: './mempool-block-application.component.html',
  styleUrls: ['./mempool-block-application.component.scss'],
  host: { class: 'h-100 overflow-auto d-block' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBlockApplicationComponent implements OnInit, OnDestroy {

  readonly curve: CurveFactory = curveLinear;
  readonly MATH = Math;

  mempoolState: MempoolBlockApplicationState;
  labelList = [];
  maxValue: number;

  private xTicksValuesLength: number;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private spaceNumber: SpaceNumberPipe,
              private nanoTransformPipe: NanoTransformPipe,
              private breakpointObserver: BreakpointObserver) { }

  readonly yAxisTickFormatting = (value: number) => value === 0 ? 0 : this.nanoTransformPipe.transform(Math.round(Math.pow(10, value)), null, null, 0);
  readonly xAxisTickFormatting = (value: string) => this.spaceNumber.transform(value.substring(0, value.indexOf('r')));

  ngOnInit(): void {
    this.listenToResizeEvent();
    this.listenToMempoolBlockApplicationStateChange();
  }

  private triggerDataLoad(): void {
    this.store.dispatch<MempoolBlockApplicationLoad>({ type: MEMPOOL_BLOCK_APPLICATION_LOAD, payload: { xTicksValuesLength: this.xTicksValuesLength } });
  }

  private listenToMempoolBlockApplicationStateChange(): void {
    this.store.select(mempoolBlockApplication).pipe(
      untilDestroyed(this),
      filter(state => !!state.chartLines.length),
    ).subscribe(mempoolState => {
      this.mempoolState = mempoolState;
      this.labelList = mempoolState.chartLines.map(line => line.name);
      this.maxValue = Math.max(...mempoolState.chartLines[0].series.map(total => total.value));
      this.cdRef.detectChanges();
    });
  }

  private listenToResizeEvent(): void {
    this.breakpointObserver
      .observe([MIN_WIDTH_1500, MIN_WIDTH_1200, MIN_WIDTH_700])
      .pipe(untilDestroyed(this))
      .subscribe((value: BreakpointState) => {
        if (value.breakpoints[MIN_WIDTH_1500]) {
          this.xTicksValuesLength = 11;
        } else if (value.breakpoints[MIN_WIDTH_1200]) {
          this.xTicksValuesLength = 10;
        } else if (value.breakpoints[MIN_WIDTH_700]) {
          this.xTicksValuesLength = 5;
        } else {
          this.xTicksValuesLength = 3;
        }
        this.triggerDataLoad();
      });

    this.store.pipe(
      untilDestroyed(this),
      select(navigationMenuCollapsing),
      skip(1),
      delay(400)
    ).subscribe(() => this.triggerDataLoad());
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolBlockApplicationStop>({ type: MEMPOOL_BLOCK_APPLICATION_STOP });
  }
}
