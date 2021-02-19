import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CircleSeriesComponent } from '@swimlane/ngx-charts';

@Component({
  selector: 'g[tezedge-charts-circle-series]',
  templateUrl: './tezedge-charts-circle-series.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate(250, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class TezedgeChartsCircleSeriesComponent extends CircleSeriesComponent {

  @Input() circleAtTheEnd: boolean;

  endOfLineCircle: any;

  update(): void {
    super.update();
    const lastIndex = this.data.series.length - 1;
    if (this.circleAtTheEnd) {
      this.endOfLineCircle = this.mapDataPointToCircle(this.data.series[lastIndex], lastIndex);
    }
  }
}
