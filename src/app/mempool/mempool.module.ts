import { NgModule } from '@angular/core';
import { MempoolRoutingModule } from './mempool.routing';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/operation/mempool-operation/mempool-operation.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolStatisticsComponent } from './statistics/mempool-statistics/mempool-statistics.component';
import { MempoolStatisticsDetailsComponent } from './statistics/mempool-statistics-details/mempool-statistics-details.component';
import { MempoolBlockApplicationComponent } from './block-application/mempool-block-application/mempool-block-application.component';
import { MempoolBlockApplicationDetailsComponent } from './block-application/mempool-block-application-details/mempool-block-application-details.component';
import { MempoolSharedModule } from '@mempool/_common/mempool-shared.module';


@NgModule({
  declarations: [
    MempoolComponent,
    MempoolOperationComponent,
    MempoolStatisticsComponent,
    MempoolStatisticsDetailsComponent,
    MempoolBlockApplicationDetailsComponent,
    MempoolBlockApplicationComponent,
  ],
  imports: [
    MempoolRoutingModule,
    TezedgeSharedModule,
    MempoolSharedModule,
  ]
})
export class MempoolModule {}
