import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MempoolRoutingModule } from './mempool.routing';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/mempool-operation/mempool-operation.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolEndorsementComponent } from './mempool-endorsement/mempool-endorsement.component';
import { MempoolEndorsementStatisticsComponent } from './mempool-endorsement-statistics/mempool-endorsement-statistics.component';
import { MempoolBroadcastComponent } from './mempool-broadcast/mempool-broadcast.component';


@NgModule({
  declarations: [
    MempoolComponent,
    MempoolOperationComponent,
    MempoolEndorsementComponent,
    MempoolEndorsementStatisticsComponent,
    MempoolBroadcastComponent,
  ],
  imports: [
    CommonModule,
    MempoolRoutingModule,
    TezedgeSharedModule
  ]
})
export class MempoolModule {}
