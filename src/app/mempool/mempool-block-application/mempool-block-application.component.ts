import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { MEMPOOL_BLOCK_APPLICATION_LOAD } from '@mempool/mempool-block-application/mempool-block-application.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { mempoolBlockApplication } from '@mempool/mempool-block-application/mempool-block-application.reducer';
import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import { curveLinear } from 'd3-shape';
import { SpaceNumberPipe } from '@shared/pipes/space-number.pipe';
import { NanoTransformPipe } from '@shared/pipes/nano-transform.pipe';
import { delay, filter, skip } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { appState } from '@app/app.reducer';
import { getFilteredXTicks } from '@helpers/chart.helper';

@UntilDestroy()
@Component({
  selector: 'app-mempool-block-application',
  templateUrl: './mempool-block-application.component.html',
  styleUrls: ['./mempool-block-application.component.scss'],
  host: { class: 'h-100 overflow-auto d-block' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBlockApplicationComponent implements OnInit {

  mempoolState: MempoolBlockApplicationState;
  readonly curve: any = curveLinear;
  readonly colorScheme: { domain: string[] } = {
    domain: [
      '#46afe3',
      '#ff9f0a',
      '#ffd60a',
      '#32d74b',
      '#bf5af2',
    ]
  };
  readonly yAxisTickFormatting = (value: number) => value === 0 ? 0 : this.nanoTransformPipe.transform(Math.round(Math.pow(10, value)), null, null, 0);
  readonly xAxisTickFormatting = (value: number) => this.spaceNumber.transform(value);
  readonly labelList = ['Total time', 'Data ready', 'Load data', 'Apply block', 'Store result'];
  readonly rotatedLabel = 'Time';
  readonly MATH = Math;
  chartData;

  private isSmallDevice: boolean;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver,
              private spaceNumber: SpaceNumberPipe,
              private nanoTransformPipe: NanoTransformPipe) { }

  ngOnInit(): void {
    this.listenToResizeEvent();
    this.listenToMempoolBlockApplicationStateChange();
    this.triggerDataLoad();
  }

  private listenToMempoolBlockApplicationStateChange(): void {
    this.store.select(mempoolBlockApplication)
      .pipe(untilDestroyed(this), filter(state => !!state.applicationBlocks.length))
      .subscribe((mempoolState: MempoolBlockApplicationState) => {
        this.mempoolState = mempoolState;
        this.chartData = {
          blockApplication: {
            series: [
              {
                name: 'Total time',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: Math.max(Math.log10(block.totalTime), 0),
                  timestamp: block.blockFirstSeen
                }))
              },
              {
                name: 'Data ready',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: Math.max(Math.log10(block.dataReady), 0),
                  timestamp: block.blockFirstSeen
                }))
              },
              {
                name: 'Load data',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: Math.max(Math.log10(block.loadData), 0),
                  timestamp: block.blockFirstSeen
                }))
              },
              {
                name: 'Apply block',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: Math.max(Math.log10(block.applyBlock), 0),
                  timestamp: block.blockFirstSeen
                }))
              },
              {
                name: 'Store result',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: Math.max(Math.log10(block.storeResult), 0),
                  timestamp: block.blockFirstSeen
                }))
              },
            ]
          },
          xTicksValues: []
        };
        const series = this.chartData.blockApplication.series[0].series;
        this.chartData.xTicksValues = getFilteredXTicks(series, Math.min(series.length, this.isSmallDevice ? 3 : 7), 'name');
        this.cdRef.detectChanges();
      });
  }


  private listenToResizeEvent(): void {
    this.isSmallDevice = window.innerWidth < 1100;
    this.breakpointObserver.observe('(min-width: 1100px)')
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(() => {
        this.isSmallDevice = window.innerWidth < 1100;
        this.triggerDataLoad();
      });

    this.store.pipe(
      untilDestroyed(this),
      select(appState),
      skip(1),
      delay(400)
    ).subscribe(() => this.triggerDataLoad());
  }

  private triggerDataLoad(): void {
    this.store.dispatch({ type: MEMPOOL_BLOCK_APPLICATION_LOAD });
  }
}
