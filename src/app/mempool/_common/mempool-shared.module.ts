import { NgModule } from '@angular/core';
import { MempoolBlockDetailsComponent } from '@mempool/_common/mempool-block-details/mempool-block-details.component';
import { MempoolCountGraphComponent } from '@mempool/_common/mempool-count-graph/mempool-count-graph.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';

const COMPONENTS = [
  MempoolBlockDetailsComponent,
  MempoolCountGraphComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    TezedgeSharedModule,
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class MempoolSharedModule {}
