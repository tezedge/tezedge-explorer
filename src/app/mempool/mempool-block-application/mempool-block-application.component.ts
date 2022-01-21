import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { MEMPOOL_BLOCK_APPLICATION_LOAD } from '@mempool/mempool-block-application/mempool-block-application.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { mempoolBlockApplication } from '@mempool/mempool-block-application/mempool-block-application.reducer';
import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import { curveCardinal } from 'd3-shape';
import { SpaceNumberPipe } from '@shared/pipes/space-number.pipe';
import { NanoTransformPipe } from '@shared/pipes/nano-transform.pipe';

@UntilDestroy()
@Component({
  selector: 'app-mempool-block-application',
  templateUrl: './mempool-block-application.component.html',
  styleUrls: ['./mempool-block-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBlockApplicationComponent implements OnInit {

  mempoolState: MempoolBlockApplicationState;
  readonly curve: any = curveCardinal;
  readonly colorScheme: { domain: string[] } = {
    domain: [
      '#46afe3',
      '#bf5af2',
      '#32d74b',
      '#ff9f0a',
      '#ffd60a',
      '#00dbc6',
      '#ff2d55',
    ]
  };
  readonly yAxisTickFormatting = (value: number) => this.nanoTransformPipe.transform(value);
  readonly xAxisTickFormatting = (value: number) => this.spaceNumber.transform(value);
  readonly labelList = ['Total time', 'Data ready', 'Load data', 'Apply block', 'Store result'];
  readonly rotatedLabel = 'Time';
  chartData;

  constructor(private store: Store<State>,
              private spaceNumber: SpaceNumberPipe,
              private nanoTransformPipe: NanoTransformPipe) { }

  ngOnInit(): void {
    this.store.dispatch({ type: MEMPOOL_BLOCK_APPLICATION_LOAD });
    this.listenToMempoolBlockApplicationStateChange();
  }

  private listenToMempoolBlockApplicationStateChange(): void {
    this.store.select(mempoolBlockApplication)
      .pipe(untilDestroyed(this))
      .subscribe((mempoolState: MempoolBlockApplicationState) => {
        this.mempoolState = mempoolState;
        this.chartData = {
          blockApplication: {
            series: [
              {
                name: 'Total time',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: block.totalTime
                }))
              },
              {
                name: 'Data ready',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: block.dataReady
                }))
              },
              {
                name: 'Load data',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: block.loadData
                }))
              },
              {
                name: 'Apply block',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: block.applyBlock
                }))
              },
              {
                name: 'Store result',
                series: mempoolState.applicationBlocks.map(block => ({
                  name: block.blockLevel.toString(),
                  value: block.storeResult
                }))
              },
            ]
          },
          xTicksValues: []
        };
        const series = this.chartData.blockApplication.series[0].series;
        this.chartData.xTicksValues = this.getFilteredXTicks(series, Math.min(series.length, 7));
        console.log(this.chartData);
      });
  }


  private getFilteredXTicks(series: any[], noOfResults: number): string[] {
    const xTicks = [];
    const delta = Math.floor(series.length / noOfResults);
    for (let i = 0; i <= series.length; i = i + delta) {
      if (series[i]) {
        xTicks.push(series[i].name);
      }
    }
    return xTicks;
  }

}
