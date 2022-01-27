import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TezedgeLineChartComponent } from './tezedge-line-chart/tezedge-line-chart.component';
import { TezedgeChartsCircleSeriesComponent } from './tezedge-charts-circle-series/tezedge-charts-circle-series.component';
import { TezedgeChartsTooltipAreaComponent } from './tezedge-charts-tooltip-area/tezedge-charts-tooltip-area.component';
import { GraphRedirectionOverlayComponent } from './graph-redirection-overlay/graph-redirection-overlay.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    TezedgeLineChartComponent,
    TezedgeChartsCircleSeriesComponent,
    TezedgeChartsTooltipAreaComponent,
    GraphRedirectionOverlayComponent,
  ],
  imports: [
    CommonModule,
    NgxChartsModule,
    MatIconModule,
  ],
  exports: [
    TezedgeLineChartComponent,
  ]
})
export class TezedgeChartsModule {}
