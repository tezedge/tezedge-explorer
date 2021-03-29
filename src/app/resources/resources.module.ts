import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ResourcesRoutingModule } from './resources.routing';
import { ResourcesComponent } from './resources/resources.component';
import { TezedgeSharedModule } from '../shared/tezedge-shared.module';
import { ResourcesSummaryComponent } from './resources-summary/resources-summary.component';
import { TezedgeChartsModule } from '../shared/charts/tezedge-charts.module';
import { ResourcesGraphComponent } from './resources-graph/resources-graph.component';


@NgModule({
  declarations: [
    ResourcesComponent,
    ResourcesSummaryComponent,
    ResourcesGraphComponent,
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    TezedgeSharedModule,
    TezedgeChartsModule,
  ]
})
export class ResourcesModule {}
