import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MempoolRoutingModule } from './mempool.routing';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/mempool-operation/mempool-operation.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolEndorsementComponent } from './mempool-endorsement/mempool-endorsement.component';
import { MempoolEndorsementStatisticsComponent } from './mempool-endorsement-statistics/mempool-endorsement-statistics.component';
import { MempoolStatisticsComponent } from './mempool-statistics/mempool-statistics.component';
import { MempoolStatisticsDetailsComponent } from './mempool-statistics-details/mempool-statistics-details.component';
import { MempoolBlockApplicationComponent } from './mempool-block-application/mempool-block-application.component';
import { MempoolBakingRightsComponent } from './mempool-baking-rights/mempool-baking-rights.component';
import { MempoolBakingRightsDetailsComponent } from './mempool-baking-rights-details/mempool-baking-rights-details.component';
import { MempoolBakingRightsGraphComponent } from './mempool-baking-rights-graph/mempool-baking-rights-graph.component';
import { MempoolBlockApplicationDetailsComponent } from './mempool-block-application-details/mempool-block-application-details.component';
import { MempoolBlockDetailsComponent } from './mempool-block-details/mempool-block-details.component';


@NgModule({
  declarations: [
    MempoolComponent,
    MempoolOperationComponent,
    MempoolEndorsementComponent,
    MempoolEndorsementStatisticsComponent,
    MempoolStatisticsComponent,
    MempoolStatisticsDetailsComponent,
    MempoolBlockApplicationComponent,
    MempoolBakingRightsComponent,
    MempoolBakingRightsDetailsComponent,
    MempoolBakingRightsGraphComponent,
    MempoolBlockApplicationDetailsComponent,
    MempoolBlockDetailsComponent,
  ],
  imports: [
    CommonModule,
    MempoolRoutingModule,
    TezedgeSharedModule,
  ]
})
export class MempoolModule {}
