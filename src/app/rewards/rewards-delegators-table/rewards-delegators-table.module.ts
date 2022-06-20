import { NgModule } from '@angular/core';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { RouterModule, Routes } from '@angular/router';
import { RewardsDelegatorsTableComponent } from '@rewards/rewards-delegators-table/rewards-delegators-table.component';

const routes: Routes = [
  {
    path: '',
    component: RewardsDelegatorsTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardsDelegatorsTableRouting {}


@NgModule({
  declarations: [
    RewardsDelegatorsTableComponent,
  ],
  imports: [
    TezedgeSharedModule,
    RewardsDelegatorsTableRouting,
  ]
})
export class RewardsDelegatorsTableModule {}
