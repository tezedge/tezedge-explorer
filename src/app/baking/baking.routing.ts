import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BakingComponent } from '@baking/baking/baking.component';

const routes: Routes = [
  {
    path: '',
    component: BakingComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./baking-delegates-table/baking-delegates-table.module').then(m => m.BakingDelegatesTableModule)
      },
      {
        path: ':hash',
        loadChildren: () => import('./baking-delegators-table/baking-delegators-table.module').then(m => m.BakingDelegatorsTableModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BakingRouting {}
