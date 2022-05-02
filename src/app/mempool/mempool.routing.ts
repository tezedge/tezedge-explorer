import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/operation/mempool-operation/mempool-operation.component';
import { MempoolStatisticsComponent } from '@mempool/statistics/mempool-statistics/mempool-statistics.component';
import { MempoolBlockApplicationComponent } from '@mempool/block-application/mempool-block-application/mempool-block-application.component';
import { MempoolBakingRightsComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolComponent,
    children: [
      {
        path: 'block-application',
        component: MempoolBlockApplicationComponent,
      },
      {
        path: 'pending',
        component: MempoolOperationComponent,
      },
      {
        path: 'statistics',
        component: MempoolStatisticsComponent,
        children: [
          {
            path: ':operation',
            component: MempoolBakingRightsComponent
          }
        ]
      },
      {
        path: 'consensus',
        loadChildren: () => import('./consensus/mempool-consensus.module').then(m => m.MempoolConsensusModule)
      },
      {
        path: '',
        redirectTo: 'block-application'
      },
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'block-application'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MempoolRoutingModule {}
