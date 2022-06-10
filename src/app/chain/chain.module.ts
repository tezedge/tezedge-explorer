import { NgModule } from '@angular/core';
import { ChainRoutingModule } from './chain-routing.module';
import { ChainComponent } from '@chain/chain.component';
import { ChainServerComponent } from '@chain/chain-server/chain-server.component';
import { ChainConfigComponent } from '@chain/chain-config/chain-config.component';
import { ChainWalletsComponent } from '@chain/chain-wallets/chain-wallets.component';
import { ChainBakingComponent } from '@chain/chain-baking/chain-baking.component';
import { ChainFinishComponent } from '@chain/chain-finish/chain-finish.component';
import { ChainOtherComponent } from '@chain/chain-other/chain-other.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';


@NgModule({
  declarations: [
    ChainComponent,
    ChainServerComponent,
    ChainConfigComponent,
    ChainWalletsComponent,
    ChainBakingComponent,
    ChainFinishComponent,
    ChainOtherComponent,
  ],
  exports: [
    ChainServerComponent,
    ChainWalletsComponent,
    ChainConfigComponent
  ],
  imports: [
    ChainRoutingModule,
    TezedgeSharedModule,
  ]
})
export class ChainModule { }
