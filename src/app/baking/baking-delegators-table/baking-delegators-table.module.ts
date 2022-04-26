import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { RouterModule, Routes } from '@angular/router';
import { BakingDelegatorsTableComponent } from '@baking/baking-delegators-table/baking-delegators-table.component';

const routes: Routes = [
  {
    path: '',
    component: BakingDelegatorsTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BakingDelegatorsTableRouting {}


@NgModule({
  declarations: [
    BakingDelegatorsTableComponent,
  ],
  imports: [
    CommonModule,
    TezedgeSharedModule,
    BakingDelegatorsTableRouting,
  ]
})
export class BakingDelegatorsTableModule {}
