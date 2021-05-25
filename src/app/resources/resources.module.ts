import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources.routing';
import { ResourcesComponent } from './resources/resources.component';
import { TezedgeSharedModule } from '../shared/tezedge-shared.module';
import { ResourcesSummaryComponent } from './resources-summary/resources-summary.component';
import { TezedgeChartsModule } from '../shared/charts/tezedge-charts.module';
import { ResourcesGraphComponent } from './resources-graph/resources-graph.component';
import { MatTableModule } from '@angular/material/table';
import { StorageResourcesComponent } from './storage-resources/storage-resources.component';
import { StorageResourcesMiniGraphComponent } from './storage-resources-mini-graph/storage-resources-mini-graph.component';
import { MemoryResourcesComponent } from './memory-resources/memory-resources.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    ResourcesComponent,
    ResourcesSummaryComponent,
    ResourcesGraphComponent,
    StorageResourcesComponent,
    StorageResourcesMiniGraphComponent,
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
    MatTooltipModule,
  ],
})
export class ResourcesModule {}
