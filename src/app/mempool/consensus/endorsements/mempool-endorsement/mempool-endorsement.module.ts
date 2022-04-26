import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MempoolEndorsementRouting } from './mempool-endorsement.routing';
import { MempoolEndorsementComponent } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.component';
import { MempoolEndorsementStatisticsComponent } from '@mempool/consensus/endorsements/mempool-endorsement-statistics/mempool-endorsement-statistics.component';
import { MempoolEndorsementsGraphComponent } from '@mempool/consensus/endorsements/mempool-endorsements-graph/mempool-endorsements-graph.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolSharedModule } from '@mempool/_common/mempool-shared.module';
import { EffectsModule } from '@ngrx/effects';
import { MempoolEndorsementEffects } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.effects';


@NgModule({
  declarations: [
    MempoolEndorsementComponent,
    MempoolEndorsementStatisticsComponent,
    MempoolEndorsementsGraphComponent,
  ],
  imports: [
    CommonModule,
    MempoolEndorsementRouting,
    TezedgeSharedModule,
    MempoolSharedModule,
    EffectsModule.forFeature([MempoolEndorsementEffects]),
  ],
})
export class MempoolEndorsementModule {}
