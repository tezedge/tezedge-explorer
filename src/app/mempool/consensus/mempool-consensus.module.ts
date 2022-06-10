import { NgModule } from '@angular/core';

import { MempoolConsensusRouting } from './mempool-consensus.routing';
import { MempoolConsensusComponent } from './mempool-consensus.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MempoolSharedModule } from '@mempool/_common/mempool-shared.module';
import { EffectsModule } from '@ngrx/effects';
import { MempoolConsensusEffects } from '@mempool/consensus/mempool-consensus.effects';


@NgModule({
  declarations: [
    MempoolConsensusComponent,
  ],
  imports: [
    MempoolConsensusRouting,
    TezedgeSharedModule,
    MempoolSharedModule,
    EffectsModule.forFeature([MempoolConsensusEffects])
  ]
})
export class MempoolConsensusModule {}
