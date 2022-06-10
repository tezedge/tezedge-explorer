import { NgModule } from '@angular/core';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { BakingDelegatesTableComponent } from '@baking/baking-delegates-table/baking-delegates-table.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BakingDelegatesTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BakingDelegatesTableRouting {}


@NgModule({
  declarations: [
    BakingDelegatesTableComponent
  ],
  imports: [
    TezedgeSharedModule,
    BakingDelegatesTableRouting,
  ]
})
export class BakingDelegatesTableModule {}
