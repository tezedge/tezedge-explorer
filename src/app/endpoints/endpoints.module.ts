import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndpointsRoutingModule } from './endpoints-routing.module';
import { EndpointsActionComponent } from '@endpoints/endpoints-action/endpoints-action.component';
import { EndpointsSearchComponent } from '@endpoints/endpoints-search/endpoints-search.component';
import { EndpointsComponent } from '@endpoints/endpoints.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';


@NgModule({
  declarations: [
    EndpointsActionComponent,
    EndpointsSearchComponent,
    EndpointsComponent,
  ],
  imports: [
    CommonModule,
    EndpointsRoutingModule,
    TezedgeSharedModule,
  ]
})
export class EndpointsModule { }
