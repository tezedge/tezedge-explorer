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
import { MemoryResourcesComponent } from './memory-resources/memory-resources.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    ResourcesComponent,
    ResourcesSummaryComponent,
    ResourcesGraphComponent,
    ResourcesStorageComponent,
    ResourcesStorageMiniGraphComponent,
    MemoryResourcesComponent,
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    TezedgeSharedModule,
    TezedgeChartsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
  ],
})
export class ResourcesModule {}
