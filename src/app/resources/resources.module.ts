import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources.routing';
import { ResourcesComponent } from './resources/resources.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { SystemResourcesPanelComponent } from './system-resources-panel/system-resources-panel.component';
import { TezedgeChartsModule } from '@shared/charts/tezedge-charts.module';
import { SystemResourcesGraphComponent } from './system-resources-graph/system-resources-graph.component';
import { StorageResourcesComponent } from './storage-resources/storage-resources.component';
import { StorageResourcesMiniGraphComponent } from './storage-resources-mini-graph/storage-resources-mini-graph.component';
import { MemoryResourcesComponent } from './memory-resources/memory-resources.component';
import { SystemResourcesComponent } from './system-resources/system-resources.component';
import { StorageResourcesOverviewComponent } from './storage-resources-overview/storage-resources-overview.component';


@NgModule({
  declarations: [
    ResourcesComponent,
    SystemResourcesPanelComponent,
    SystemResourcesGraphComponent,
    StorageResourcesComponent,
    StorageResourcesMiniGraphComponent,
    MemoryResourcesComponent,
    SystemResourcesComponent,
    StorageResourcesOverviewComponent,
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    TezedgeSharedModule,
    TezedgeChartsModule,
  ],
})
export class ResourcesModule {}
