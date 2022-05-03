import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MempoolConsensusRouting } from './mempool-consensus.routing';
import { MempoolConsensusComponent } from './mempool-consensus.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolSharedModule } from '@mempool/_common/mempool-shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MempoolConsensusEffects } from '@mempool/consensus/mempool-consensus.effects';


@NgModule({
  declarations: [
    MempoolConsensusComponent,
  ],
  imports: [
    CommonModule,
    MempoolConsensusRouting,
    TezedgeSharedModule,
    MempoolSharedModule,
    EffectsModule.forFeature([MempoolConsensusEffects])
  ]
})
export class MempoolConsensusModule {}
