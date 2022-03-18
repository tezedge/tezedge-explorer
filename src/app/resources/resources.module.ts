import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from '@resources/resources.routing';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { ResourcesComponent } from '@resources/resources/resources.component';
import { SystemResourcesPanelComponent } from '@resources/system-resources-panel/system-resources-panel.component';
import { SystemResourcesGraphComponent } from '@resources/system-resources-graph/system-resources-graph.component';
import { SystemResourcesComponent } from '@resources/system-resources/system-resources.component';
import { StorageResourcesComponent } from '@resources/storage-resources/storage-resources.component';
import { StorageResourcesMiniGraphComponent } from '@resources/storage-resources-mini-graph/storage-resources-mini-graph.component';
import { StorageResourcesOverviewComponent } from '@resources/storage-resources-overview/storage-resources-overview.component';
import { MemoryResourcesComponent } from '@resources/memory-resources/memory-resources.component';


@NgModule({
  declarations: [
    ResourcesComponent,
    SystemResourcesPanelComponent,
    SystemResourcesGraphComponent,
    SystemResourcesComponent,
    StorageResourcesComponent,
    StorageResourcesMiniGraphComponent,
    StorageResourcesOverviewComponent,
    MemoryResourcesComponent,
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    TezedgeSharedModule,
  ],
})
export class ResourcesModule {}
