import { NgModule } from '@angular/core';

import { ResourcesRoutingModule } from '@resources/resources.routing';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { ResourcesComponent } from '@resources/resources/resources.component';
import { MemoryResourcesComponent } from '@resources/memory-resources/memory-resources.component';
import { StateResourcesComponent } from './state-resources/state-resources/state-resources.component';
import { SystemResourcesPanelComponent } from '@resources/system-resource/system-resources-panel/system-resources-panel.component';
import { SystemResourcesGraphComponent } from '@resources/system-resource/system-resources-graph/system-resources-graph.component';
import { StorageResourcesOverviewComponent } from '@resources/storage-resource/storage-resources-overview/storage-resources-overview.component';
import { StorageResourcesMiniGraphComponent } from '@resources/storage-resource/storage-resources-mini-graph/storage-resources-mini-graph.component';
import { SystemResourcesComponent } from '@resources/system-resource/system-resources/system-resources.component';
import { StorageResourcesComponent } from '@resources/storage-resource/storage-resources/storage-resources.component';
import { StateResourcesMiniGraphComponent } from '@resources/state-resources/state-resources-mini-graph/state-resources-mini-graph.component';
import { StateResourcesOverviewComponent } from './state-resources/state-resources-overview/state-resources-overview.component';
import { StateResourcesActionFiltersComponent } from './state-resources/state-resources-action-filters/state-resources-action-filters.component';
import { StateResourcesBlockFiltersComponent } from '@resources/state-resources/state-resources-block-filters/state-resources-block-filters.component';


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
    StateResourcesComponent,
    StateResourcesMiniGraphComponent,
    StateResourcesOverviewComponent,
    StateResourcesActionFiltersComponent,
    StateResourcesBlockFiltersComponent,
  ],
  imports: [
    ResourcesRoutingModule,
    TezedgeSharedModule,
  ],
})
export class ResourcesModule {}
