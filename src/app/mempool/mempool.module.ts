import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MempoolRoutingModule } from './mempool.routing';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/operation/mempool-operation/mempool-operation.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolEndorsementComponent } from './endorsements/mempool-endorsement/mempool-endorsement.component';
import { MempoolEndorsementStatisticsComponent } from './endorsements/mempool-endorsement-statistics/mempool-endorsement-statistics.component';
import { MempoolStatisticsComponent } from './statistics/mempool-statistics/mempool-statistics.component';
import { MempoolStatisticsDetailsComponent } from './statistics/mempool-statistics-details/mempool-statistics-details.component';
import { MempoolBlockApplicationComponent } from './block-application/mempool-block-application/mempool-block-application.component';
import { MempoolBakingRightsComponent } from './baking-rights/mempool-baking-rights/mempool-baking-rights.component';
import { MempoolBakingRightsDetailsComponent } from './baking-rights/mempool-baking-rights-details/mempool-baking-rights-details.component';
import { MempoolBakingRightsGraphComponent } from './baking-rights/mempool-baking-rights-graph/mempool-baking-rights-graph.component';
import { MempoolBlockApplicationDetailsComponent } from './block-application/mempool-block-application-details/mempool-block-application-details.component';
import { MempoolBlockDetailsComponent } from './_common/mempool-block-details/mempool-block-details.component';
import { MempoolBakingRightFiltersComponent } from './baking-rights/mempool-baking-right-filters/mempool-baking-right-filters.component';
import { MempoolEndorsementFiltersComponent } from './endorsements/mempool-endorsement-filters/mempool-endorsement-filters.component';
import { MempoolPreEndorsementComponent } from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.component';
import {
  MempoolPreEndorsementStatisticsComponent
} from '@mempool/preendorsements/mempool-pre-endorsement-statistics/mempool-pre-endorsement-statistics.component';
import { MempoolCountGraphComponent } from './_common/mempool-count-graph/mempool-count-graph.component';
import { MempoolEndorsementsGraphComponent } from './endorsements/mempool-endorsements-graph/mempool-endorsements-graph.component';
import { MempoolPreendorsementsGraphComponent } from './preendorsements/mempool-preendorsements-graph/mempool-preendorsements-graph.component';


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
    MempoolBakingRightFiltersComponent,
    MempoolEndorsementFiltersComponent,
    MempoolPreEndorsementComponent,
    MempoolPreEndorsementStatisticsComponent,
    MempoolCountGraphComponent,
    MempoolEndorsementsGraphComponent,
    MempoolPreendorsementsGraphComponent,
  ],
  imports: [
    CommonModule,
    MempoolRoutingModule,
    TezedgeSharedModule,
  ]
})
export class MempoolModule {}
