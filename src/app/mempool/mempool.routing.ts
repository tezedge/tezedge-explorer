import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolOperationComponent } from '@mempool/mempool-operation/mempool-operation.component';
import { MempoolEndorsementComponent } from '@mempool/mempool-endorsement/mempool-endorsement.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolComponent,
    children: [
      {
        path: 'operations',
        component: MempoolOperationComponent,
      },
      {
        path: 'endorsements',
        component: MempoolEndorsementComponent,
      },
      {
        path: '',
        redirectTo: 'endorsements'
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
