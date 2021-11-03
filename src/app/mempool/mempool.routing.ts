import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/operation/mempool-operation/mempool-operation.component';
import { MempoolEndorsementComponent } from '@mempool/endorsements/mempool-endorsement/mempool-endorsement.component';
import { MempoolStatisticsComponent } from '@mempool/statistics/mempool-statistics/mempool-statistics.component';
import { MempoolBlockApplicationComponent } from '@mempool/block-application/mempool-block-application/mempool-block-application.component';
import { MempoolBakingRightsComponent } from '@mempool/baking-rights/mempool-baking-rights/mempool-baking-rights.component';
import { MempoolPreEndorsementComponent } from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.component';

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
        path: 'proposal',
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
        path: 'preendorsements',
        component: MempoolPreEndorsementComponent,
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
