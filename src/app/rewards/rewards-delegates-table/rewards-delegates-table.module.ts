import { NgModule } from '@angular/core';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { RewardsDelegatesTableComponent } from '@rewards/rewards-delegates-table/rewards-delegates-table.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RewardsDelegatesTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardsDelegatesTableRouting {}


@NgModule({
  declarations: [
    RewardsDelegatesTableComponent
  ],
  imports: [
    TezedgeSharedModule,
    RewardsDelegatesTableRouting,
  ]
})
export class RewardsDelegatesTableModule {}
