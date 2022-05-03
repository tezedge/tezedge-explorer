import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CurveFactory, curveLinear } from 'd3-shape';
import { NANOSECOND_FACTOR, ONE_HUNDRED_MS } from '@shared/constants/unit-measurements';
import { MempoolEndorsementState, selectMempoolEndorsementState } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.index';

class CharLineSeries {
  name: string;
  value: number;
  step: string;
  slots: number;
}

class ChartLine {
  name: string;
  series: CharLineSeries[];
}

@UntilDestroy()
@Component({
  selector: 'app-mempool-endorsements-graph',
  templateUrl: './mempool-endorsements-graph.component.html',
  styleUrls: ['./mempool-endorsements-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolEndorsementsGraphComponent implements OnInit {

  @Input() quorumTime: number;

  readonly curve: CurveFactory = curveLinear;
  readonly xTicksValues: string[] = ['0', '1000000000', '2000000000', '3000000000', '4000000000', '5000000000', '6000000000', '7000000000', '8000000000', '9000000000', '10000000000'];

  bakerTimes: number[] = [];
  indexOfQuorumEndorsement: number;
  chartLines: ChartLine[];
  pageType: string;
  private steps: number[] = this.getSteps();

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly xAxisTickFormatting = (value: string) => (value !== '0' ? Number(value) / NANOSECOND_FACTOR : value) + 's';
  readonly yAxisTickFormatting = (value: string) => value + '%';

  ngOnInit(): void {
    this.chartLines = [{
      name: 'Slots',
      series: this.buildChartLines()
    }];

    this.listenToEndorsementsChange();
  }

  private listenToEndorsementsChange(): void {
    this.store.select(selectMempoolEndorsementState)
      .pipe(untilDestroyed(this))
      .subscribe((state: MempoolEndorsementState) => {
        this.bakerTimes = state.endorsements.map(e => e.receiveHashTime).filter(t => t !== undefined && t !== null);
        this.pageType = state.pageType;
        this.indexOfQuorumEndorsement = null;

        this.chartLines[0].series.forEach((entry, i) => {
          const sum = state.endorsements
            .filter(e => e.broadcastTime <= Number(entry.name))
            .reduce((acc, curr) => acc + curr.slotsLength, 0);
          entry.value = sum * 100 / state.statistics.totalSlots;
          if (!this.indexOfQuorumEndorsement && entry.value > 66.67) {
            this.indexOfQuorumEndorsement = i;
          }
          entry.slots = sum;
        });
        this.chartLines = [...this.chartLines];
        this.cdRef.detectChanges();
      });
  }

  private buildChartLines(): CharLineSeries[] {
    const seriesObj: { [p: number]: { value: number, range: string } } = this.steps.reduce((acc, curr: number, i: number) => ({
      ...acc,
      [curr]: {
        value: 0,
        range: i === this.steps.length - 1
          ? '> 10s'
          : `${(curr + ONE_HUNDRED_MS) / NANOSECOND_FACTOR}s`
      }
    }), {});

    return Object.keys(seriesObj).map((key: string) => ({
      name: key,
      value: seriesObj[key].value,
      step: seriesObj[key].range,
      slots: 0
    }));
  }

  private getSteps(): number[] {
    const res = [0];
    let i = ONE_HUNDRED_MS;
    while (i <= NANOSECOND_FACTOR * 10) {
      res.push(i);
      i = i + ONE_HUNDRED_MS;
    }
    return res;
  }
}
