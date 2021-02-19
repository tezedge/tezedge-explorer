import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { LineChartComponent } from '@swimlane/ngx-charts';
import { animate, style, transition, trigger } from '@angular/animations';


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

  lineResults = []; // line results are now used for line painting and `results` just for XAxis values

  update(): void {

    if (this.startWithYGridLine) {
      const values = this.results.reduce((accumulator, item) => [...accumulator, ...item.series.map(s => s.value)], []);
      const max = Math.max(...values);
      const length = max.toString().length;
      const step = Math.pow(10, length - 1);
      const lastExtraStep = Math.ceil(max / step) * step;
      this.extraYAxisValues = lastExtraStep - max;
      if ((lastExtraStep / step) % 2 !== 0 && (lastExtraStep / step) > 4) {
        this.extraYAxisValues += step;
      }
    }

    super.update();
    this.removeExtraResultsOfTheLine();
  }

  private removeExtraResultsOfTheLine(): void {
    this.lineResults = [];
    this.results.forEach((item, index) => {
      this.lineResults.push({ ...item });
      this.lineResults[index].series = this.results[index].series.filter(s => s.value !== null && s.value !== undefined);
    });
  }

  getYDomain(): any[] {
    const yDomain = super.getYDomain();
    yDomain[1] = yDomain[1] + this.extraYAxisValues;
    return yDomain;
  }
}
