import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MempoolRoutingModule } from './mempool.routing';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolActionComponent } from '@mempool/mempool-action/mempool-action.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolEndorsementComponent } from './mempool-endorsement/mempool-endorsement.component';
import { MempoolEndorsementStatisticsComponent } from './mempool-endorsement-statistics/mempool-endorsement-statistics.component';
import { NanoTransformPipe } from './mempool-endorsement/nano-transform.pipe';


@NgModule({
  declarations: [
    MempoolComponent,
    MempoolActionComponent,
    MempoolEndorsementComponent,
    MempoolEndorsementStatisticsComponent,
    NanoTransformPipe,
  ],
  imports: [
    CommonModule,
    MempoolRoutingModule,
    TezedgeSharedModule
  ]
})
export class MempoolModule { }
