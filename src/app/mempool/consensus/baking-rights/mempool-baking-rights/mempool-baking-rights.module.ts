import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MempoolBakingRightsRouting } from './mempool-baking-rights.routing';
import { MempoolBakingRightsComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.component';
import { MempoolBakingRightsDetailsComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights-details/mempool-baking-rights-details.component';
import { MempoolBakingRightsGraphComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights-graph/mempool-baking-rights-graph.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolSharedModule } from '@mempool/_common/mempool-shared.module';
import { EffectsModule } from '@ngrx/effects';
import { MempoolBakingRightsEffects } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.effects';


@NgModule({
  declarations: [
    MempoolBakingRightsComponent,
    MempoolBakingRightsDetailsComponent,
    MempoolBakingRightsGraphComponent,
  ],
  imports: [
    CommonModule,
    MempoolBakingRightsRouting,
    TezedgeSharedModule,
    MempoolSharedModule,
    EffectsModule.forFeature([MempoolBakingRightsEffects])
  ]
})
export class MempoolBakingRightsModule {}
