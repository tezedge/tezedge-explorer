import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenApiRoutingModule } from './open-api-routing.module';
import { OpenApiComponent } from './open-api/open-api.component';
import { TezedgeSharedModule } from '../shared/tezedge-shared.module';
import { DebuggerOpenApiComponent } from './debugger-open-api/debugger-open-api.component';
import { ProtocolOpenApiComponent } from './protocol-open-api/protocol-open-api.component';
import { NodeOpenApiComponent } from './node-open-api/node-open-api.component';


@NgModule({
  declarations: [
    OpenApiComponent,
    NodeOpenApiComponent,
    DebuggerOpenApiComponent,
    ProtocolOpenApiComponent,
  ],
  imports: [
    CommonModule,
    TezedgeSharedModule,
    OpenApiRoutingModule,
  ]
})
export class OpenApiModule { }
