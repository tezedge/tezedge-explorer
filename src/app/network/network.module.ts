import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkRoutingModule } from './network.routing';
import { NetworkComponent } from '@network/network.component';
import { NetworkPeersComponent } from '@network/network-peers/network-peers.component';
import { NetworkStatsComponent } from '@network/network-stats/network-stats.component';
import { NetworkHistoryComponent } from '@network/network-history/network-history.component';
import { BandwidthPipe } from '@shared/pipes/bandwidth.pipe';
import { NetworkActionComponent } from '@network/network-action/network-action.component';
import { NetworkSearchComponent } from '@network/network-search/network-search.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';


@NgModule({
  declarations: [
    NetworkComponent,
    NetworkPeersComponent,
    NetworkStatsComponent,
    NetworkHistoryComponent,
    NetworkActionComponent,
    NetworkSearchComponent,
    BandwidthPipe,
  ],
  imports: [
    CommonModule,
    NetworkRoutingModule,
    TezedgeSharedModule,
  ],
  exports: [
    NetworkStatsComponent,
    NetworkHistoryComponent,
    NetworkPeersComponent
  ],
})
export class NetworkModule {}
