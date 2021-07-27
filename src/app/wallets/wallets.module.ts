import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletsRoutingModule } from './wallets-routing.module';
import { WalletsComponent } from '@wallets/wallets.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    WalletsComponent,
  ],
  imports: [
    CommonModule,
    WalletsRoutingModule,
    TezedgeSharedModule,
    ClipboardModule,
  ]
})
export class WalletsModule {}
