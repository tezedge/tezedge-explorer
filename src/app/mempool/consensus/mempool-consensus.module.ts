import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MempoolConsensusRouting } from './mempool-consensus.routing';
import { MempoolConsensusComponent } from './mempool-consensus.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolSharedModule } from '@mempool/_common/mempool-shared.module';
import { MempoolBakingRightsComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.component';
import { MempoolBakingRightsDetailsComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights-details/mempool-baking-rights-details.component';
import { MempoolBakingRightsGraphComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights-graph/mempool-baking-rights-graph.component';
import { MempoolBakingRightFiltersComponent } from '@mempool/consensus/baking-rights/mempool-baking-right-filters/mempool-baking-right-filters.component';
import { MempoolEndorsementComponent } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.component';
import { MempoolEndorsementStatisticsComponent } from '@mempool/consensus/endorsements/mempool-endorsement-statistics/mempool-endorsement-statistics.component';
import { MempoolEndorsementsGraphComponent } from '@mempool/consensus/endorsements/mempool-endorsements-graph/mempool-endorsements-graph.component';
import { MempoolPreEndorsementComponent } from '@mempool/consensus/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.component';
import {
  MempoolPreEndorsementStatisticsComponent
} from '@mempool/consensus/preendorsements/mempool-pre-endorsement-statistics/mempool-pre-endorsement-statistics.component';
import { MempoolPreendorsementsGraphComponent } from '@mempool/consensus/preendorsements/mempool-preendorsements-graph/mempool-preendorsements-graph.component';


@NgModule({
  declarations: [
    MempoolConsensusComponent,
    MempoolBakingRightsComponent,
    MempoolBakingRightsDetailsComponent,
    MempoolBakingRightsGraphComponent,
    MempoolBakingRightFiltersComponent,
    MempoolEndorsementComponent,
    MempoolEndorsementStatisticsComponent,
    MempoolEndorsementsGraphComponent,
    MempoolPreEndorsementComponent,
    MempoolPreEndorsementStatisticsComponent,
    MempoolPreendorsementsGraphComponent,
  ],
  imports: [
    CommonModule,
    MempoolConsensusRouting,
    TezedgeSharedModule,
    MempoolSharedModule,
  ]
})
export class MempoolConsensusModule {}
