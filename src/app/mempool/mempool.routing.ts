import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/mempool-operation/mempool-operation.component';
import { MempoolEndorsementComponent } from '@mempool/mempool-endorsement/mempool-endorsement.component';
import { MempoolStatisticsComponent } from '@mempool/mempool-statistics/mempool-statistics.component';
import { MempoolBlockApplicationComponent } from '@mempool/mempool-block-application/mempool-block-application.component';
import { MempoolBakingRightsComponent } from '@mempool/mempool-baking-rights/mempool-baking-rights.component';

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
        path: 'baking',
        component: MempoolBakingRightsComponent,
        children: [
          {
            path: ':block',
            component: MempoolBakingRightsComponent
          }
        ]
      },
      {
        path: 'endorsements',
        component: MempoolEndorsementComponent,
      },
      {
        path: 'pending',
        component: MempoolOperationComponent,
      },
      {
        path: 'statistics',
        component: MempoolStatisticsComponent,
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
    redirectTo: 'endorsements'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MempoolRoutingModule {}
