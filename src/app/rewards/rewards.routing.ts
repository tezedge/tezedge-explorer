import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardsComponent } from '@rewards/rewards/rewards.component';

const routes: Routes = [
  {
    path: '',
    component: RewardsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./rewards-delegates-table/rewards-delegates-table.module').then(m => m.RewardsDelegatesTableModule)
      },
      {
        path: ':hash',
        loadChildren: () => import('./rewards-delegators-table/rewards-delegators-table.module').then(m => m.RewardsDelegatorsTableModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardsRouting {}
