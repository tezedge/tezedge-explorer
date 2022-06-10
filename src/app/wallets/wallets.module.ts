import { NgModule } from '@angular/core';
import { WalletsRoutingModule } from './wallets-routing.module';
import { WalletsComponent } from '@wallets/wallets.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    WalletsComponent,
  ],
  imports: [
    WalletsRoutingModule,
    TezedgeSharedModule,
    ClipboardModule,
  ]
})
export class WalletsModule {}
