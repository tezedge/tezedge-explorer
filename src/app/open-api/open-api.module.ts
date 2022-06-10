import { NgModule } from '@angular/core';

import { OpenApiRoutingModule } from './open-api-routing.module';
import { OpenApiComponent } from './open-api/open-api.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MemoryProfilerOpenApiComponent } from './memory-profiler-open-api/memory-profiler-open-api.component';
import { NetworkRecorderOpenApiComponent } from './network-recorder-open-api/network-recorder-open-api.component';
import { NodeOpenApiComponent } from './node-open-api/node-open-api.component';


@NgModule({
  declarations: [
    OpenApiComponent,
    NodeOpenApiComponent,
    MemoryProfilerOpenApiComponent,
    NetworkRecorderOpenApiComponent,
  ],
  imports: [
    TezedgeSharedModule,
    OpenApiRoutingModule,
  ]
})
export class OpenApiModule { }
