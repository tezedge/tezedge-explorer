import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolComponent } from '@mempool/mempool.component';
import { MempoolActionComponent } from '@mempool/mempool-action/mempool-action.component';
import { MempoolEndorsementComponent } from '@mempool/mempool-endorsement/mempool-endorsement.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolComponent,
    children: [
      {
        path: 'operations',
        component: MempoolActionComponent,
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
