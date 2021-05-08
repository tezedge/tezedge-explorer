import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources.routing';
import { ResourcesComponent } from './resources/resources.component';
import { TezedgeSharedModule } from '../shared/tezedge-shared.module';
import { ResourcesSummaryComponent } from './resources-summary/resources-summary.component';
import { TezedgeChartsModule } from '../shared/charts/tezedge-charts.module';
import { ResourcesGraphComponent } from './resources-graph/resources-graph.component';
import { MatTableModule } from '@angular/material/table';
import { ResourcesStorageComponent } from './resources-storage/resources-storage.component';
import { ResourcesStorageMiniGraphComponent } from './resources-storage-mini-graph/resources-storage-mini-graph.component';
import { ResourcesMemoryComponent } from './resources-memory/resources-memory.component';


@NgModule({
  declarations: [
    ResourcesComponent,
    ResourcesSummaryComponent,
    ResourcesGraphComponent,
    ResourcesStorageComponent,
    ResourcesStorageMiniGraphComponent,
    ResourcesMemoryComponent,
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    TezedgeSharedModule,
    TezedgeChartsModule,
    MatTableModule,
  ]
})
export class ResourcesModule {}
