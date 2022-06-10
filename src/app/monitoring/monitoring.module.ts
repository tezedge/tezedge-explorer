import { NgModule } from '@angular/core';

import { MonitoringRouting } from './monitoring.routing';
import { MonitoringComponent } from '@monitoring/monitoring.component';
import { NetworkHistoryComponent } from '@monitoring/network-history/network-history.component';
import { NetworkPeersComponent } from '@monitoring/network-peers/network-peers.component';
import { NetworkStatsComponent } from '@monitoring/network-stats/network-stats.component';
import { BandwidthPipe } from '@shared/pipes/bandwidth.pipe';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';


@NgModule({
  declarations: [
    MonitoringComponent,
    NetworkHistoryComponent,
    NetworkPeersComponent,
    NetworkStatsComponent,
    BandwidthPipe,
  ],
  imports: [
    MonitoringRouting,
    TezedgeSharedModule,
  ]
})
export class MonitoringModule {}
