import { NgModule } from '@angular/core';
import { NetworkRoutingModule } from './network.routing';
import { NetworkComponent } from '@network/network.component';
import { NetworkActionComponent } from '@network/network-action/network-action.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';


@NgModule({
  declarations: [
    NetworkComponent,
    NetworkActionComponent,
  ],
  imports: [
    NetworkRoutingModule,
    TezedgeSharedModule,
  ],
})
export class NetworkModule {}
