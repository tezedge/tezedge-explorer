import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MempoolRoutingModule } from './mempool-routing.module';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolActionComponent } from '@mempool/mempool-action/mempool-action.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';


@NgModule({
  declarations: [
    MempoolComponent,
    MempoolActionComponent,
  ],
  imports: [
    CommonModule,
    MempoolRoutingModule,
    TezedgeSharedModule
  ]
})
export class MempoolModule { }
